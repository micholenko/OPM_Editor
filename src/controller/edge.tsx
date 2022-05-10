/**  
 * @file Functions related to edges: creation, reconnection, derivation, propagation
 * @author Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * @copyright Copyright 2022, OPM Editor
 * @license MIT
 * Made for Bachelor's Thesis - Agile Model Editor
*/

import { NodeSingular } from "cytoscape";
import { currentDiagram, propagation, PropagationEnum, StateInterface } from "../components/App";
import { cy } from '../components/DiagramCanvas';
import { diagramTreeRoot } from "../model/diagram-tree-model";
import { derivedEdgeArray, EdgeType, hierarchicalStructuralEdges, MMEdge, originalEdgeArray } from '../model/edge-model';
import { masterModelRoot, MMNode } from "../model/node-model";
import { eleCounter } from './elementCounter';
import { addEdge } from './general';

//global endpoints, set or unset by following functions
let sourceNode: NodeSingular | null = null;
let targetNode: NodeSingular | null = null;

/**
 * Function to be invoked on edge create start event - right click and drag. 
 * The edge preview is handled by edgehandles extesion.
 * @param eh - Edgehandles extension instance
 * @param evt - Event object
 */
export const edgeCreateStart = (eh: any, evt: Event) => {
  sourceNode = evt.target as unknown as NodeSingular;
  sourceNode?.addClass('eh-source');
  eh.start(sourceNode);
};

/**
 * Stopping edge creation
 * @param eh - Edgehandles extension instance
 */
export const edgeCreateStop = (eh: any) => {
  eh.stop();
};

/**
 * Color element that is dragged over with mouse on while creating an edge.
 * @param evt - Event object
 */
export const edgeCreateDragOverElement = (evt: any) => {
  targetNode = evt.target;
  if (targetNode !== sourceNode) {
    targetNode?.addClass('eh-hover');
  }
};

/**
 * Reset element fill while the element is not dragged over while creating an edge.
 * @param evt - Event object
 */
export const edgeCreateDragOutOfElement = (evt: any) => {
  evt.target.removeClass('eh-hover');
  targetNode = null;
};

/**
 * Validate before creating an edge, if ok display edge type selection modal. 
 * @param callback - Dispatch reducer function
 */
export const edgeCreateValidate = (callback: Function) => {
  sourceNode?.removeClass('eh-hover');
  targetNode?.removeClass('eh-hover');
  if (sourceNode != null && targetNode != null && sourceNode !== targetNode) {
    callback();
  }
};

/**
 * Reset after user cancel (closing of edge type selection modal).
 */
export const edgeCreateCancel = () => {
  targetNode?.removeClass('eh-hover');
  sourceNode = null;
  targetNode = null;
};

/**
 * Is a child in a compound node (subprocess or a state).
 * @param node - Master model node
 * @returns - True if is subelement, false if not
 */
const isSubElement = (node: MMNode) => {
  return cy.getElementById(node.id).isChild();
};

/**
 * Determine if edge endpoints are related, i.e., parent and child in structural relationship, 
 * 2 subprocesses of the same process, object and its states.
 * @param source - Master model source 
 * @param target - Master model target
 * @returns - True if related, false if not
 */
const areRelated = (source: MMNode, target: MMNode): boolean => {
  if (source.isStructurePart && originalEdgeArray.findStructuralParent(source) === target ||
    target.isStructurePart && originalEdgeArray.findStructuralParent(target) === source) {
    return true;
  }
  if (cy.getElementById(source.id).parent() === cy.getElementById(target.id).parent()) {
    return true;
  }
  return false;
};


/**
 * Create a new derived edge based on the given original edge, link them together.
 * @param source - Master model source mpde
 * @param target - Master model target node
 * @param originalEdge - Master mode original edge
 * @returns - Reference to newly created master model derived edge
 */
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

/**
 * Iterate through parents and create a derived edge for each. Works with processes and subprocesses
 * @param propagate - Should be automatically propagated on diagram switch
 * @param sourceRef - Master model source mpde
 * @param targetRef - Master model target node
 * @param originalEdge - Master model original edge
 * @param sourceMain - Whether source is main diagram element (main process or its subprocess)
 * @param iterator
 */
const deriveAll = (propagate: boolean, sourceRef: MMNode, targetRef: MMNode, originalEdge: MMEdge, sourceMain: boolean, iterator: MMNode) => {
  if (sourceNode === null || targetNode === null)
    return;

  if (sourceMain) {
    while (iterator !== masterModelRoot) {
      const derivedEdge = addDerivedEdge(iterator as MMNode, targetRef, originalEdge);
      derivedEdge.propagation = propagate;
      //@ts-ignore
      iterator = iterator.parent;
    }
  }
  else {
    while (iterator !== masterModelRoot) {
      const derivedEdge = addDerivedEdge(sourceRef, iterator as MMNode, originalEdge);
      derivedEdge.propagation = propagate;
      //@ts-ignore
      iterator = iterator.parent;
    }
  }
};

