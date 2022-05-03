import { Core, EdgeCollection, EdgeSingular, NodeSingular } from "cytoscape";
import { masterModelRoot, MMNode, MMRoot, NodeType } from "../model/master-model";
import { edgeArray, derivedEdgeArray, MMEdge, EdgeArray, EdgeType, hierarchicalStructuralEdges } from '../model/edge-model';
import { eleCounter } from './elementCounter';
import { ACTIONS } from "../components/App";
import { DiagramTreeNode } from "../model/diagram-tree-model";

let options = {
  name: 'random',
  fit: false,
  padding: 30,
  boundingBox: {},
  avoidOverlap: true,
};

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
interface CyViewport {
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  w: number,
  h: number,
}

const cropViewport = (viewport: CyViewport): CyViewport => {
  const widthDiff = viewport.w / 6;
  const heightDiff = viewport.h / 6;
  viewport.x1 = viewport.x1 + widthDiff;
  viewport.x2 = viewport.x2 - widthDiff;
  viewport.y1 = viewport.y1 + heightDiff;
  viewport.y2 = viewport.y2 - heightDiff;
  viewport.w = viewport.w - widthDiff * 2;
  viewport.h = viewport.h - heightDiff * 2;
  return viewport;
};

const cyAddNode = (cy: Core, data: NodeData, position = { x: 0, y: 0 }, parentMMNode: MMNode | MMRoot) => {
  data['label'] = data['label'].charAt(0).toUpperCase() + data['label'].substring(1).toLowerCase();
  if (data['MMRef'] === null) {
    let modelNode = new MMNode(data['id'], data['type'], data['label']);
    parentMMNode.addChild(modelNode);
    data['MMRef'] = modelNode;
  }

  cy.elements().lock();

  cy.add({
    data: data,
    position: position
  });

  if (position.x === 0 && position.y === 0) {
    const boundingBox = cropViewport(cy.extent());
    options.boundingBox = boundingBox;
    const layout = cy.layout(options);
    layout.run();
  }

  cy.elements().unlock();

};



const cyAddEdge = (cy: Core, data: EdgeData, shouldPropagate: boolean = false): EdgeSingular => {
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

  for (const childNode of MMRef.children) {
    if (childNode.type === 'state') {
      childNode.deleted = true;
    }
  }

  for (const connectedEdge of node.connectedEdges().toArray()) {
    const edgeMMRef = connectedEdge.data('MMRef');

    MMRef.deleted = true;
    edgeArray.removeEdge(edgeMMRef);
    if (edgeMMRef.originalEdge !== undefined) {
      edgeArray.removeEdge(edgeMMRef.originalEdge);
      edgeMMRef.originalEdge.removeAllDerived();
    }
    else {
      edgeArray.removeEdge(edgeMMRef);
      edgeMMRef.removeAllDerived();
    }
    connectedEdge.data({ 'MMRef': null });
  }
};

const removeEdgeContextMenu = (edge: EdgeSingular) => {
  const MMRef = edge.data('MMRef') as MMEdge;
  if (MMRef.originalEdge !== undefined) {
    edgeArray.removeEdge(MMRef.originalEdge);
    MMRef.originalEdge.removeAllDerived();
  }
  else {
    edgeArray.removeEdge(MMRef);
    MMRef.removeAllDerived();
  }

  edge.data({ 'MMRef': null });
};

const cyAddNodeFromContextMenu = (cy: Core, event: any, type: NodeType, currentDiagram: DiagramTreeNode) => {
  currentMMNode = currentDiagram.mainNode;
  console.log(currentMMNode);
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
  console.log(currentMMNode);
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

  const viewport = cy.extent();
  const centerX = (viewport.x1 + viewport.x2) / 2;
  const centerY = (viewport.y1 + viewport.y2) / 2;

  // add inzoomed node to new diagram
  cyAddNode(cy, inzoomedNode.data(), { x: centerX, y: centerY }, currentMMNode);

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
  cyAddNode(cy, data, { x: centerX - 20, y: centerY - 40 }, MMRef);

  counter = eleCounter.value;
  data = {
    id: counter,
    label: type + ' ' + counter,
    parent: parentId,
    type: type,
    MMRef: null
  };
  cyAddNode(cy, data, { x: centerX + 20, y: centerY + 40 }, MMRef);

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

const skipForOriginal = (cy: Core, edge: MMEdge): boolean => {
  const sourceNodeId = edge.originalEdge?.source.id as string;
  const targetNodeId = edge.originalEdge?.target.id as string;
  if (edge.preferOriginal && eleAlreadyIn(cy, sourceNodeId) && eleAlreadyIn(cy, targetNodeId))
    return true;
  else
    return false;
};

const cyAddEdges = (cy: Core, MMNode: MMNode, edges: Array<MMEdge>) => {
  for (const edge of edges) {
    if (eleAlreadyIn(cy, edge.id) ||
      edge.source.deleted || edge.target.deleted ||
      edge.propagation == false) {
      continue;
    }

    if (edge.originalEdge !== undefined && skipForOriginal(cy, edge))
      continue;

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

const cyAddEdgesTest = (cy: Core, MMNode: MMNode, edges: Array<MMEdge>) => {
  for (const edge of edges) {
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
  }
};

const cyAddConnectedNodes = (cy: Core, MMNode: MMNode) => {
  let connectedOriginalEdges = getConnectedEdges(MMNode, edgeArray);
  let connectedStructuralEdges = connectedOriginalEdges.filter((edge) => hierarchicalStructuralEdges.includes(edge.type));
  let connectedDerivedEdges = getConnectedEdges(MMNode, derivedEdgeArray);
  // let connectedPreferedEdges = connectedDerivedEdges.map((edge) => edge.preferOriginal ? edge.originalEdge : null) as Array<MMEdge>;
  // connectedPreferedEdges = connectedDerivedEdges.filter((edge) => edge !== null);
  console.log(connectedStructuralEdges);
  console.log(connectedDerivedEdges);
  console.log(connectedOriginalEdges);
  cyAddEdges(cy, MMNode, connectedStructuralEdges);
  // cyAddEdges(cy, MMNode, connectedPreferedEdges);
  cyAddEdges(cy, MMNode, connectedDerivedEdges);
  cyAddEdges(cy, MMNode, connectedOriginalEdges);
};

const cyAddConnectedNodesInzoom = (cy: Core, MMNode: MMNode) => {
  let connectedOriginalEdges = getConnectedEdges(MMNode, edgeArray);
  cyAddEdges(cy, MMNode, connectedOriginalEdges);
  let connectedDerivedEdges = getConnectedEdges(MMNode, derivedEdgeArray);
  cyAddEdges(cy, MMNode, connectedDerivedEdges);
};

const cyAddAllConnected = (cy: Core, node: MMNode) => {
  let connectedOriginalEdges = getConnectedEdges(node, edgeArray);
  cyAddEdgesTest(cy, node, connectedOriginalEdges);
  let connectedDerivedEdges = getConnectedEdges(node, derivedEdgeArray);
  cyAddEdgesTest(cy, node, connectedDerivedEdges);
};
export {
  cyAddNodeFromContextMenu,
  cyAddInzoomedNodes,
  cyAddConnectedNodesInzoom,
  cyAddConnectedNodes,
  cyAddEdge,
  removeNodeContextMenu,
  removeEdgeContextMenu,
  eleAlreadyIn,
  cyAddAllConnected
};