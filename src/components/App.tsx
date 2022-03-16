// @ts-nocheck
import { useReducer } from 'react';
import './../css/general.css';
import TopToolbar from './TopToolbar';
import LeftSidebar from './LeftSidebar';
import DiagramCanvas from './DiagramCanvas';
import { DiagramTreeNode, diagramTreeRoot } from '../model/diagram-tree-model';
import EdgeSelectionModal from './EdgeSelectionModal';
import { EdgeSingular, NodeSingular } from 'cytoscape';



export interface StateInterface {
  currentDiagram: DiagramTreeNode,
  lastCreatedDiagram: DiagramTreeNode,
  showEdgeSelectonModal: boolean,
  currentNode: NodeSingular | null,
  currentEdge: EdgeSingular | null,
}

export const ACTIONS = {
  CHANGE_DIAGRAM: 'change-diagram',
  INZOOM_DIAGRAM: 'inzoom-diagram',
  EDGE_SELECTION: 'edge-selection',
  CHANGE_CURRENT_NODE: 'change-current-node',
  CHANGE_CURRENT_EDGE: 'change-current-edge',

};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.CHANGE_DIAGRAM:
      return { ...state, currentDiagram: action.payload };
    case ACTIONS.INZOOM_DIAGRAM:
      return { ...state, currentDiagram: action.payload, lastCreatedDiagram: action.payload };
    case ACTIONS.EDGE_SELECTION:
      return { ...state, showEdgeSelectonModal: action.payload };
  }
}

const reducerInitState = {
  currentDiagram: diagramTreeRoot,
  createdEdge: null,
  currentNode: null,
  currentEdge: null,
};

function App() {
  const [state, dispatch] = useReducer(reducer, reducerInitState);
  return (
    <div className="app">
      <div className='flex-vertical-wrapper'>
        <div className='top-toolbar-wrapper'>
          <TopToolbar />
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
