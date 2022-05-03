/* 
 * Author: Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * Copyright: Copyright 2022, OPM Editor
 * Made for Bachelor's Thesis - Agile Model Editor
 * License: MIT
*/


import { MMNode, masterModelRoot, MMRoot } from "./master-model";

class DiagramTreeNode {
  label: React.Key;
  labelId: number;
  parent: DiagramTreeNode | null;
  children: Array<DiagramTreeNode>;
  mainNode: MMNode | MMRoot;
  diagramJson: any;

  constructor(label: React.Key = '', mainNode: MMNode | MMRoot, parent = null,) {
    this.label = label;
    this.labelId = 0;
    this.parent = parent;
    this.children = [];
    this.diagramJson = null;
    this.mainNode = mainNode;
  }

  _findLowestAvailableId(): number {
    const sortedChildren = this.children.sort((a, b) => {
      return a.labelId - b.labelId;
    });
    let index = 1;
    for (const child of sortedChildren) {
      console.log(`${index} ${child.label}`);
      if (child.labelId !== index)
        break;
      index++;
    }
    return index;
  }

  addChild(child: DiagramTreeNode) {
    child.parent = this;

    const index = this._findLowestAvailableId();
    child.labelId = index;


    child.label = this.label;
    if (this !== diagramTreeRoot)
      child.label += '.';
    child.label += index.toString();

    this.children.push(child);

  }
  removeChild(child: DiagramTreeNode) {
    let index = this.children.indexOf(child);
    if (index !== -1) {
      this.children.splice(index, 1);
      return 0;
    }
  }


  get isLeaf() {
    return this.children.length === 0;
  }

  get hasChildren() {
    return !this.isLeaf;
  }
}

let diagramTreeRoot = new DiagramTreeNode('SD', masterModelRoot);

const importDiagramTreeRoot = (newDiagramTreeRoot: DiagramTreeNode) => {
  diagramTreeRoot = newDiagramTreeRoot;
};

export { diagramTreeRoot, DiagramTreeNode, importDiagramTreeRoot };