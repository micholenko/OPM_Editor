/* 
 * Author: Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * Copyright: Copyright 2022, OPM Editor
 * Made for Bachelor's Thesis - Agile Model Editor
 * License: MIT
*/

import { UploadOutlined } from '@ant-design/icons';
import { Button, Tooltip, Upload } from 'antd';
import React from 'react';
import { importJson } from '../controller/import-export';
import { useReducerProps } from './App';


const dummyRequest = ({ file, onSuccess }: any) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
};

const ImportJsonButton: React.FC<useReducerProps> = ({ state, dispatch }) => {
  const onChange = (evt: any) => {
    if (evt.file.status === 'done') {
      const file = evt.file.originFileObj;
      const reader = new FileReader();
      reader.onload = function () {
        console.log(reader.result)
        importJson(reader.result, dispatch)
      };
      reader.readAsText(file);
    }
  };
  return (
    <Upload customRequest={dummyRequest} showUploadList={false} onChange={onChange}>
      <Tooltip placement="bottomLeft" title={'Import json'}>
        <Button className='export-button' icon={<UploadOutlined />} size='large' />
      </Tooltip>
    </Upload>
  );
};

export default ImportJsonButton;