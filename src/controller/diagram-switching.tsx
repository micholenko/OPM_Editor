/**  
 * @file Functions related to diagram switching: saving old and importing new diagrams, updating from master model
 * @author Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * @copyright Copyright 2022, OPM Editor
 * @license MIT
 * Made for Bachelor's Thesis - Agile Model Editor
*/

import { Core } from "cytoscape";
import { cy } from "../components/DiagramCanvas";
import { DiagramTreeNode } from "../model/diagram-tree-model";
import { MMEdge } from "../model/edge-model";
import { MMNode } from "../model/node-model";
import { addConnectedNodes } from "./general";

/**
 * Updates edge label on diagram switch. If the edge is merged (derived with multiple originals), name gets concatenated
 * @param MMRef - Master model edge
 * @returns - Single string or a concatenated name
 */
const getEdgeLabel = (MMRef: MMEdge): string => {
  const origEdges = MMRef.originalEdges;
  if (origEdges.length) {
    MMRef.label = origEdges[0].label;
    for (let i = 1; i < origEdges.length; i++) {
      const label = origEdges[i].label;
      if (label.length > 0) {
        MMRef.label += ", " + label;
      }
    }
  }
  return MMRef.label;
};

/**
 * Delete elements marked as deleted or edges that were relinked, update labels
 * @param cy - Cytoscape instance
 */
const updateElementsFromMM = (cy: Core) => {
  for (const node of cy.nodes() as any) {
    const MMRef = node.data('MMRef') as MMNode;
    if (MMRef.type === 'state') {
      const parent = MMRef.parent as MMNode;
      if (parent.deleted === true) {
        node.remove();
        continue;
      }
    }
    if (MMRef.deleted) {
      node.remove();
      continue;
    }
    const newLabelWidth = MMRef.label.length * 8.5 > 60 ? MMRef.label.length * 8.5 : 60;
    node.data({
      labelWidth: newLabelWidth
    });
  }

  for (const edge of cy.edges() as any) {
    const MMRef = edge.data('MMRef');
    if (MMRef.deleted ||
      edge.data('source') != MMRef.source.id ||
      edge.data('target') != MMRef.target.id ||
      MMRef.originalEdge?.deleted) {

      edge.remove();
    }
    else {
      edge.data({
        label: getEdgeLabel(MMRef),
      });
    }
  }
};

/**
 * Main diagram switching logic. Save old diagram and display new one.
 * @param currentDiagram 
 * @param nextDiagram 
 */
export const switchDiagrams = (currentDiagram: DiagramTreeNode, nextDiagram: DiagramTreeNode) => {
  const json = cy.json();
  delete json.style; //cy instance has stylesheet, no need to save it with every diagram
  currentDiagram.diagramJson = json;
  cy.elements().remove();
  cy.json(nextDiagram.diagramJson);
};

/**
 * Go through all displayed nodes and propagate possible edges
 * @param cy Cytoscape instance
 */
const propagateFromMM = (cy: Core) => {
  for (const node of cy.nodes() as any) {
    const MMRef = node.data('MMRef');
    addConnectedNodes(cy, MMRef);
  }
};

/**
 * Update current diagram from master model
 */
export const updateFromMasterModel = () => {
  updateElementsFromMM(cy);
  propagateFromMM(cy);
};