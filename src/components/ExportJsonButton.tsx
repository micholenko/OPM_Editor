import React from 'react';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { exportJson } from '../helper-functions/import-export-interface';


const ExportJsonButton = () => {
  const onClick = () => {
    exportJson()
  };
  return (
    <Tooltip placement="bottom" title={'Export to json'}>
      <Button className='export-button' icon={<DownloadOutlined />} onClick={onClick} size='large' />
    </Tooltip>
  );
};

export default ExportJsonButton;