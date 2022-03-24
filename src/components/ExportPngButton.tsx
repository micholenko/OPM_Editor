import React from 'react';
import { PictureOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { cy } from './DiagramCanvas';
// @ts-ignore
import { saveAs } from "file-saver";

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