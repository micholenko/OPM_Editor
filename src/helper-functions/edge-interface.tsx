import { Core, EdgeSingular, NodeSingular } from "cytoscape";
import { edgeArray, MMEdge, derivedEdgeArray } from '../model/edge-model';
import { EdgeType } from '../model/edge-model';
import { eleCounter } from './elementCounter';
import { cy } from '../components/DiagramCanvas';
import { cyAddEdge } from './cytoscape-interface';

let sourceNode: NodeSingular | null = null;
let targetNode: NodeSingular | null = null;

export const edgeStartDrawing = (eh: any, evt: Event) => {
  sourceNode = evt.target as unknown as NodeSingular;
  sourceNode?.addClass('eh-source');
  eh.start(sourceNode);
};

export const edgeStopDrawing = (eh: any) => {
  eh.stop();
};

export const edgeDragOver = (evt: any) => {
  if (sourceNode != null) {
    targetNode = evt.target;
    targetNode?.addClass('eh-hover');
  }
};

export const edgeDragOut = (evt: any) => {
  evt.target.removeClass('eh-hover');
  targetNode = null;
};

export const edgeCheckValidTargets = (callback: Function) => {
  if (sourceNode != null && targetNode != null) {
    callback();
  }
};

const addDerivedEdges = (originalEdge: MMEdge) => {
  const derivedEdge = new MMEdge(
    originalEdge.id,
    sourceNode?.data('MMRef'),
    targetNode?.data('MMRef'),
    originalEdge.type,
    originalEdge,
    originalEdge.label
  );

  if (sourceNode?.isChild() && sourceNode?.data('type') !== 'state') {
    derivedEdge.source = sourceNode.parent()[0].data('MMRef');
  }
  else if (targetNode?.isChild() && targetNode?.data('type') !== 'state') {
    derivedEdge.target = targetNode.parent()[0].data('MMRef');
  }

  derivedEdgeArray.addEdge(derivedEdge);
};

export const edgeCreate = (type: EdgeType) => {
  if (sourceNode === null || targetNode === null)
    return;

  const counter = eleCounter.value;
  const data = {
    id: counter,
    label: '',
    type: type,
    MMRef: null,
    source: sourceNode.data('MMRef'),
    target: targetNode.data('MMRef'),
  };
  const addedEdge = cyAddEdge(cy, data);

  if ((sourceNode?.isChild() && sourceNode?.data('type') !== 'state' ||
    targetNode?.isChild() && targetNode?.data('type') !== 'state') &&
    sourceNode?.parent() !== targetNode?.parent()) {
    addDerivedEdges(addedEdge.data('MMRef'));
  }
  targetNode.removeClass('eh-hover');
  sourceNode = null;
  targetNode = null;
};

export const edgeCancel = () => {
  targetNode?.removeClass('eh-hover');
  sourceNode = null;
  targetNode = null;
};

const reconnectInCompound = (edge: EdgeSingular): boolean => {
  const oldSource = edge.source();
  const oldTarget = edge.target();
  const newSource = sourceNode;
  const newTarget = targetNode;

  // from parent to child
  if (newSource?.parent() === oldSource ||
    newTarget?.parent() === oldTarget) {
    return true;
  }

  // from child to a child of the same parent
  if (newSource?.parent() === oldSource.parent() ||
    newTarget?.parent() === oldTarget.parent()) {
    return true;
  }

  // from child to parent
  if (newSource === oldSource.parent() ||
    newTarget === oldTarget.parent()) {
    return true;
  }
  return false;
};

export const edgeReconnect = (sourceID: string, targetID: string, data: any) => {
  const edgeId = data['id'];
  const MMRef = data['MMRef'] as MMEdge;
  const edge = cy.getElementById(edgeId);

  sourceNode = cy.getElementById(sourceID);
  targetNode = cy.getElementById(targetID);

  MMRef.source = sourceNode?.data('MMRef');
  MMRef.target = targetNode?.data('MMRef');

  if (MMRef.originalEdge !== null) {
    console.log('was derived')
    edgeArray.removeEdge(MMRef.originalEdge);
    MMRef.originalEdge = null;
    edgeArray.addEdge(MMRef);
  }

  if (!reconnectInCompound(edge)) {
    derivedEdgeArray.removeEdgesById(edgeId);
  }

  if ((sourceNode?.isChild() && sourceNode?.data('type') !== 'state' ||
    targetNode?.isChild() && targetNode?.data('type') !== 'state') &&
    sourceNode?.parent() !== targetNode?.parent()) {
    addDerivedEdges(MMRef);
  }

  edge.move({
    source: sourceID,
    target: targetID
  });

};


