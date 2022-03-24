import { MMNode } from "./master-model";

export enum EdgeType {
  Consumption = 'consumption',
  Effect = 'effect',
  Aggregation = 'aggregation',
  Instrument = 'instrument',
  Tagged = 'tagged',
};

class MMEdge {
  id: string;
  source: MMNode;
  target: MMNode;
  type: EdgeType;
  label: string;
  originalEdge: MMEdge | null;
  derivedEdges: Array<MMEdge>;
  deleted: boolean;

  constructor(id: string, source: MMNode, target: MMNode, type: EdgeType, originalEdge: MMEdge | null = null, label: string = '') {
    this.id = id;
    this.source = source;
    this.target = target;
    this.type = type;
    this.label = label;
    this.originalEdge = originalEdge;
    this.derivedEdges = [];
    this.deleted = false;
  }
}

class EdgeArray {
  edges: Array<MMEdge>;
  constructor() {
    this.edges = [];
  }

  addEdge(newEdge: MMEdge) {
    this.edges.push(newEdge);
  }

  removeEdge(edge: MMEdge) {
    edge.deleted = true;
    var index = this.edges.indexOf(edge);
    if (index !== -1) {
      this.edges.splice(index, 1);
    }
  }

  removeEdgesById(id: string) {
    for (let i = 0; i < this.edges.length; i++) {
      const edge = this.edges[i]
      if (edge.id === id) {
        this.removeEdge(edge);
        i--;
      }
    }
  }

  findOutgoingEdges(node: MMNode): Array<MMEdge> {
    let returnArray: Array<MMEdge> = [];
    this.edges.forEach(edge => {
      if (edge.source == node)
        returnArray.push(edge);
    });
    return returnArray;
  };

  findIngoingEdges(node: MMNode): Array<MMEdge> {
    let returnArray: Array<MMEdge> = [];
    this.edges.forEach(edge => {
      if (edge.target == node)
        returnArray.push(edge);
    });
    return returnArray;
  };

  findRelatedEdges(node: MMNode): Array<MMEdge> {
    let returnArray: Array<MMEdge> = [];
    returnArray.concat(this.findIngoingEdges(node));
    returnArray.concat(this.findOutgoingEdges(node));
    return returnArray;
  }

  contains(edge: MMEdge): boolean {
    this.edges.forEach(element => {
      if (element === edge)
        return true;
    });
    return false;
  }
};

let edgeArray = new EdgeArray();
let derivedEdgeArray = new EdgeArray();

const importEdgeArrays = (newEdgeArray: EdgeArray, newDerivedEdgeArray: EdgeArray) => {
  edgeArray = newEdgeArray;
  derivedEdgeArray = newDerivedEdgeArray;
};

export { edgeArray, derivedEdgeArray, MMEdge, EdgeArray, importEdgeArrays };