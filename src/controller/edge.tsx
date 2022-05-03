import { Core, EdgeSingular, NodeSingular } from "cytoscape";
import { edgeArray, MMEdge, derivedEdgeArray, hierarchicalStructuralEdges } from '../model/edge-model';
import { EdgeType } from '../model/edge-model';
import { eleCounter } from './elementCounter';
import { cy } from '../components/DiagramCanvas';
import { cyAddEdge, eleAlreadyIn } from './general';
import { masterModelRoot, MMNode, MMRoot } from "../model/master-model";
import { PropagationEnum, propagation, currentDiagram, StateInterface } from "../components/App";
import { diagramTreeRoot } from "../model/diagram-tree-model";

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


const addDerivedEdge = (source: MMNode, target: MMNode, originalEdge: MMEdge): MMEdge => {
  const derivedEdge = new MMEdge(
    originalEdge.id,
    source,
    target,
    originalEdge.type,
    false,
    originalEdge,
    originalEdge.label
  );

  originalEdge.addDerivedEdge(derivedEdge);
  derivedEdgeArray.addEdge(derivedEdge);
  return derivedEdge;
};

const deriveAll = (propagate: boolean, sourceRef: MMNode, targetRef: MMNode, addedEdgeRef: MMEdge, sourceMain: boolean, iterator: MMNode) => {
  if (sourceNode === null || targetNode === null)
    return;

  if (sourceMain) {
    while (iterator !== masterModelRoot) {
      const derivedEdge = addDerivedEdge(iterator as MMNode, targetRef, addedEdgeRef);
      derivedEdge.propagation = propagate;
      //@ts-ignore
      iterator = iterator.parent;
    }
  }
  else {
    while (iterator !== masterModelRoot) {
      const derivedEdge = addDerivedEdge(sourceRef, iterator as MMNode, addedEdgeRef);
      derivedEdge.propagation = propagate;
      //@ts-ignore
      iterator = iterator.parent;
    }
  }
};

const edgeDerivation = (sourceRef: MMNode, targetRef: MMNode, addedEdgeRef: MMEdge) => {
  if (sourceNode === null || targetNode === null || currentDiagram === diagramTreeRoot)
    return;

  const mainNode = currentDiagram.mainNode as MMNode;

  let sourceMain, iterator;
  if (sourceRef === mainNode || (sourceNode.isChild() && sourceNode.parent()[0].data('MMRef') === mainNode)) {
    sourceMain = true;
    iterator = sourceRef.parent as MMNode;
  }
  else {
    sourceMain = false;
    iterator = targetRef.parent as MMNode;
  }

  if (iterator === masterModelRoot || iterator === null)
    return;

  if (propagation === PropagationEnum.None) {
    deriveAll(false, sourceRef, targetRef, addedEdgeRef, sourceMain, iterator);
  }
  else if (propagation === PropagationEnum.Complete) {
    deriveAll(true, sourceRef, targetRef, addedEdgeRef, sourceMain, iterator);
  }
  else if (propagation === PropagationEnum.OneLevel) {
    if (sourceMain) {
      const derivedEdge = addDerivedEdge(iterator, targetRef, addedEdgeRef);
      derivedEdge.propagation = true;
      iterator = iterator.parent as MMNode;
    }
    else {
      const derivedEdge = addDerivedEdge(sourceRef, iterator, addedEdgeRef);
      derivedEdge.propagation = true;
      iterator = iterator.parent as MMNode;
    }
    deriveAll(false, sourceRef, targetRef, addedEdgeRef, sourceMain, iterator);
  }
};

const addDerivedEdges = (originalEdge: MMEdge) => {
  const derivedEdge = new MMEdge(
    originalEdge.id,
    sourceNode?.data('MMRef'),
    targetNode?.data('MMRef'),
    originalEdge.type,
    false,
    originalEdge,
    originalEdge.label
  );

  if (sourceNode?.isChild() && sourceNode?.data('type') !== 'state') {
    derivedEdge.source = sourceNode.parent()[0].data('MMRef');
  }
  else if (targetNode?.isChild() && targetNode?.data('type') !== 'state') {
    derivedEdge.target = targetNode.parent()[0].data('MMRef');
  }

  originalEdge.addDerivedEdge(derivedEdge);
  derivedEdgeArray.addEdge(derivedEdge);
};

const addDerivedEdgesAggregation = (originalEdge: MMEdge) => {
  const shouldPropagate = propagation == PropagationEnum.None ? false : true;
  let derivedEdge;
  if (shouldPropagate === true) {
    if (originalEdge.source.isPart) {
      const parent = edgeArray.findStructuralParents(originalEdge.source) as MMNode;
      console.log(parent);
      derivedEdge = addDerivedEdge(parent, originalEdge.target, originalEdge);

    }
    else if (originalEdge.target.isPart) {
      const parent = edgeArray.findStructuralParents(originalEdge.source) as MMNode;
      console.log(parent);
      derivedEdge = addDerivedEdge(parent, originalEdge.target, originalEdge);
    }
    //@ts-ignore
    derivedEdge.preferOriginal = true;
  }
};

export const edgeCreate = (type: EdgeType, state: StateInterface) => {
  if (sourceNode === null || targetNode === null)
    return;

  const propagation = state.propagation;

  const sourceRef = sourceNode.data('MMRef') as MMNode;
  const targetRef = targetNode.data('MMRef') as MMNode;

  const counter = eleCounter.value;
  const data = {
    id: counter,
    label: '',
    type: type,
    MMRef: null,
    source: sourceRef,
    target: targetRef,
  };

  const shouldPropagate = propagation == PropagationEnum.None ? false : true;
  const addedEdge = cyAddEdge(cy, data, shouldPropagate);
  const addedEdgeRef = addedEdge.data('MMRef');

  if (hierarchicalStructuralEdges.includes(type)) {
    targetRef.isPart = true;
  }
  else {
    edgeDerivation(sourceRef, targetRef, addedEdgeRef);
    if (sourceRef.isPart === true || targetRef.isPart == true) {
      addDerivedEdgesAggregation(addedEdge.data('MMRef'));
    }
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
  const sourceRef = sourceNode?.data('MMRef') as MMNode;
  const targetRef = targetNode?.data('MMRef') as MMNode;

  MMRef.source = sourceRef;
  MMRef.target = targetRef;

  if (MMRef.originalEdge !== undefined) {
    console.log('was derived');
    edgeArray.removeEdge(MMRef.originalEdge);
    MMRef.originalEdge.removeAllDerived();
    MMRef.deleted = false;
    MMRef.originalEdge = undefined;
    edgeArray.addEdge(MMRef);
  }
  else {
    MMRef.removeAllDerived();
  }

  /* if (!reconnectInCompound(edge)) {
    derivedEdgeArray.removeEdgesById(edgeId);
  } */

  if (sourceRef.isPart === true || targetRef.isPart == true) {
    addDerivedEdgesAggregation(MMRef);
  }

  const shouldPropagate = propagation === PropagationEnum.None ? false : true;
  MMRef.propagation = shouldPropagate;

  edgeDerivation(sourceRef, targetRef, MMRef);

  /* if (shouldPropagate) {
    if ((sourceNode?.isChild() && sourceNode?.data('type') !== 'state' ||
      targetNode?.isChild() && targetNode?.data('type') !== 'state') &&
      sourceNode?.parent() !== targetNode?.parent()) {
      addDerivedEdges(MMRef);
    }
  } */

  edge.move({
    source: sourceID,
    target: targetID
  });

};


