/* 
 * Author: Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * Copyright: Copyright 2022, OPM Editor
 * Made for Bachelor's Thesis - Agile Model Editor
 * License: MIT
*/

import { Select } from 'antd';
import React from 'react';
import { importJson } from '../controller/import-export';
import simpleDemo from '../demos/simple.json';
import { useReducerProps } from './App';


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