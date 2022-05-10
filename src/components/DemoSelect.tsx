/**  
 * @file Demo selection component located in the top toolbar. Implemented with the use of Ant Design Selection component. 
 * @author Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * @copyright Copyright 2022, OPM Editor
 * @license MIT
 * Made for Bachelor's Thesis - Agile Model Editor
*/

import { Select } from 'antd';
import React from 'react';
import { importJson } from '../controller/import-export';
import breadBakingDemo from '../demos/bread-baking.json';
import edgeTypesDemo from '../demos/edge-types.json';
import thingsDemo from '../demos/things.json';
import { useReducerProps } from './App';
const { Option } = Select;


const demoMapping = {
  'breadBaking': breadBakingDemo,
  'edgeTypes': edgeTypesDemo,
  'things': thingsDemo
}

const DemoSelect: React.FC<useReducerProps> = ({ state, dispatch }) => {
  const onChange = (demo:string ) => {
    console.log(demo)
    //@ts-ignore
    let jsonString = demoMapping[demo] as string
    jsonString = JSON.stringify(jsonString)
    importJson(jsonString, dispatch);
  };
  return (
    <Select className='demo-selection' placeholder="Select demo"  onChange={onChange}>
      <Option value="breadBaking">Bread Baking</Option>
      <Option value="edgeTypes">Edge Types</Option>
      <Option value="things">Things</Option>
    </Select>
  );
};

export default DemoSelect;