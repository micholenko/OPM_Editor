import { Core, NodeSingular } from "cytoscape";
import { edgeArray, Edge, derivedEdgeArray } from '../model/edge-model';
import { edgeType } from '../model/edge-model';
import { eleCounter } from './elementCounter'

let sourceNode: NodeSingular | null = null;
let targetNode: NodeSingular | null = null;


export const cyAddEdge = (cy: Core, data: any) => {
  if (!('MasterModelRef' in data)) {
    // @ts-ignore
    let modelEdge = new Edge(data['id'], sourceNode.data('MasterModelRef'), targetNode.data('MasterModelRef'), data['type']);
    edgeArray.addEdge(modelEdge);
    data['MasterModelRef'] = modelEdge;
  }
  cy.add({
    data: data,
  });
};

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
  if (sourceNode != null && targetNode != null) {
    callback();
  }
};

export const edgeCreate = (cy: Core, edgeType: edgeType) => {
  if (sourceNode != null && targetNode != null) {
    let modelEdge, derivedEdge;
    const counter = eleCounter.value;

    const data =  {
        id: counter,
        source: sourceNode.data('id'),
        target: targetNode.data('id'),
        type: edgeType,
        label: ''
    };
    cyAddEdge(cy, data);

    if (sourceNode.isChild()) {
      derivedEdge = new Edge(
        counter,
        sourceNode.parent()[0].data('MasterModelRef'),
        targetNode.data('MasterModelRef'),
        'consumption',//default
      );
      derivedEdgeArray.addEdge(derivedEdge);
    }
    else if (targetNode.isChild()) {
      derivedEdge = new Edge(
        counter,
        sourceNode.data('MasterModelRef'),
        targetNode.parent()[0].data('MasterModelRef'),
        'consumption',//default
      );
      derivedEdgeArray.addEdge(derivedEdge);
    }

    targetNode.removeClass('eh-hover');

    if (edgeType === 'aggregation')
    {
      targetNode.on('drag', (event) => {
        // console.log(event.target.position()) 
      })
    }
  }
  sourceNode = null;
  targetNode = null;
};


