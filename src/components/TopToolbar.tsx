/* 
 * Author: Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * Copyright: Copyright 2022, OPM Editor
 * Made for Bachelor's Thesis - Agile Model Editor
 * License: MIT
*/

import { Typography } from 'antd';
import React from 'react';
import './../css/general.css';
import { useReducerProps } from './App';
import DemoSelect from './DemoSelect';
import ExportJsonButton from './ExportJsonButton';
import ExportPngButton from './ExportPngButton';
import ImportJsonButton from './ImportJsonButton';
import Propagation from './Propagation';


const TopToolbar: React.FC<useReducerProps> = ({ state, dispatch }) => {
  return (
    <div className='top-toolbar'>
      <Typography.Title className='app-title' level={2}>OPM Editor</Typography.Title>
      <div className='top-toolbar-right'>
        <div className='propagation-wrapper'>
          <Propagation state={state} dispatch={dispatch} />
        </div>
        <DemoSelect state={state} dispatch={dispatch}/>
        <ExportPngButton />
        <ExportJsonButton />
        <ImportJsonButton state={state} dispatch={dispatch}/>
      </div>
    </div>
  );
};

export default TopToolbar;