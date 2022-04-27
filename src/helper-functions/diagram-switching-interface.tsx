import { MMEdge } from "../model/edge-model";
import { cy } from "../components/DiagramCanvas";
import { Core } from "cytoscape";
import { masterModelRoot, MMNode } from "../model/master-model";
import { DiagramTreeNode, diagramTreeRoot } from "../model/diagram-tree-model";
import { cyAddConnectedNodes } from "./cytoscape-interface";


const getEdgeLabel = (MMRef: MMEdge): string => {
  if (MMRef.originalEdge)
    return MMRef.originalEdge.label;
  else
    return MMRef.label;
};

const updateNodesFromMM = (cy: Core, mainNode: MMNode) => {

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
    const newLabelWidth = MMRef.label.length * 8.5 > 60 ?  MMRef.label.length  * 8.5 : 60
    node.data({
      labelWidth: newLabelWidth
    });
  }

  //remove unlinked
  // @ts-ignore
  for (const edge of cy.edges()) {
    const MMRef = edge.data('MMRef');
    if (MMRef.deleted ||
      edge.data('source') != MMRef.source.id ||
      edge.data('target') != MMRef.target.id || //edge.source()
      MMRef.originalEdge?.deleted) {

      const prevTargetId = edge.target().data('MMRef').id;
      const prevSourceId = edge.source().data('MMRef').id;

      edge.remove();
      if (mainNode === masterModelRoot) {
        if (prevSourceId !== MMRef.source.id && MMRef.source.diagram !== null) {
          edge.source().remove();
        }
        else if (prevTargetId !== MMRef.target.id && MMRef.target.diagram !== null) {
          edge.target().remove();
        }
      }
      else {
        if (mainNode.id === prevSourceId) {
          edge.target().remove();
        }
        else if (mainNode.id === prevTargetId) {
          edge.source().remove();
        }
      }
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
  console.log(json);
  currentDiagram.diagramJson = json;
  cy.elements().remove();
  cy.json(nextDiagram.diagramJson);
};

export const updateFromMasterModel = (diagram: DiagramTreeNode) => {
  const mainNode = diagram.mainNode as MMNode;
  updateNodesFromMM(cy, mainNode);
  if (diagram === diagramTreeRoot) {
    const nodes = mainNode.children;
    nodes.forEach((node: MMNode) => {
      cyAddConnectedNodes(cy, node);
    });
  }
  else {
    const nodes = mainNode.children;
    nodes.forEach((node: MMNode) => {
      cyAddConnectedNodes(cy, node);
    });
    cyAddConnectedNodes(cy, mainNode);
  }
};