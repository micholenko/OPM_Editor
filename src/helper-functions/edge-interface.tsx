import { Core, NodeSingular } from "cytoscape";
import { edgeArray, Edge, derivedEdgeArray } from '../model/edge-model';
import {edgeType} from '../model/edge-model'

let sourceNode: NodeSingular | null = null;
let targetNode: NodeSingular | null = null;

export const edgeStartDrawing = (eh: any, evt: Event) => {
  sourceNode = evt.target as unknown as NodeSingular;
  sourceNode?.addClass('eh-source');
  eh.start(sourceNode);
};

export const edgeStopDrawing = (eh: any) => {
  eh.stop();
};

export const edgeDragOver = (evt: any) => {
  if (sourceNode != null) {
    targetNode = evt.target;
    targetNode?.addClass('eh-hover');
  }
};

export const edgeDragOut = (evt: any) => {
  evt.target.removeClass('eh-hover');
  targetNode = null;
};

export const edgeCheckValidTargets = (callback: Function) => {
  if (sourceNode != null && targetNode != null){
    callback()
  }
}

export const edgeCreate = (cy: Core, edgeType: edgeType ) => {
  if (sourceNode != null && targetNode != null) {
    let modelEdge, derivedEdge;

    modelEdge = new Edge(
      sourceNode.data('MasterModelRef'),
      targetNode.data('MasterModelRef'),
      edgeType,
    );
    const addedEdge = cy.add({
      group: 'edges',
      data: {
        source: sourceNode.data('id'),
        target: targetNode.data('id'),
        MasterModelRef: modelEdge,
        type: edgeType,
        label: ''
      },
    });

    edgeArray.addEdge(modelEdge);
    if (sourceNode.isChild()) {
      derivedEdge = new Edge(
        sourceNode.parent()[0].data('MasterModelRef'),
        targetNode.data('MasterModelRef'),
        'consumption',//default
      );
      derivedEdgeArray.addEdge(derivedEdge);
    }
    else if (targetNode.isChild()) {
      derivedEdge = new Edge(
        sourceNode.data('MasterModelRef'),
        targetNode.parent()[0].data('MasterModelRef'),
        'consumption',//default
      );
      derivedEdgeArray.addEdge(derivedEdge);
    }

    targetNode.removeClass('eh-hover');
  }
  sourceNode = null;
  targetNode = null;
};


