import { MasterModelNode, masterModelRoot, MasterModelRoot} from "./master-model";

class DiagramTreeNode {
    id: number;
    parent: DiagramTreeNode | null;
    children: Array<DiagramTreeNode>;
    mainNode: MasterModelNode | MasterModelRoot;
    diagramJson: any;

    constructor(id: number, mainNode: MasterModelNode | MasterModelRoot, parent = null, ) {
        this.id = id;
        this.parent = parent;
        this.children = [];
        this.diagramJson = null;
        this.mainNode = mainNode;
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

    update(): void{
        
    }

    get isLeaf() {
        return this.children.length === 0;
    }

    get hasChildren() {
        return !this.isLeaf;
    }
}


let diagramTreeRoot = new DiagramTreeNode(0, masterModelRoot);

export { diagramTreeRoot, DiagramTreeNode };