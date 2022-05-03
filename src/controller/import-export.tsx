/* 
 * Author: Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * Copyright: Copyright 2022, OPM Editor
 * Made for Bachelor's Thesis - Agile Model Editor
 * License: MIT
*/

// @ts-ignore
import { saveAs } from "file-saver";
import { replacer, reviver } from 'telejson';
import { ACTIONS, currentDiagram } from "../components/App";
import { cy } from "../components/DiagramCanvas";
import { DiagramTreeNode, diagramTreeRoot, importDiagramTreeRoot } from '../model/diagram-tree-model';
import { derivedEdgeArray, edgeArray, EdgeArray, importEdgeArrays, MMEdge } from '../model/edge-model';
import { importMMRoot, masterModelRoot, MMNode, MMRoot } from '../model/master-model';
import { updateFromMasterModel } from "./diagram-switching";
import { eleCounter, ElementCounter } from './elementCounter';


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
  updateFromMasterModel(diagramRoot)
  dispatch({ type: ACTIONS.CHANGE_DIAGRAM, payload: diagramRoot });
  dispatch({ type: ACTIONS.UPDATE_TREE });
};

export const exportJson = () => {
  currentDiagram.diagramJson = cy.json()

  const data = {
      masterModelRoot: masterModelRoot,
      edgeArray: edgeArray,
      derivedEdgeArray: derivedEdgeArray,
      diagramTreeRoot: diagramTreeRoot,
      eleCounter: eleCounter.value,
    };
    //@ts-ignore
    const stringified = JSON.stringify(data, replacer({allowClass:true, allowFunction:false}))
    let blob = new Blob([stringified], {
      type: "text/plain;charset=utf-8"
    });
    saveAs(blob, "graph.json");
}