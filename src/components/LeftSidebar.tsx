/* 
 * Author: Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * Copyright: Copyright 2022, OPM Editor
 * Made for Bachelor's Thesis - Agile Model Editor
 * License: MIT
*/

import '../css/general.css';
import { useReducerProps } from './App';
import DiagramTree from './DiagramTree';


const LeftSidebar: React.FC<useReducerProps> = ({ state, dispatch }) => {

  return (
    <div className='left-sidebar'>
      <DiagramTree state={state} dispatch={dispatch}/>
    </div>
  );
};

export default LeftSidebar;