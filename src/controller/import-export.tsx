/**  
 * @file Functions used when importing from JSON and exporting to JSON
 * @author Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * @copyright Copyright 2022, OPM Editor
 * @license MIT
 * Made for Bachelor's Thesis - Agile Model Editor
*/

// @ts-ignore
import { saveAs } from "file-saver";
import { replacer, reviver } from 'telejson';
import { ACTIONS, currentDiagram } from "../components/App";
import { cy } from "../components/DiagramCanvas";
import { DiagramTreeNode, diagramTreeRoot, importDiagramTreeRoot } from '../model/diagram-tree-model';
import { derivedEdgeArray, originalEdgeArray, EdgeArray, importEdgeArrays, MMEdge } from '../model/edge-model';
import { importMMRoot, masterModelRoot, MMNode, MMRoot } from '../model/node-model';
import { updateFromMasterModel } from "./diagram-switching";
import { eleCounter, ElementCounter } from './elementCounter';


/**
 * Resetting prototypes of master model nodes after importing
 * @param node
 */
const setMMNodePrototype = (node: MMNode) => {
  Object.setPrototypeOf(node, MMNode.prototype);
  for (const child of node.children) {
    setMMNodePrototype(child);
  }
};

/**
 * Resetting prototypes of diagram tree model nodes after importing
 * @param node
 */
const setDiagramTreeNodePrototype = (node: DiagramTreeNode) => {
  Object.setPrototypeOf(node, DiagramTreeNode.prototype);
  for (const child of node.children) {
    setDiagramTreeNodePrototype(child);
  }
};

/**
 * Resetting prototypes of all object in an imported JSON, including
 * node model, edge array, derived edge array, diagram tree model and
 * element counter
 * @param data - Object created from the imported JSON
 */
const setPrototypes = (data: any) => {
  Object.setPrototypeOf(data['originalEdgeArray'], EdgeArray.prototype);
  Object.setPrototypeOf(data['derivedEdgeArray'], EdgeArray.prototype);

  Object.setPrototypeOf(data['masterModelRoot'], MMRoot.prototype);
  Object.setPrototypeOf(data['eleCounter'], ElementCounter.prototype);

  for (const edge of data['originalEdgeArray'].edges) {
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

/**
 * Set global variables of the main model objects
 * @param data - Object created from the imported JSON
 */
const setImportedModel = (data: any) => {
  importMMRoot(data['masterModelRoot']);
  importDiagramTreeRoot(data['diagramTreeRoot']);
  importEdgeArrays(data['originalEdgeArray'], data['derivedEdgeArray']);
  eleCounter.value = data['eleCounter'];
};

/**
 * Handle importing of JSON
 * Parse JSON, reset prototypes, update canvas and signal UI to update
 * @param stringJson - The imported JSON
 * @param dispatch - React reducer function to signal the UI to update after import
 */
export const importJson = (stringJson: any, dispatch: Function) => {
  // @ts-ignore
  const importedData = JSON.parse(stringJson as string, reviver({ allowClass: true, allowFunction: false }));
  setPrototypes(importedData);

  setImportedModel(importedData);
  cy.elements().remove();

  const diagramRoot = importedData['diagramTreeRoot'];
  cy.json(diagramRoot.diagramJson);
  updateFromMasterModel()
  dispatch({ type: ACTIONS.CHANGE_DIAGRAM, payload: diagramRoot });
  dispatch({ type: ACTIONS.UPDATE_TREE });
};

/**
 * Gather all main model objects, stringify them and save. For saving file explorer is invoked.
 */
export const exportJson = () => {
  const json = cy.json()
  delete json.style;
  currentDiagram.diagramJson = json 

  const data = {
      masterModelRoot: masterModelRoot,
      originalEdgeArray: originalEdgeArray,
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