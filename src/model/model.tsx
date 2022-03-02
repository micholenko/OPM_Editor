class TreeNode {
  id: number;
  parent: TreeNode | null;
  children: Array<TreeNode>;

  constructor(id: number, parent = null) {
    this.id = id;
    this.parent = parent;
    this.children = [];
  }

  addChild(child: TreeNode): number {
    this.children.push(child);
    return 0
  }
  removeChild(child: TreeNode): number{
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

class Tree {
  root: TreeNode;

  constructor() {
    this.root = new TreeNode(0);
  }

  addChild(child: TreeNode): number {
    this.root.addChild(child);
    return 0
  }

  /* *preOrderTraversal(node = this.root) {
    yield node;
    if (node.children.length) {
      for (let child of node.children) {
        yield* this.preOrderTraversal(child);
      }
    }
  }

  *postOrderTraversal(node = this.root) {
    if (node.children.length) {
      for (let child of node.children) {
        yield* this.postOrderTraversal(child);
      }
    }
    yield node;
  } */

  /* insert(parentNodeKey, key, value = key) {
    for (let node of this.preOrderTraversal()) {
      if (node.key === parentNodeKey) {
        node.children.push(new TreeNode(key, value, node));
        return true;
      }
    }
    return false;
  }

  remove(key) {
    for (let node of this.preOrderTraversal()) {
      const filtered = node.children.filter(c => c.key !== key);
      if (filtered.length !== node.children.length) {
        node.children = filtered;
        return true;
      }
    }
    return false;
  } */

  /* find(key) {
    for (let node of this.preOrderTraversal()) {
      if (node.key === key) return node;
    }
    return undefined;
  } */
}
let masterModel = new Tree()
export { masterModel, TreeNode };