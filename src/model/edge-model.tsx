import { MasterModelNode } from "./master-model";

type edgeType = 'consumption' | 'effect';

class Edge {
  source: MasterModelNode;
  target: MasterModelNode;
  type: edgeType;

  constructor(source: MasterModelNode, target: MasterModelNode, type: edgeType) {
    this.source = source;
    this.target = target;
    this.type = type;
  }
}

class EdgeMasterModel {
  edges: Array<Edge>;
  constructor() {
    this.edges = [];
  }

  findEdgesbySource(source: MasterModelNode): Array<Edge> {
    let returnArray: Array<Edge> = [];
    this.edges.forEach(edge => {
      if (edge.source == source)
        returnArray.push(edge);
    });
    return returnArray;
  };

  findEdgesbyTarget(target: MasterModelNode): Array<Edge> {
    let returnArray: Array<Edge> = [];
    this.edges.forEach(edge => {
      if (edge.target == target)
        returnArray.push(edge);
    });
    return returnArray;
  };
};


let edgeMasterModel = new EdgeMasterModel();
export { edgeMasterModel, Edge };