// @ts-nocheck
import '../css/general.css';
import DiagramTree from './DiagramTree';

const LeftSidebar = ({ state, dispatch }) => {

  return (
    <div className='left-sidebar'>
      <DiagramTree state={state} dispatch={dispatch}/>
    </div>
  );
};

export default LeftSidebar;