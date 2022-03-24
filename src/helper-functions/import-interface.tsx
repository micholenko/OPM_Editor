import { cy } from "../components/DiagramCanvas";

import { parse, reviver } from 'telejson';
import { ACTIONS } from "../components/App";
import { DiagramTreeNode, importDiagramTreeRoot } from '../model/diagram-tree-model';
import { EdgeArray, importEdgeArrays, MMEdge } from '../model/edge-model';
import { importMMRoot, MMNode, MMRoot } from '../model/master-model';
import { eleCounter, ElementCounter } from '../helper-functions/elementCounter';

const setMMNodePrototype = (node: MMNode) => {
  Object.setPrototypeOf(node, MMNode.prototype);
  for (const child of node.children) {
    setMMNodePrototype(child);
  }
};

const setDiagramTreeNodePrototype = (node: MMNode) => {
  Object.setPrototypeOf(node, DiagramTreeNode.prototype);
  for (const child of node.children) {
    setDiagramTreeNodePrototype(child);
  }
};

const setPrototypes = (data: any) => {
  Object.setPrototypeOf(data['edgeArray'], EdgeArray.prototype);
  Object.setPrototypeOf(data['derivedEdgeArray'], EdgeArray.prototype);

  Object.setPrototypeOf(data['masterModelRoot'], MMRoot.prototype);
  Object.setPrototypeOf(data['eleCounter'], ElementCounter.prototype);

  for (const edge of data['edgeArray'].edges) {
    Object.setPrototypeOf(edge, MMEdge.prototype);
  }

  for (const edge of data['derivedEdgeArray'].edges) {
    Object.setPrototypeOf(edge, MMEdge.prototype);
  }

  for (const node of data['masterModelRoot'].children) {
    setMMNodePrototype(node);
  }
  setDiagramTreeNodePrototype(data['diagramTreeRoot']);
};

const setImportedModel = (data: any) => {
  importMMRoot(data['masterModelRoot']);
  importDiagramTreeRoot(data['diagramTreeRoot']);
  importEdgeArrays(data['edgeArray'], data['derivedEdgeArray']);
  eleCounter.value = data['eleCounter'];
};

export const importJson = (stringJson: any, dispatch: Function) => {
  // @ts-ignore
  const importedData = JSON.parse(stringJson as string, reviver({ allowClass: true, allowFunction: false }));
  setPrototypes(importedData);

  setImportedModel(importedData);
  cy.elements().remove();

  const diagramRoot = importedData['diagramTreeRoot'];
  cy.json(diagramRoot.diagramJson);
  dispatch({ type: ACTIONS.CHANGE_DIAGRAM, payload: diagramRoot });
  dispatch({ type: ACTIONS.UPDATE_TREE });
};