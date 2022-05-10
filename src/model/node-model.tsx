/**  
 * @file Classes of the nodes in the node model and the root.
 * @author Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * @copyright Copyright 2022, OPM Editor
 * @license MIT
 * Made for Bachelor's Thesis - Agile Model Editor
*/

import { DiagramTreeNode } from "./diagram-tree-model";

enum NodeType {
  Object = 'object',
  Process = 'process',
  State = 'state',
}

enum Essence {
  Informatical = 'no',
  Physical = 'yes'
}

enum Affiliation {
  Systemic = 'solid',
  Environmental = 'dashed'
}


class MMNode {
  id: string;
  parent: MMNode | MMRoot | null;
  children: Array<MMNode>;
  type: 'object' | 'process' | 'state';
  label: string;
  diagram: DiagramTreeNode | null;
  deleted: boolean;
  essence: Essence;
  affiliation: Affiliation;
  isStructurePart: boolean;
  isSubelementOfMain: boolean;

  constructor(id: string, type: 'object' | 'process' | 'state', label: string) {
    this.id = id;
    this.label = label;
    this.type = type;
    this.parent = null;
    this.children = [];
    this.diagram = null;
    this.deleted = false;
    this.essence = Essence.Informatical;
    this.affiliation = Affiliation.Systemic;
    this.isStructurePart = false;
    this.isSubelementOfMain = false;
  }

  /**
   * Add a given node to the .children array. Set this as the child's parent,
   * @param child - Model node to be added
   */
  addChild(child: MMNode) {
    this.children.push(child);
    child.parent = this;
  }

  /**
   * Remove a child from the .children array.
   * @param child Model node to be removed
   */
  removeChild(child: MMNode) {
    let index = this.children.indexOf(child);
    if (index !== -1) {
      this.children.splice(index, 1);
    }
  }
}

class MMRoot {
  children: Array<MMNode>;

  constructor() {
    this.children = [];
  }

  /**
   * Add a given node to the .children array. Set this as the child's parent
   * @param child - Model node to be added
   */
  addChild = (child: MMNode) => {
    this.children.push(child);
    child.parent = this;
  };

  /**
   * Remove a child from the .children array.
   * @param child Model node to be removed
   */
  removeChild(child: MMNode) {
    let index = this.children.indexOf(child);
    if (index !== -1) {
      this.children.splice(index, 1);
    }
  }
}
let masterModelRoot = new MMRoot();

//used when importing from JSON
const importMMRoot = (newRoot: MMRoot) => {
  masterModelRoot = newRoot;
};

export { masterModelRoot, MMNode, MMRoot, NodeType, importMMRoot, Essence, Affiliation };