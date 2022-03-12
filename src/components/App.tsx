// @ts-nocheck
import React, { createContext, useRef, useState, useEffect } from 'react';
import logo from './logo.svg';
import './../css/general.css';
import TopToolbar from './TopToolbar';
import LeftSidebar from './LeftSidebar';
import DiagramCanvas from './DiagramCanvas';
import { DiagramTreeNode, diagramTreeRoot } from '../model/diagram-tree-model';
import EdgeSelectionModal from './EdgeSelectionModal';


export const TreeContext = createContext<context>();

function App() {
  //use reducer
  let createdEdge = useRef();
  let currentDiagram = useRef<DiagramTreeNode>(diagramTreeRoot);
  const [rerender, setRerender] = useState(false);
  const [edgeSelectionOpen, setEdgeSelectionOpen] = useState(false);

  return (
    <div className="app">
      <TreeContext.Provider value={{ currentDiagram }}>
        <div className='flex-vertical-wrapper'>
          <div className='top-toolbar-wrapper'>
            <TopToolbar />
          </div>
          <div className='flex-horizontal-wrapper'>
            <div className='left-sidebar-wrapper'>
              <LeftSidebar />
            </div>
            <div className='diagram-canvas-wrapper'>
              <DiagramCanvas currentDiagram={currentDiagram} createdEdge={createdEdge} setEdgeSelectionOpen={setEdgeSelectionOpen} setRerender={setRerender} />
            </div>
          </div>
        </div>
        <EdgeSelectionModal open={edgeSelectionOpen} setOpen={setEdgeSelectionOpen} createdEdge={createdEdge} />
      </TreeContext.Provider>
    </div>
  );
}

export default App;