/**
 * Based on the current propagation, handle edge derivation. 
 * Complete - all derived get propagated
 * One Level - only first derived edge gets propagated
 * None - No derived edges get propagated
 * @param sourceRef - Master model source
 * @param targetRef - Master model target
 * @param originalEdge - Master model original edge
 */
const edgeDerivation = (sourceRef: MMNode, targetRef: MMNode, originalEdge: MMEdge) => {
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
    deriveAll(false, sourceRef, targetRef, originalEdge, sourceMain, iterator);
  }
  else if (propagation === PropagationEnum.Complete) {
    deriveAll(true, sourceRef, targetRef, originalEdge, sourceMain, iterator);
  }
  else if (propagation === PropagationEnum.OneLevel) {
    if (sourceMain) {
      const derivedEdge = addDerivedEdge(iterator, targetRef, originalEdge);
      derivedEdge.propagation = true;
      iterator = iterator.parent as MMNode;
    }
    else {
      const derivedEdge = addDerivedEdge(sourceRef, iterator, originalEdge);
      derivedEdge.propagation = true;
      iterator = iterator.parent as MMNode;
    }
    deriveAll(false, sourceRef, targetRef, originalEdge, sourceMain, iterator);
  }
};


/**
 * Additional derivation when structural parents exist or one of orignal edge endpoints is a state
 * @param originalEdge - Master model original edge
 */
const edgeDerivationStructuralAndStates = (originalEdge: MMEdge) => {
  const shouldPropagate = propagation == PropagationEnum.None ? false : true;
  let derivedEdge;
  if (originalEdge.source.isStructurePart) {
    let target;
    if (isSubElement(originalEdge.target))
      target = originalEdge.target.parent as MMNode;
    else
      target = originalEdge.target;

    const parent = originalEdgeArray.findStructuralParent(originalEdge.source) as MMNode;
    const result = derivedEdgeArray.findEdgeByEndpoints(parent, target);
    if (result !== null) {
      result.originalEdges.push(originalEdge);
      derivedEdge = result;
      originalEdge.addDerivedEdge(derivedEdge);
    }
    else {

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
    let source;
    if (isSubElement(originalEdge.source))
      source = originalEdge.source.parent as MMNode;
    else
      source = originalEdge.source;
    const parent = originalEdgeArray.findStructuralParent(originalEdge.target) as MMNode;
    const result = derivedEdgeArray.findEdgeByEndpoints(source, parent);
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



/**
 * Main edge creation function, invoked after type selection.
 * Handles model edge creation and deriving 
 * @param type - Edge type
 * @param state - UI state
 */
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
  const addedEdge = addEdge(cy, data, shouldPropagate);
  if (addedEdge === null)
    return;
  const addedEdgeRef = addedEdge.data('MMRef');

  if (hierarchicalStructuralEdges.includes(type)) {
    targetRef.isStructurePart = true;
  }
  else if (sourceRef.isStructurePart || sourceRef.isSubelementOfMain || targetRef.isStructurePart || targetRef.isSubelementOfMain) {
    if (!areRelated(sourceRef, targetRef)) {
      edgeDerivation(sourceRef, targetRef, addedEdgeRef);
    }
    if (sourceRef.isStructurePart === true || targetRef.isStructurePart === true) {
      edgeDerivationStructuralAndStates(addedEdgeRef);
    }
  }

  targetNode.removeClass('eh-hover');
  sourceNode = null;
  targetNode = null;
};


/**
 * Main reconnection function. Handles deletion of old edges and creation of new ones
 * as well as deriving. Called from the cytoscape-edgehandles extension
 * @param sourceID - Source node id
 * @param targetID - Target node id
 * @param data - cytoscape edge data
 */
export const edgeReconnect = (sourceID: string, targetID: string, data: any) => {
  if (sourceID === targetID)
    return;

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
    originalEdgeArray.removeOriginalEdges(MMRef.originalEdges);
    for (const edge of MMRef.originalEdges) {
      edge.removeAllDerived();
    }
    MMRef.deleted = false;
    MMRef.originalEdges = [];
    originalEdgeArray.addEdge(MMRef);
  }
  else {
    MMRef.removeAllDerived();
  }

  const shouldPropagate = propagation === PropagationEnum.None ? false : true;
  MMRef.propagation = shouldPropagate;

  if (hierarchicalStructuralEdges.includes(MMRef.type)) {
    targetRef.isStructurePart = true;
  }
  else if (sourceRef.isStructurePart || sourceRef.isSubelementOfMain || targetRef.isStructurePart || targetRef.isSubelementOfMain) {
    if (!areRelated(sourceRef, targetRef)) {
      edgeDerivation(sourceRef, targetRef, MMRef);
    }
    if (sourceRef.isStructurePart === true || targetRef.isStructurePart === true) {
      edgeDerivationStructuralAndStates(MMRef);
    }
  }

  edge.move({
    source: sourceID,
    target: targetID
  });

};


