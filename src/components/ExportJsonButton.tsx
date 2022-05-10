/**  
 * @file Export to JSON button. 
 * @author Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * @copyright Copyright 2022, OPM Editor
 * @license MIT
 * Made for Bachelor's Thesis - Agile Model Editor
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