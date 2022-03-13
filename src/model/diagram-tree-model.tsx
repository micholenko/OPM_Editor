import { MasterModelNode, masterModelRoot, MasterModelRoot} from "./master-model";

class DiagramTreeNode {
    label: React.Key;
    parent: DiagramTreeNode | null;
    children: Array<DiagramTreeNode>;
    mainNode: MasterModelNode | MasterModelRoot;
    diagramJson: any;

    constructor(label: React.Key = '', mainNode: MasterModelNode | MasterModelRoot, parent = null, ) {
        this.label = label;
        this.parent = parent;
        this.children = [];
        this.diagramJson = null;
        this.mainNode = mainNode;
    }

    addChild(child: DiagramTreeNode): number {
        this.children.push(child);
        child.parent = this;
        const index = this.children.length.toString()

        child.label = this.label
        if (this !== diagramTreeRoot)
            child.label += '.'
        child.label += index;
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


let diagramTreeRoot = new DiagramTreeNode('SD', masterModelRoot);

export { diagramTreeRoot, DiagramTreeNode };