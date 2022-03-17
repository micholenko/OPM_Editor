import { MasterModelNode } from "./master-model";

export type edgeType = 'consumption' | 'effect' | 'aggregation' | 'instrument' | 'tagged';

class Edge {
  id: string;
  source: MasterModelNode;
  target: MasterModelNode;
  type: edgeType;
  label: string;
  originalEdge: Edge | null;
  deleted: boolean;

  constructor(id: string, source: MasterModelNode, target: MasterModelNode, type: edgeType, originalEdge: Edge | null = null) {
    this.id = id;
    this.source = source;
    this.target = target;
    this.type = type;
    this.label = '';
    this.originalEdge = originalEdge;
    this.deleted = false;
  }
}

class EdgeArray {
  edges: Array<Edge>;
  constructor() {
    this.edges = [];
  }

  addEdge(newEdge: Edge) {
    this.edges.push(newEdge);
  }

  removeEdge(edge: Edge) {
    var index = this.edges.indexOf(edge);
    if (index !== -1) {
      this.edges.splice(index, 1);
    }
  }

  findOutgoingEdges(node: MasterModelNode): Array<Edge> {
    let returnArray: Array<Edge> = [];
    this.edges.forEach(edge => {
      if (edge.source == node)
        returnArray.push(edge);
    });
    return returnArray;
  };

  findIngoingEdges(node: MasterModelNode): Array<Edge> {
    let returnArray: Array<Edge> = [];
    this.edges.forEach(edge => {
      if (edge.target == node)
        returnArray.push(edge);
    });
    return returnArray;
  };

  findRelatedEdges(node: MasterModelNode): Array<Edge> {
    let returnArray: Array<Edge> = [];
    returnArray.concat(this.findIngoingEdges(node));
    returnArray.concat(this.findOutgoingEdges(node));
    return returnArray;
  }

  contains(edge: Edge): boolean {
    this.edges.forEach(element => {
      if (element === edge)
        return true;
    });
    return false;
  }
};


let edgeArray = new EdgeArray();
let derivedEdgeArray = new EdgeArray();
export { edgeArray, derivedEdgeArray, Edge };