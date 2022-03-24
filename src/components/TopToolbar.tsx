import React from 'react';
import './../css/general.css';
import { Typography } from 'antd';
import Propagation from './Propagation';
import { useReducerProps } from './App';
import ExportPngButton from './ExportPngButton';
import ExportJsonButton from './ExportJsonButton';
import ImportJsonButton from './ImportJsonButton';

const TopToolbar: React.FC<useReducerProps> = ({ state, dispatch }) => {
  return (
    <div className='top-toolbar'>
      <Typography.Title className='app-title' level={2}>OPM Editor</Typography.Title>
      <div className='top-toolbar-right'>
        <div className='propagation-wrapper'>
          <Propagation state={state} dispatch={dispatch} />
        </div>
        <ExportPngButton />
        <ExportJsonButton />
        <ImportJsonButton state={state} dispatch={dispatch}/>
      </div>
    </div>
  );
};

export default TopToolbar;