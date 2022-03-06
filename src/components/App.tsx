// @ts-nocheck
import React, { createContext, useRef, useState, useEffect} from 'react';
import logo from './logo.svg';
import './../css/general.css';
import TopToolbar from './TopToolbar';
import LeftSidebar from './LeftSidebar';
import DiagramCanvas from './DiagramCanvas';
import { diagramTreeRoot } from '../model/diagram-tree-model';
import EdgeSelectionModal from './EdgeSelectionModal';

export const TreeContext = createContext();

function App() {
  const [currentDiagram, setCurrentDiagram] = useState(diagramTreeRoot);
  const [createdEdge, setCreatedEdge] = useState();
  const [edgeSelectionOpen, setEdgeSelectionOpen] = useState(false)

  return (
    <div className="app">
      <TreeContext.Provider value={{currentDiagram, setCurrentDiagram}}>
        <TopToolbar />
        <div className='flex-wrapper'>
          <LeftSidebar currentDiagram={currentDiagram} />
          <DiagramCanvas currentDiagram={currentDiagram} setCurrentDiagram={setCurrentDiagram} setCreatedEdge={setCreatedEdge} setEdgeSelectionOpen={setEdgeSelectionOpen}/>
        </div>
      <EdgeSelectionModal open={edgeSelectionOpen} setOpen={setEdgeSelectionOpen} createdEdge={createdEdge} />
      </TreeContext.Provider>
    </div>
  );
}

export default App;
