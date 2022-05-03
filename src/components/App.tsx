// @ts-nocheck

/* 
 * Author: Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * Copyright: Copyright 2022, OPM Editor
 * Made for Bachelor's Thesis - Agile Model Editor
 * License: MIT
*/

import { EdgeSingular, NodeSingular } from 'cytoscape';
import { useReducer } from 'react';
import { DiagramTreeNode, diagramTreeRoot } from '../model/diagram-tree-model';
import './../css/general.css';
import DiagramCanvas from './DiagramCanvas';
import EdgeSelectionModal from './EdgeSelectionModal';
import LeftSidebar from './LeftSidebar';
import TopToolbar from './TopToolbar';


export interface useReducerProps {
  state: StateInterface;
  dispatch: Function;
};

export interface StateInterface {
  currentDiagram: DiagramTreeNode,
  lastCreatedDiagram: DiagramTreeNode,
  showEdgeSelectonModal: boolean,
  currentNode: NodeSingular | null,
  currentEdge: EdgeSingular | null,
  propagation: Propagation,
  timestamp: Date
}

export enum PropagationEnum {
  None,
  OneLevel,
  Complete
}

export let propagation: PropagationEnum = PropagationEnum.OneLevel
export let currentDiagram: DiagramTreeNode = diagramTreeRoot

export const ACTIONS = {
  CHANGE_DIAGRAM: 'change-diagram',
  INZOOM_DIAGRAM: 'inzoom-diagram',
  EDGE_SELECTION: 'edge-selection',
  CHANGE_CURRENT_NODE: 'change-current-node',
  CHANGE_CURRENT_EDGE: 'change-current-edge',
  CHANGE_PROPAGATION: 'change-propagation',
  UPDATE_TREE: 'update-tree',
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.CHANGE_DIAGRAM:
      currentDiagram = action.payload;
      return { ...state, currentDiagram: action.payload };
    case ACTIONS.INZOOM_DIAGRAM:
      currentDiagram = action.payload;
      return { ...state, currentDiagram: action.payload, lastCreatedDiagram: action.payload };
    case ACTIONS.EDGE_SELECTION:
      return { ...state, showEdgeSelectonModal: action.payload };
    case ACTIONS.CHANGE_PROPAGATION:
      propagation = action.payload
      return {...state, propagation: action.payload}
    case ACTIONS.UPDATE_TREE:
      return {...state, timestamp: new Date()}
    default:
      console.log('invalid dispatch type')
  }
}

const reducerInitState = {
  currentDiagram: diagramTreeRoot,
  lastCreatedDiagram: null,
  createdEdge: null,
  currentNode: null,
  currentEdge: null,
  propagation: PropagationEnum.OneLevel
};

function App() {
  const [state, dispatch] = useReducer(reducer, reducerInitState);
  return (
    <div className="app">
      <div className='flex-vertical-wrapper'>
        <div className='top-toolbar-wrapper'>
          <TopToolbar state={state} dispatch={dispatch}/>
        </div>
        <div className='flex-horizontal-wrapper'>
          <div className='left-sidebar-wrapper'>
            <LeftSidebar state={state} dispatch={dispatch} />
          </div>
          <div className='diagram-canvas-wrapper'>
            <DiagramCanvas state={state} dispatch={dispatch} />
          </div>
        </div>
      </div>
      <EdgeSelectionModal state={state} dispatch={dispatch} />
    </div>
  );
}

export default App;
