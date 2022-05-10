/* 
 * Author: Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * Copyright: Copyright 2022, OPM Editor
 * Made for Bachelor's Thesis - Agile Model Editor
 * License: MIT
*/

import { Core } from "cytoscape";
import { cy } from "../components/DiagramCanvas";
import { DiagramTreeNode, diagramTreeRoot } from "../model/diagram-tree-model";
import { MMEdge } from "../model/edge-model";
import { MMNode } from "../model/node-model";
import { cyAddConnectedNodes } from "./general";


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

const updateNodesFromMM = (cy: Core) => {
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

  // @ts-ignore
  for (const edge of cy.edges()) {
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

export const switchDiagrams = (currentDiagram: DiagramTreeNode, nextDiagram: DiagramTreeNode) => {
  const json = cy.json();
  delete json.style;
  currentDiagram.diagramJson = json;
  cy.elements().remove();
  cy.json(nextDiagram.diagramJson);
};

export const updateFromMasterModel = (diagram: DiagramTreeNode) => {
  updateNodesFromMM(cy);
  for ( const node of cy.nodes()){
    const MMRef = node.data('MMRef')
    cyAddConnectedNodes(cy, MMRef);
  }
};