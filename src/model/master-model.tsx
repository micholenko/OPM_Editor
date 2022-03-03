class MasterModelNode {
  id: number;
  parent: MasterModelNode | MasterModelRoot | null;
  children: Array<MasterModelNode>;
  type: 'object' | 'process';

  constructor(id: number, type: 'object' | 'process') {
    this.id = id;
    this.type = type;
    this.parent = null;
    this.children = [];

  }

  addChild(child: MasterModelNode): number {
    this.children.push(child);
    child.parent = this;
    return 0;
  }
  removeChild(child: MasterModelNode): number {
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

class MasterModelRoot {
  children: Array<MasterModelNode>;

  constructor() {
    this.children = [];
  }

  addChild(child: MasterModelNode) {
    this.children.push(child);
  }
}
let masterModelRoot = new MasterModelRoot();
export { masterModelRoot, MasterModelNode };