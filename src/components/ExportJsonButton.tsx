import React from 'react';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { edgeArray, derivedEdgeArray } from '../model/edge-model';
import { masterModelRoot } from '../model/master-model';
import { diagramTreeRoot } from '../model/diagram-tree-model';
// @ts-ignore

import { stringify, replacer } from 'telejson';
// @ts-ignore
import { saveAs } from "file-saver";
import { eleCounter } from '../helper-functions/elementCounter';


const ExportJsonButton = () => {
  const onClick = () => {
    const data = {
      masterModelRoot: masterModelRoot,
      edgeArray: edgeArray,
      derivedEdgeArray: derivedEdgeArray,
      diagramTreeRoot: diagramTreeRoot,
      eleCounter: eleCounter.value,
    };
    console.log(data)

    

    // const stringified = stringify(data);
    //@ts-ignore
    const stringified = JSON.stringify(data, replacer({allowClass:true, allowFunction:false}))
    console.log(stringified)
    let blob = new Blob([stringified], {
      type: "text/plain;charset=utf-8"
    });
    saveAs(blob, "graph.json");
  };
  return (
    <Tooltip placement="bottom" title={'Export to json'}>
      <Button className='export-button' icon={<DownloadOutlined />} onClick={onClick} size='large' />
    </Tooltip>
  );
};

export default ExportJsonButton;