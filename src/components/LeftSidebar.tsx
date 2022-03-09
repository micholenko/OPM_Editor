// @ts-nocheck
import React, {useEffect} from 'react';
import '../css/general.css';
import { cyto, eh } from './DiagramCanvas';
import DiagramTree from './DiagramTree';

const LeftSidebar = ({currentDiagram}) => {

  return (
    <div className='left-sidebar'>
      <button onClick={() => { eh.enableDrawMode(); }}>enable edge</button>
      <button onClick={() => { eh.disableDrawMode(); }}>disable edge</button>
      <DiagramTree></DiagramTree>
    </div>
  );
};

export default LeftSidebar;