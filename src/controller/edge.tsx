/* 
 * Author: Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * Copyright: Copyright 2022, OPM Editor
 * Made for Bachelor's Thesis - Agile Model Editor
 * License: MIT
*/

import { EdgeSingular, NodeSingular } from "cytoscape";
import { currentDiagram, propagation, PropagationEnum, StateInterface } from "../components/App";
import { cy } from '../components/DiagramCanvas';
import { diagramTreeRoot } from "../model/diagram-tree-model";
import { derivedEdgeArray, edgeArray, EdgeType, hierarchicalStructuralEdges, MMEdge } from '../model/edge-model';
import { masterModelRoot, MMNode } from "../model/master-model";
import { eleCounter } from './elementCounter';
import { cyAddEdge } from './general';


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

const isSubElement = (node: MMNode) => {
  return cy.getElementById(node.id).isChild();
};

const addDerivedEdgesAggregation = (originalEdge: MMEdge) => {
  const shouldPropagate = propagation == PropagationEnum.None ? false : true;
  let derivedEdge;
  if (originalEdge.source.isPart) {
    let target;
      if (isSubElement(originalEdge.target))
        target = originalEdge.target.parent as MMNode;
      else
        target = originalEdge.target;
    
    const parent = edgeArray.findStructuralParents(originalEdge.source) as MMNode;
    const result = derivedEdgeArray.findEdgeByEndpoints(parent, target);
    console.log(result)
    if (result !== null) {
      result.originalEdges.push(originalEdge);
      derivedEdge = result;
      originalEdge.addDerivedEdge(derivedEdge);
    }
    else {
      let target;
      if (isSubElement(originalEdge.target))
        target = originalEdge.target.parent as MMNode;
      else
        target = originalEdge.target;

      let otherDerived;
      if (originalEdge.derivedEdges)
        otherDerived = originalEdge.derivedEdges[0];

      derivedEdge = addDerivedEdge(parent, target, originalEdge);
      derivedEdge.propagation = shouldPropagate;
      derivedEdge.preferedEdge = originalEdge;

      if (otherDerived !== undefined) {
        otherDerived.preferedEdge = originalEdge;
        derivedEdge.preferedEdge = otherDerived;
      }
    }
  }
  else {
    const parent = edgeArray.findStructuralParents(originalEdge.target) as MMNode;
    const result = derivedEdgeArray.findEdgeByEndpoints(originalEdge.source, parent);
    if (result !== null) {
      result.originalEdges.push(originalEdge);
      derivedEdge = result;
      originalEdge.addDerivedEdge(derivedEdge);
    }
    else {
      let source;
      if (isSubElement(originalEdge.source))
        source = originalEdge.source.parent as MMNode;
      else
        source = originalEdge.source;

      let otherDerived;
      if (originalEdge.derivedEdges)
        otherDerived = originalEdge.derivedEdges[0];

      derivedEdge = addDerivedEdge(source, parent, originalEdge);
      derivedEdge.propagation = shouldPropagate;
      derivedEdge.preferedEdge = originalEdge;

      if (otherDerived !== undefined) {
        otherDerived.preferedEdge = originalEdge;
        derivedEdge.preferedEdge = otherDerived;
      }
    }
  }
};

const areRelated = (source: MMNode, target: MMNode): boolean => {
  if (source.isPart && edgeArray.findStructuralParents(source) === target ||
    target.isPart && edgeArray.findStructuralParents(target) === source) {
    return true;
  }
  if (cy.getElementById(source.id).parent() === cy.getElementById(target.id).parent()) {
    return true;
  }
  return false;
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
  if (addedEdge === null)
    return
  const addedEdgeRef = addedEdge.data('MMRef');

  if (hierarchicalStructuralEdges.includes(type)) {
    targetRef.isPart = true;
  }
  else {
    if (!areRelated(sourceRef, targetRef)) {
      edgeDerivation(sourceRef, targetRef, addedEdgeRef);
    }
    if (sourceRef.isPart === true || targetRef.isPart === true) {
      addDerivedEdgesAggregation(addedEdgeRef);
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

  if (MMRef.originalEdges.length) {
    edgeArray.removeOriginalEdges(MMRef.originalEdges);
    for (const edge of MMRef.originalEdges) {
      edge.removeAllDerived();
    }
    MMRef.deleted = false;
    MMRef.originalEdges = [];
    edgeArray.addEdge(MMRef);
  }
  else {
    MMRef.removeAllDerived();
  }

  /* if (!reconnectInCompound(edge)) {
    derivedEdgeArray.removeEdgesById(edgeId);
  } */


  const shouldPropagate = propagation === PropagationEnum.None ? false : true;
  MMRef.propagation = shouldPropagate;

  if (hierarchicalStructuralEdges.includes(MMRef.type)) {
    targetRef.isPart = true;
  }
  else {
    if (!areRelated(sourceRef, targetRef)) {
      edgeDerivation(sourceRef, targetRef, MMRef);
    }
    if (sourceRef.isPart === true || targetRef.isPart === true) {
      addDerivedEdgesAggregation(MMRef);
    }
  }

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


