/* 
 * Author: Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * Copyright: Copyright 2022, OPM Editor
 * Made for Bachelor's Thesis - Agile Model Editor
 * License: MIT
*/

import { Core, EdgeSingular, NodeSingular } from "cytoscape";
import { ACTIONS } from "../components/App";
import { DiagramTreeNode } from "../model/diagram-tree-model";
import { derivedEdgeArray, edgeArray, EdgeArray, EdgeType, hierarchicalStructuralEdges, MMEdge } from '../model/edge-model';
import { masterModelRoot, MMNode, MMRoot, NodeType } from "../model/master-model";
import { eleCounter } from './elementCounter';


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

  const parentBB = cy.getElementById(data.parent).boundingBox({ includeNodes: true });
  cy.elements().lock();

  cy.add({
    data: data,
    position: position
  });

  if (position.x === 0 && position.y === 0) {
    let boundingBox;
    if (data.type === 'state') {
      boundingBox = parentBB;
    }
    else {
      boundingBox = cropViewport(cy.extent());
    }
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
    if (edgeMMRef.originalEdges.length) {
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
  if (MMRef.originalEdges.length) {
    edgeArray.removeOriginalEdges(MMRef.originalEdges);
    for (const edge of MMRef.originalEdges) {
      edge.removeAllDerived();
    }
  }
  else {
    edgeArray.removeEdge(MMRef);
    MMRef.removeAllDerived();
  }

  edge.data({ 'MMRef': null });
};

const cyAddNodeFromContextMenu = (cy: Core, event: any, type: NodeType, currentDiagram: DiagramTreeNode) => {
  currentMMNode = currentDiagram.mainNode;
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
  if (event.target !== cy) { //on element
    data['parent'] = event.target.id() as string;
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
  if (edge.originalEdges.length)
    label = edge.originalEdges[0].label;

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
  let sourceNodeId, targetNodeId;
  if (edge.originalEdges.length) {
    sourceNodeId = edge.originalEdges[0].source.id as string;
    targetNodeId = edge.originalEdges[0].target.id as string;
    if (edge.preferOriginal && eleAlreadyIn(cy, sourceNodeId) && eleAlreadyIn(cy, targetNodeId))
      return true;
  }
  return false
};

const cyAddEdges = (cy: Core, MMNode: MMNode, edges: Array<MMEdge>) => {
  for (const edge of edges) {
    if (eleAlreadyIn(cy, edge.id) ||
      edge.source.deleted || edge.target.deleted ||
      edge.propagation == false) {
      continue;
    }

    /* if (edge.originalEdges.length && skipForOriginal(cy, edge))
      continue; */

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
    let connectedNode;
    if (MMNode === edge.source)
      connectedNode = edge.target;
    else
      connectedNode = edge.source;

    cy.getElementById(connectedNode.id).data({ display: 'element' });
    cy.getElementById(edge.id).data({ display: 'element' });

    if (eleAlreadyIn(cy, edge.id) ||
      edge.source.deleted || edge.target.deleted) {
      continue;
    }

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

const cyBringAllConnected = (cy: Core, node: MMNode) => {
  let connectedDerivedEdges = getConnectedEdges(node, derivedEdgeArray);
  console.log(connectedDerivedEdges)
  cyAddEdgesTest(cy, node, connectedDerivedEdges);
  let connectedOriginalEdges = getConnectedEdges(node, edgeArray);
  console.log(connectedOriginalEdges)
  cyAddEdgesTest(cy, node, connectedOriginalEdges);
};

const cyBringAllStates = (cy: Core, node: NodeSingular) => {
  const MMRef = node.data('MMRef');
  for (const child of MMRef.children) {
    if (child.type === 'state') {
      const data = {
        id: child.id,
        label: child.label,
        type: NodeType.State,
        MMRef: child,
        parent: MMRef.id
      };
      if (eleAlreadyIn(cy, child.id)) {
        const cyNode = cy.getElementById(child.id);
        cyNode.move({ parent: MMRef.id });
        cyNode.data({ display: 'element' });
      }
      else {
        cyAddNode(cy, data, { x: 0, y: 0 }, MMRef);
      }
    }
  }
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
  cyBringAllConnected,
  cyBringAllStates
};
