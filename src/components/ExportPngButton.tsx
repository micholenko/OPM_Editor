/* 
 * Author: Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * Copyright: Copyright 2022, OPM Editor
 * Made for Bachelor's Thesis - Agile Model Editor
 * License: MIT
*/

import { PictureOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
// @ts-ignore
import { saveAs } from "file-saver";
import { cy } from './DiagramCanvas';


const ExportPngButton = () => {
  const onClick = () => {
    saveAs(cy.png({ full: true }), "graph.png");
  };
  return (
    <Tooltip placement="bottom" title={'Export to png'}>
      <Button className='export-button' icon={<PictureOutlined />} onClick={onClick} size='large' />
    </Tooltip>
  );
};

export default ExportPngButton;