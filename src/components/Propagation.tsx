/**  
 * @file Propagation selection. Implemented with the use of Ant Design Selection component. 
 * @author Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * @copyright Copyright 2022, OPM Editor
 * @license MIT
 * Made for Bachelor's Thesis - Agile Model Editor
*/

import { Radio, RadioChangeEvent, Typography } from 'antd';
import React from 'react';
import { ACTIONS, PropagationEnum, useReducerProps } from './App';


const Propagation: React.FC<useReducerProps> = ({state, dispatch}) => {
  const onChange = (evt: RadioChangeEvent) => {
    const value = evt.target.value
    dispatch({type: ACTIONS.CHANGE_PROPAGATION, payload: value})
  }
  return (
    <>
      <Typography.Text className='propagation-header' strong>Propagation</Typography.Text>
      <Radio.Group onChange={onChange} defaultValue={PropagationEnum.OneLevel} buttonStyle='outline' size='small'>
        <Radio.Button value={PropagationEnum.None}>None</Radio.Button>
        <Radio.Button value={PropagationEnum.OneLevel}>One level</Radio.Button>
        <Radio.Button value={PropagationEnum.Complete}>Complete</Radio.Button>
      </Radio.Group>
    </>
  );
};

export default Propagation;