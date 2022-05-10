/**  
 * @file Left sidebar containing only the diagram tree. 
 * @author Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * @copyright Copyright 2022, OPM Editor
 * @license MIT
 * Made for Bachelor's Thesis - Agile Model Editor
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