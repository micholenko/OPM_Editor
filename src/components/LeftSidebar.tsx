// @ts-nocheck
import React, {useEffect} from 'react';
import '../css/general.css';
import { cyto, eh } from './DiagramCanvas';
import DiagramTree from './DiagramTree';

const LeftSidebar = () => {

  return (
    <div className='left-sidebar'>
      <DiagramTree></DiagramTree>
    </div>
  );
};

export default LeftSidebar;