// @ts-nocheck
import React, {useEffect} from 'react';
import '../css/general.css';
import { cyto, eh } from './DiagramCanvas';
import TreeDiagram from './TreeDiagram';

const LeftSidebar = ({currentDiagram}) => {
  useEffect(() => {
    console.log(currentDiagram)
  }, [currentDiagram.current]);

  return (
    <div className='left-sidebar'>
      <button onClick={() => { eh.enableDrawMode(); }}>enable edge</button>
      <button onClick={() => { eh.disableDrawMode(); }}>disable edge</button>
      <TreeDiagram currentDiagram={currentDiagram} />
    </div>
  );
};

export default LeftSidebar;