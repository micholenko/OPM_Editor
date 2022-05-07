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
  if (cy.getElementById(data.id).length > 0) {
    return;
  }
  data['label'] = data['label'].charAt(0).toUpperCase() + data['label'].substring(1).toLowerCase();
  if (data['MMRef'] === null) {
    let modelNode = new MMNode(data['id'], data['type'], data['label']);
    parentMMNode.addChild(modelNode);
    data['MMRef'] = modelNode;
    if (data['parent'] !== '' && data['type'] !== 'state')
      modelNode.isSubelementOfMain = true;
    else if (data['type'] === 'state')
      modelNode.isStructurePart = true;
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



const cyAddEdge = (cy: Core, data: EdgeData, shouldPropagate: boolean = false): EdgeSingular | null => {
  if (cy.getElementById(data.id).length > 0) {
    return null;
  }
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
      edgeArray.removeOriginalEdges(edgeMMRef.originalEdges);
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

const eleAlreadyInAndVisible = (cy: Core, id: string): boolean => {
  const ele = cy.getElementById(id);
  const result = ele.length > 0 && ele.data('display') !== 'none';
  return result;
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

const skipDerivedEdge = (cy: Core, edge: MMEdge): boolean => {
  if (edge.preferedEdge !== null) {
    const sourceId = edge.preferedEdge.source.id;
    const targetId = edge.preferedEdge.target.id;
    if (eleAlreadyInAndVisible(cy, sourceId) && eleAlreadyInAndVisible(cy, targetId))
      return true;
  }
  //@ts-ignore
  for (const diagramEdge of cy.edges()) {
    const originalEdges = diagramEdge.data('MMRef').originalEdges;
    if (originalEdges.length > 1) {
      for (const origEdge of originalEdges) {
        if (eleAlreadyInAndVisible(cy, origEdge.id))
          return true;
      }
    }
  }
  return false;
};

const derivedAlreadyIn = (cy: Core, edge: MMEdge): boolean => {
  for (const derived of edge.derivedEdges) {
    if (cy.getElementById(derived.id).data('MMRef') === derived) {
      return true;
    }
  }
  // @ts-ignore
  for (const diagramEdge of cy.edges()) {
    if (diagramEdge.data('MMRef').preferedEdge == edge)
      return true;
  }
  return false;
};

const cyAddEdges = (cy: Core, MMNode: MMNode, edges: Array<MMEdge>) => {
  for (const edge of edges) {
    if (eleAlreadyInAndVisible(cy, edge.id) ||
      edge.source.deleted || edge.target.deleted ||
      edge.propagation == false) {
      continue;
    }

    if (edge.originalEdges.length > 0 && skipDerivedEdge(cy, edge))
      continue;

    if (derivedAlreadyIn(cy, edge))
      continue;

    let connectedNode;
    if (MMNode === edge.source)
      connectedNode = edge.target;
    else
      connectedNode = edge.source;

    if (!eleAlreadyInAndVisible(cy, connectedNode.id)) {
      let parent = connectedNode.parent as MMNode;
      const nodeData = createCyNodeData(connectedNode);

      if (connectedNode.type === 'state') {
        nodeData['parent'] = parent ? parent.id : null;
        if (!eleAlreadyInAndVisible(cy, parent.id)) {
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

const bringConnectedEdge = (cy: Core, edge: MMEdge, targetNode: MMNode) => {
  let connectedNode;
  if (targetNode === edge.source)
    connectedNode = edge.target;
  else
    connectedNode = edge.source;

  const diagramEdge = cy.getElementById(edge.id);
  if (diagramEdge.length > 0 && diagramEdge.data('display') == 'none') {
    diagramEdge.remove();
  }
  const cyConnectedNode = cy.getElementById(connectedNode.id)
  cyConnectedNode.data({ display: 'element' });
  if (connectedNode.type === 'state'){
    //@ts-ignore
    const parent = connectedNode.parent as MMNode
    cyConnectedNode.move({parent: parent.id})
    const cyParentNode = cy.getElementById(parent.id)
    cyParentNode.data({ display: 'element' });
  }

  cy.getElementById(edge.id).data({ display: 'element' });

  /* if (eleAlreadyInAndVisible(cy, edge.id) ||
    edge.source.deleted || edge.target.deleted) {
    return;
  } */

  if (!eleAlreadyInAndVisible(cy, connectedNode.id)) {
    let parent = connectedNode.parent as MMNode;
    const nodeData = createCyNodeData(connectedNode);

    if (connectedNode.type === 'state') {
      nodeData['parent'] = parent ? parent.id : null;
      if (!eleAlreadyInAndVisible(cy, parent.id)) {
        const nodeParentData = createCyNodeData(parent);
        cyAddNode(cy, nodeParentData, { x: 0, y: 0 }, currentMMNode);
      }
    }
    cyAddNode(cy, nodeData, { x: 0, y: 0 }, parent);
  }

  const edgeData = createCyEdgeData(edge);
  cyAddEdge(cy, edgeData);
};

const cyAddConnectedNodes = (cy: Core, MMNode: MMNode) => {
  let connectedOriginalEdges = getConnectedEdges(MMNode, edgeArray);
  let connectedStructuralEdges = connectedOriginalEdges.filter((edge) => hierarchicalStructuralEdges.includes(edge.type));
  let connectedDerivedEdges = getConnectedEdges(MMNode, derivedEdgeArray);
  // let connectedPreferedEdges = connectedDerivedEdges.map((edge) => edge.preferOriginal ? edge.originalEdge : null) as Array<MMEdge>;
  // connectedPreferedEdges = connectedDerivedEdges.filter((edge) => edge !== null);
  console.log("-----");
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

const getAllConnectedEdges = (cy: Core, node: MMNode): Array<MMEdge> => {
  const connectedOriginalEdges = getConnectedEdges(node, edgeArray);
  const connectedDerivedEdges = getConnectedEdges(node, derivedEdgeArray);
  const allConnected = connectedOriginalEdges.concat(connectedDerivedEdges);
  const filteredConnected = allConnected.filter((edge) => {
    let connectedNode;
    if (node === edge.source)
      connectedNode = edge.target;
    else
      connectedNode = edge.source;

    let result = false;
    if (!eleAlreadyInAndVisible(cy, edge.id) ||
      !eleAlreadyInAndVisible(cy, connectedNode.id))
      result = true;
    if (connectedNode.isSubelementOfMain && !eleAlreadyInAndVisible(cy, connectedNode.id))
      result = false;
    return result;
  });

  return filteredConnected;
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
      let cyNode = cy.getElementById(child.id);
      if (cyNode.length > 0) {
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
  eleAlreadyInAndVisible as eleAlreadyIn,
  getAllConnectedEdges,
  cyBringAllStates,
  createCyEdgeData,
  bringConnectedEdge
};
