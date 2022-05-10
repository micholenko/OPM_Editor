/**  
 * @file Class of the diagram tree model nodes.
 * @author Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * @copyright Copyright 2022, OPM Editor
 * @license MIT
 * Made for Bachelor's Thesis - Agile Model Editor
*/


import { MMNode, masterModelRoot, MMRoot } from "./node-model";

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

  /**
   * Goes through all nodes and finds the lowest not used ID.
   * Necessary when new diagrams are created after some were deleted.
   * @returns - Lowest available diagram id
   */
  _findLowestAvailableId(): number {
    const sortedChildren = this.children.sort((a, b) => {
      return a.labelId - b.labelId;
    });
    let index = 1;
    for (const child of sortedChildren) {
      if (child.labelId !== index)
        break;
      index++;
    }
    return index;
  }

  /**
   * Adds given diagram as a child element of this and sets this as a parent of the given diagram.
   * Label of the newly added diagram is determined.
   * @param child - Diagram node to be added
   */
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

  /**
   * Remove the given child
   * @param child Diagram model node to be removed
   */
  removeChild(child: DiagramTreeNode) {
    let index = this.children.indexOf(child);
    if (index !== -1) {
      this.children.splice(index, 1);
    }
  }
}

let diagramTreeRoot = new DiagramTreeNode('SD', masterModelRoot);

//used when importing from JSON
const importDiagramTreeRoot = (newDiagramTreeRoot: DiagramTreeNode) => {
  diagramTreeRoot = newDiagramTreeRoot;
};

export { diagramTreeRoot, DiagramTreeNode, importDiagramTreeRoot };