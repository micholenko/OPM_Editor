/* 
 * Author: Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * Copyright: Copyright 2022, OPM Editor
 * Made for Bachelor's Thesis - Agile Model Editor
 * License: MIT
*/

import { DownloadOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { exportJson } from '../controller/import-export';


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