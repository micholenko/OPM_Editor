class diagramTreeNode {
    id: number;
    parent: diagramTreeNode | null;
    children: Array<diagramTreeNode>;
    diagramJson: any;

    constructor(id: number, parent = null) {
        this.id = id;
        this.parent = parent;
        this.children = [];
        this.diagramJson = null;
    }

    addChild(child: diagramTreeNode): number {
        this.children.push(child);
        return 0
    }
    removeChild(child: diagramTreeNode): number {
        let index = this.children.indexOf(child);
        if (index !== -1) {
            this.children.splice(index, 1);
            return 0;
        }
        return 1;
    }

    /* get isLeaf() {
        return this.children.length === 0;
    }

    get hasChildren() {
        return !this.isLeaf;
    } */
}

class Tree {
    root: diagramTreeNode;

    constructor() {
        this.root = new diagramTreeNode(0);
    }

    addChild(child: diagramTreeNode): number {
        this.root.addChild(child);
        return 0
    }
    
}
let diagramTree = new Tree()

export { diagramTree, diagramTreeNode };