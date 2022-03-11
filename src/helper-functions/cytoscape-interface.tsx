import { Core, NodeSingular } from "cytoscape";
import { masterModelRoot, MasterModelNode } from "../model/master-model";
import { edgeArray, derivedEdgeArray } from '../model/edge-model';

let nodeCounter = 0;
let currentMasterModelNode = masterModelRoot;

const cyAddNode = (cy: Core, data: any, position = { x: 0, y: 0 }, createModelNode = true) => {
  if (createModelNode) {
    let modelNode = new MasterModelNode(nodeCounter, data['type'], data['label']);
    currentMasterModelNode.addChild(modelNode);
    data['MasterModelRef'] = modelNode;
    nodeCounter++;
  }
  cy.add({
    data: data,
    position: position
  });
};

const cyAddEdge = (cy: Core, data: any,  createModelEdge = true) => {
  if (createModelEdge) {
    let modelNode = new MasterModelNode(nodeCounter, data['type'], data['label']);
    currentMasterModelNode.addChild(modelNode);
    data['MasterModelRef'] = modelNode;
  }
  cy.add({
    data: data,
  });
};

const cyAddNodeFromContextMenu = (cy: Core, event: any, type: 'object' | 'process') => {
  const defaultLabel = type + " " + nodeCounter.toString();
  let data = {
    id: nodeCounter,
    label: defaultLabel,
    type: type,
  };

  let pos = event.position;
  let nodePosition = {
    x: pos.x,
    y: pos.y,
  };

  cyAddNode(cy, data, nodePosition);
};

const cyAddInzoomedNodes = (cy: Core, event: any) => {
  let inzoomedNode = event.target;
  let type = inzoomedNode.data('type');
  let parentId = inzoomedNode.id();

  // add inzoomed node to new diagram
  cyAddNode(cy, inzoomedNode.data(), { x: 0, y: 0 }, false);
  
  currentMasterModelNode = inzoomedNode.data('MasterModelRef');
  // add 2 default subnodes
  let data = {
    id: nodeCounter,
    label: type + ' ' + nodeCounter,
    parent: inzoomedNode.id(),
    type: type,
  };
  cyAddNode(cy, data, { x: 50, y: 50 });

  data = {
    id: nodeCounter,
    label: type + ' ' + nodeCounter,
    parent: parentId,
    type: type,
  };
  cyAddNode(cy, data, { x: 150, y: 150 });
  
};

const cyAddConnectedNodes = (cy: Core, MMNode: MasterModelNode) => {
  let connectedEdges = edgeArray.findIngoingEdges(MMNode);
  connectedEdges = connectedEdges.concat(edgeArray.findOutgoingEdges(MMNode));
  connectedEdges.map((edge) => {
    let connectedNode;
    if (MMNode === edge.source)
      connectedNode = edge.target;
    else
      connectedNode = edge.source;

    const nodeData = {
      id: connectedNode.id,
      MasterModelRef: connectedNode,
      label: connectedNode.label,
      type: connectedNode.type
    };
    cyAddNode(cy, nodeData, { x: 0, y: 0 }, false);

    const edgeData = {
      source: edge.source.id,
      target: edge.target.id,
      MasterModelRef: edge,
      label: edge.label,
      type: edge.type
    };
    cyAddEdge(cy, edgeData, false)
  });



  connectedEdges = derivedEdgeArray.findIngoingEdges(MMNode);
  connectedEdges = connectedEdges.concat(derivedEdgeArray.findOutgoingEdges(MMNode));
  
  connectedEdges.map((edge) => {
    
    let connectedNode;
    if (MMNode === edge.source)
      connectedNode = edge.target;
    else
      connectedNode = edge.source;
    

    const nodeData = {
      id: connectedNode.id,
      MasterModelRef: connectedNode,
      label: connectedNode.label,
      type: connectedNode.type
    };
    cyAddNode(cy, nodeData, { x: 0, y: 0 }, false);

    const edgeData = {
      source: edge.source.id,
      target: edge.target.id,
      MasterModelRef: edge,
      label: edge.label,
      type: edge.type
    };
    cyAddEdge(cy, edgeData, false)
  });
};
export { cyAddNodeFromContextMenu, cyAddInzoomedNodes, cyAddConnectedNodes };