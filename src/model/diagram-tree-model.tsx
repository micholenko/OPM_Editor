class DiagramTreeNode {
    id: number;
    parent: DiagramTreeNode | null;
    children: Array<DiagramTreeNode>;
    diagramJson: any;

    constructor(id: number, parent = null) {
        this.id = id;
        this.parent = parent;
        this.children = [];
        this.diagramJson = null;
    }

    addChild(child: DiagramTreeNode): number {
        this.children.push(child);
        child.parent = this; //necesarry?
        return 0;
    }
    removeChild(child: DiagramTreeNode): number {
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

let diagramTreeRoot = new DiagramTreeNode(0);

export { diagramTreeRoot, DiagramTreeNode };