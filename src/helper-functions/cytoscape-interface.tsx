import { Core, EdgeCollection, EdgeSingular, NodeSingular } from "cytoscape";
import { masterModelRoot, MMNode, MMRoot, NodeType } from "../model/master-model";
import { edgeArray, derivedEdgeArray, MMEdge, EdgeArray, EdgeType } from '../model/edge-model';
import { eleCounter } from './elementCounter';
import { ACTIONS } from "../components/App";
import { DiagramTreeNode } from "../model/diagram-tree-model";


let currentMMNode = masterModelRoot;


interface NodeData {
  id: string,
  label: string,
  type: NodeType,
  MMRef: MMNode | null,
  parent: string;
}

interface EdgeData {
  id: string,
  label: string,
  type: EdgeType,
  MMRef: MMEdge | null,
  source: MMNode,
  target: MMNode,
}

const cyAddNode = (cy: Core, data: NodeData, position = { x: 0, y: 0 }, parentMMNode: MMNode | MMRoot) => {
  data['label'] = data['label'].charAt(0).toUpperCase() + data['label'].substring(1).toLowerCase();
  if (data['MMRef'] === null) {
    let modelNode = new MMNode(data['id'], data['type'], data['label']);
    parentMMNode.addChild(modelNode);
    data['MMRef'] = modelNode;
  }
  cy.add({
    data: data,
    position: position
  });
};



const cyAddEdge = (cy: Core, data: EdgeData, shouldPropagate:boolean = false): EdgeSingular => {
  if (data['MMRef'] === null) {
    let modelEdge = new MMEdge(data['id'], data['source'], data['target'], data['type'], shouldPropagate);
    edgeArray.addEdge(modelEdge);
    data['MMRef'] = modelEdge;
  }

  const addedEdge = cy.add({
    data: {
      ...data,
      source: data['source'].id,
      target: data['target'].id,
    }

  });
  return addedEdge;
};

const removeNodeContextMenu = (node: NodeSingular, dispatch: Function) => {
  const MMRef = node.data('MMRef') as MMNode;

  if (MMRef.diagram !== null) {
    const diagram = MMRef.diagram;
    diagram.parent?.removeChild(diagram);
    dispatch({ type: ACTIONS.UPDATE_TREE });
  }

  MMRef.deleted = true;
  node.data({ 'MMRef': null });

  for (const childNode of MMRef.children){
    if (childNode.type === 'state'){
      childNode.deleted = true
    }
  }
  for (const connectedEdge of node.connectedEdges().toArray()) {
    const edgeMMRef = connectedEdge.data('MMRef');

    MMRef.deleted = true;
    edgeArray.removeEdge(edgeMMRef);
    if (edgeMMRef.originalEdge !== null) {
      edgeArray.removeEdge(edgeMMRef.originalEdge);
      edgeMMRef.originalEdge.deleted = true;
    }
    console.log(derivedEdgeArray)
    derivedEdgeArray.removeEdgesById(edgeMMRef.id);
    connectedEdge.data({ 'MMRef': null });
  }
};

const removeEdgeContextMenu = (edge: EdgeSingular) => {
  edgeArray.removeEdgesById(edge.id())
  derivedEdgeArray.removeEdgesById(edge.id())
  edge.data({ 'MMRef': null });
};

const cyAddNodeFromContextMenu = (cy: Core, event: any, type: NodeType, currentDiagram: DiagramTreeNode) => {

  currentMMNode = currentDiagram.mainNode
  console.log(currentMMNode)
  const counter = eleCounter.value;
  const defaultLabel = [type + " " + counter];
  let data = {
    id: counter,
    label: defaultLabel[0],
    type: type,
    parent: '',
    MMRef: null,
  };

  let pos = event.position;
  let nodePosition = {
    x: pos.x,
    y: pos.y,
  };
  console.log(currentMMNode)
  if (event.target !== cy) { //on element
    data['parent'] = event.target.id() as string;
    if (type === 'state')
      event.target.data({ hasState: 'true' });
    else
      event.target.data({ hasState: 'false' });
    cyAddNode(cy, data, nodePosition, event.target.data('MMRef'));
  }
  else
    cyAddNode(cy, data, nodePosition, currentMMNode);
};

