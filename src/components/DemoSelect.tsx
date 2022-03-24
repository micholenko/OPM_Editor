import React from 'react';
import { Select } from 'antd';
import { useReducerProps } from './App';
import { importJson } from '../helper-functions/import-interface';
import simpleDemo from '../demos/simple.json';
const { Option } = Select;

const DemoSelect: React.FC<useReducerProps> = ({ state, dispatch }) => {
  const onChange = (filename:string ) => {
    if (filename === 'simple'){
      const string = JSON.stringify(simpleDemo)
      importJson(string, dispatch);
    }
    /* else if (filename === 'advanced'){
      importJson(advancedDemo, dispatch);
    } */
  };

  return (
    <Select className='demo-selection' placeholder="Select demo"  onChange={onChange}>
      <Option value="simple">Simple</Option>
      {/* <Option value="advanced">Advanced</Option> */}
    </Select>
  );
};

export default DemoSelect;