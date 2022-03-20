import { Core, NodeSingular } from "cytoscape";
import { edgeArray, Edge, derivedEdgeArray } from '../model/edge-model';
import { edgeType } from '../model/edge-model';
import { eleCounter } from './elementCounter';
import { cy } from '../components/DiagramCanvas';

let sourceNode: NodeSingular | null = null;
let targetNode: NodeSingular | null = null;


export const cyAddEdge = (data: any) => {
  if (!('MasterModelRef' in data)) {
    // @ts-ignore
    let modelEdge = new Edge(data['id'], sourceNode.data('MasterModelRef'), targetNode.data('MasterModelRef'), data['type']);
    edgeArray.addEdge(modelEdge);
    data['MasterModelRef'] = modelEdge;
  }
  const addedEdge = cy.add({
    data: data,
  });
  return addedEdge
};

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

const addDerivedEdges = (counter: string, type: edgeType, originalEdge: Edge) => {
  const derivedEdge = new Edge(
      counter,
      sourceNode?.data('MasterModelRef'),
      targetNode?.data('MasterModelRef'),
      type,
      originalEdge
    );
  if (sourceNode?.isChild() && sourceNode?.data('type') !== 'state') {
    derivedEdge.source = sourceNode.parent()[0].data('MasterModelRef');
  }
  else if (targetNode?.isChild() && targetNode?.data('type') !== 'state') {
    derivedEdge.target = targetNode.parent()[0].data('MasterModelRef');
  }
  derivedEdgeArray.addEdge(derivedEdge);
};

export const edgeCreate = (edgeType: edgeType) => {
  if (sourceNode != null && targetNode != null) {
    let modelEdge, derivedEdge;
    const counter = eleCounter.value;

    const data = {
      id: counter,
      source: sourceNode.data('id'),
      target: targetNode.data('id'),
      type: edgeType,
      label: ''
    };
    const addedEdge = cyAddEdge(data);

    if (sourceNode?.isChild() || targetNode?.isChild())
      addDerivedEdges(counter, edgeType, addedEdge.data('MasterModelRef'));

    targetNode.removeClass('eh-hover');
  }
  sourceNode = null;
  targetNode = null;
};

export const edgeCancel = () => {
  targetNode?.removeClass('eh-hover');
  sourceNode = null;
  targetNode = null;
};

export const edgeReconnect = (sourceID: string, targetID: string, data: any) => {
  const edgeId = data['id'];
  const MMRef = data['MasterModelRef'];
  const edge = cy.getElementById(edgeId);

  sourceNode = cy.getElementById(sourceID)
  targetNode = cy.getElementById(targetID)

  MMRef.source = sourceNode?.data('MasterModelRef')
  MMRef.target = targetNode?.data('MasterModelRef')

  edge.move({
    source: sourceID,
    target: targetID
  });

  if (sourceNode?.isChild() || targetNode?.isChild())
      addDerivedEdges(edgeId, edge.data('type'), MMRef);
};


