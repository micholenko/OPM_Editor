import { DiagramTreeNode } from "./diagram-tree-model";

import {Essence, Affiliation} from '../enums/node-property-enums'

enum NodeType {
  Object = 'object',
  Process = 'process',
  State = 'state',
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
  }

  addChild(child: MMNode): number {
    this.children.push(child);
    child.parent = this;
    return 0;
  }
  removeChild(child: MMNode): number {
    let index = this.children.indexOf(child);
    if (index !== -1) {
      this.children.splice(index, 1);
      return 0;
    }
    return 1;
  }

  get isLeaf() {
    return this.children.length === 0;
  }

  get hasChildren() {
    return !this.isLeaf;
  }
}

class MMRoot {
  children: Array<MMNode>;

  constructor() {
    this.children = [];
  }

  addChild(child: MMNode) {
    this.children.push(child);
  }
}
let masterModelRoot = new MMRoot();
export { masterModelRoot, MMNode, MMRoot, NodeType};