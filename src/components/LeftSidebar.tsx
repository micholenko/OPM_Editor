import '../css/general.css';
import DiagramTree from './DiagramTree';
import { useReducerProps } from './App'; 

const LeftSidebar: React.FC<useReducerProps> = ({ state, dispatch }) => {

  return (
    <div className='left-sidebar'>
      <DiagramTree state={state} dispatch={dispatch}/>
    </div>
  );
};

export default LeftSidebar;