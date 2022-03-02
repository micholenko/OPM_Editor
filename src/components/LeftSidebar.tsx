// @ts-nocheck
import React from 'react';
import '../css/general.css';
import { cyto, eh } from './DiagramCanvas';
import TreeDiagram from './TreeDiagram';

const LeftSidebar = ({ currentDiagram }) => {

  return (
    <div className='left-sidebar'>
      <button onClick={() => { eh.enableDrawMode(); }}>enable edge</button>
      <button onClick={() => { eh.disableDrawMode(); }}>disable edge</button>
      <TreeDiagram />
    </div>
  );
};

export default LeftSidebar;