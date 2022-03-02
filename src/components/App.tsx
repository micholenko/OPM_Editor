// @ts-nocheck
import React, { createContext, useState } from 'react';
import logo from './logo.svg';
import './../css/general.css';
import TopToolbar from './TopToolbar';
import LeftSidebar from './LeftSidebar';
import DiagramCanvas from './DiagramCanvas';
import { diagramTree } from '../model/diagramTreeModel';

export const TreeContext = createContext();

function App() {
  const [updateTree, setUpdateTree] = useState({})
  const [currentDiagram, setCurrentDiagram] = useState(diagramTree.root)
  return (
    <div className="app">
      <TreeContext.Provider value={{updateTree, setUpdateTree, currentDiagram, setCurrentDiagram}}>
        <TopToolbar />
        <div className='flex-wrapper'>
          <LeftSidebar currentDiagram={currentDiagram}/>
          <DiagramCanvas />
        </div>
      </TreeContext.Provider>
    </div>
  );
}

export default App;
