import { Core, NodeSingular } from "cytoscape";
import { masterModelRoot, MasterModelNode, MasterModelRoot } from "../model/master-model";
import { edgeArray, derivedEdgeArray, Edge, EdgeArray } from '../model/edge-model';
import { cyAddEdge } from './edge-interface';
import { eleCounter } from './elementCounter';


let currentMasterModelNode = masterModelRoot;

const cyAddNode = (cy: Core, data: any, position = { x: 0, y: 0 }, parentMMNode: MasterModelNode | MasterModelRoot, createModelNode = true) => {
  if (createModelNode) {
    let modelNode = new MasterModelNode(data['id'], data['type'], data['label']);
    parentMMNode.addChild(modelNode);
    data['MasterModelRef'] = modelNode;
  }
  cy.add({
    data: data,
    position: position
  });
};

const cyAddNodeFromContextMenu = (cy: Core, event: any, type: 'object' | 'process' | 'state') => {

  const counter = eleCounter.value;
  const defaultLabel = [type + " " + counter];
  let data = {
    id: counter,
    label: defaultLabel[0],
    type: type,
    parent: null,
  };

  let pos = event.position;
  let nodePosition = {
    x: pos.x,
    y: pos.y,
  };

  if (event.target !== cy) { //on element
    data['parent'] = event.target.id();
    if (type === 'state')
      event.target.data({ hasState: 'true' });
    else
      event.target.data({ hasState: 'false' });
    cyAddNode(cy, data, nodePosition, event.target.data('MasterModelRef'));
  }
  else
    cyAddNode(cy, data, nodePosition, currentMasterModelNode);
};

const cyAddInzoomedNodes = (cy: Core, event: any) => {
  let inzoomedNode = event.target;
  let type = inzoomedNode.data('type');
  let parentId = inzoomedNode.id();

  // add inzoomed node to new diagram
  cyAddNode(cy, inzoomedNode.data(), { x: 0, y: 0 }, currentMasterModelNode, false);

  currentMasterModelNode = inzoomedNode.data('MasterModelRef');
  // add 2 default subnodes
  let counter = eleCounter.value;
  let data = {
    id: counter,
    label: type + ' ' + counter,
    parent: inzoomedNode.id(),
    type: type,
  };
  cyAddNode(cy, data, { x: 50, y: 50 }, currentMasterModelNode);

  counter = eleCounter.value;
  data = {
    id: counter,
    label: type + ' ' + counter,
    parent: parentId,
    type: type,
  };
  cyAddNode(cy, data, { x: 150, y: 150 }, currentMasterModelNode);

};

const getConnectedEdges = (MMNode: MasterModelNode, array: EdgeArray): Array<Edge> => {
  let connectedEdges = array.findIngoingEdges(MMNode);
  connectedEdges = connectedEdges.concat(array.findOutgoingEdges(MMNode));
  return connectedEdges;
};

const eleAlreadyIn = (cy: Core, id: string): boolean => {
  return cy.getElementById(id).length > 0;
};

const createCyNodeData = (node: MasterModelNode): any => {
  return {
    id: node.id,
    MasterModelRef: node,
    label: node.label,
    type: node.type,
  };
};

const createCyEdgeData = (edge: Edge): any => {
  return {
    id: edge.id,
    source: edge.source.id,
    target: edge.target.id,
    MasterModelRef: edge,
    label: edge.label,
    type: edge.type
  };
};

const cyAddOriginalEdges = (cy: Core, MMNode: MasterModelNode) => {
  let connectedEdges = getConnectedEdges(MMNode, edgeArray);
  for (const edge of connectedEdges) {
    if (eleAlreadyIn(cy, edge.id)) {
      continue;
    }
    let connectedNode;
    if (MMNode === edge.source)
      connectedNode = edge.target;
    else
      connectedNode = edge.source;

    if (!eleAlreadyIn(cy, connectedNode.id)) {
      let parent = connectedNode.parent as MasterModelNode;
      const nodeData = createCyNodeData(connectedNode);

      if (connectedNode.type === 'state' && !eleAlreadyIn(cy, parent.id)) {
        const nodeParentData = createCyNodeData(parent);
        cyAddNode(cy, nodeParentData, { x: 0, y: 0 }, currentMasterModelNode, false);
        nodeData['parent'] = parent ? parent.id : null;
      }
      cyAddNode(cy, nodeData, { x: 0, y: 0 }, parent, false);
    }

    const edgeData = createCyEdgeData(edge);
    cyAddEdge(edgeData);
  }
};

const cyAddDerivedEdges = (cy: Core, MMNode: MasterModelNode) => {
  let connectedEdges = getConnectedEdges(MMNode, derivedEdgeArray);

  for (const edge of connectedEdges) {
    if (eleAlreadyIn(cy, edge.id)) {
      continue;
    }
    let connectedNode;
    if (MMNode === edge.source)
      connectedNode = edge.target;
    else
      connectedNode = edge.source;

    if (!eleAlreadyIn(cy, connectedNode.id)) {
      const nodeData = createCyNodeData(connectedNode);
      cyAddNode(cy, nodeData, { x: 0, y: 0 }, currentMasterModelNode, false);
    }
    const edgeData = createCyEdgeData(edge);
    cyAddEdge(edgeData);
  };
};

const cyAddConnectedNodes = (cy: Core, MMNode: MasterModelNode) => {
  cyAddOriginalEdges(cy, MMNode);
  cyAddDerivedEdges(cy, MMNode);
};
export { cyAddNodeFromContextMenu, cyAddInzoomedNodes, cyAddConnectedNodes, cyAddEdge };