const cyAddInzoomedNodes = (cy: Core, event: any) => {
  let inzoomedNode = event.target;
  let type = inzoomedNode.data('type') as NodeType;
  let parentId = inzoomedNode.id() as string;

  // add inzoomed node to new diagram
  cyAddNode(cy, inzoomedNode.data(), { x: 0, y: 0 }, currentMMNode);


  let MMRef = inzoomedNode.data('MMRef') as MMNode;
  // add 2 default subnodes
  let counter = eleCounter.value;
  let data = {
    id: counter,
    label: type + ' ' + counter,
    parent: parentId,
    type: type,
    MMRef: null
  };
  cyAddNode(cy, data, { x: 50, y: 50 }, MMRef);

  counter = eleCounter.value;
  data = {
    id: counter,
    label: type + ' ' + counter,
    parent: parentId,
    type: type,
    MMRef: null
  };
  cyAddNode(cy, data, { x: 150, y: 150 }, MMRef);

};

const getConnectedEdges = (MMNode: MMNode, array: EdgeArray): Array<MMEdge> => {
  let connectedEdges = array.findIngoingEdges(MMNode);
  connectedEdges = connectedEdges.concat(array.findOutgoingEdges(MMNode));
  return connectedEdges;
};

const eleAlreadyIn = (cy: Core, id: string): boolean => {
  return cy.getElementById(id).length > 0;
};

const createCyNodeData = (node: MMNode): any => {
  return {
    id: node.id,
    MMRef: node,
    label: node.label,
    type: node.type,
  };
};

const createCyEdgeData = (edge: MMEdge): any => {
  let label = edge.label;
  if (edge.originalEdge)
    label = edge.originalEdge.label;

  return {
    id: edge.id,
    source: edge.source,
    target: edge.target,
    MMRef: edge,
    label: label,
    type: edge.type
  };
};

const cyAddOriginalEdges = (cy: Core, MMNode: MMNode) => {
  let connectedEdges = getConnectedEdges(MMNode, edgeArray);
  for (const edge of connectedEdges) {
    if (eleAlreadyIn(cy, edge.id) || 
      edge.source.deleted || edge.target.deleted ||
      edge.propagation == false ||
      edge.type === EdgeType.Aggregation) {
      continue;
    }
    let connectedNode;
    if (MMNode === edge.source)
      connectedNode = edge.target;
    else
      connectedNode = edge.source;

    if (!eleAlreadyIn(cy, connectedNode.id)) {
      let parent = connectedNode.parent as MMNode;
      const nodeData = createCyNodeData(connectedNode);

      if (connectedNode.type === 'state') {
        nodeData['parent'] = parent ? parent.id : null;
        if (!eleAlreadyIn(cy, parent.id)) {
          const nodeParentData = createCyNodeData(parent);
          cyAddNode(cy, nodeParentData, { x: 0, y: 0 }, currentMMNode);
        }
      }
      cyAddNode(cy, nodeData, { x: 0, y: 0 }, parent);
    }

    const edgeData = createCyEdgeData(edge);
    cyAddEdge(cy, edgeData);
  }
};

const cyAddDerivedEdges = (cy: Core, MMNode: MMNode) => {
  let connectedEdges = getConnectedEdges(MMNode, derivedEdgeArray);
  console.table(connectedEdges);
  for (const edge of connectedEdges) {
    if (eleAlreadyIn(cy, edge.id) || 
      edge.source.deleted || edge.target.deleted) {
      continue;
    }
    let connectedNode;
    if (MMNode === edge.source)
      connectedNode = edge.target;
    else
      connectedNode = edge.source;

    if (!eleAlreadyIn(cy, connectedNode.id)) {
      let parent = connectedNode.parent as MMNode;
      const nodeData = createCyNodeData(connectedNode);

      if (connectedNode.type === 'state') {
        nodeData['parent'] = parent ? parent.id : null;
        if (!eleAlreadyIn(cy, parent.id)) {
          const nodeParentData = createCyNodeData(parent);
          cyAddNode(cy, nodeParentData, { x: 0, y: 0 }, currentMMNode);
        }
      }
      cyAddNode(cy, nodeData, { x: 0, y: 0 }, parent);
    }
    const edgeData = createCyEdgeData(edge);
    cyAddEdge(cy, edgeData);
  };
};

const cyAddConnectedNodes = (cy: Core, MMNode: MMNode) => {
  cyAddDerivedEdges(cy, MMNode);
  cyAddOriginalEdges(cy, MMNode);
};

const cyAddConnectedNodesInzoom = (cy: Core, MMNode: MMNode) => {
  cyAddOriginalEdges(cy, MMNode);
  cyAddDerivedEdges(cy, MMNode);
};
export { cyAddNodeFromContextMenu, cyAddInzoomedNodes, cyAddConnectedNodesInzoom, cyAddConnectedNodes, cyAddEdge, removeNodeContextMenu, removeEdgeContextMenu ,eleAlreadyIn};