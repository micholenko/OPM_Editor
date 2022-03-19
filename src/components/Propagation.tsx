import React from 'react';
import { Radio, RadioChangeEvent } from 'antd';
import { Typography } from 'antd';
import { ACTIONS, useReducerProps } from './App';
import { PropagationEnum } from './App';

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