import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Tooltip, Upload } from 'antd';
import { parse, reviver } from 'telejson';
import { ACTIONS, useReducerProps } from './App';
import { DiagramTreeNode, importDiagramTreeRoot } from '../model/diagram-tree-model';
import { EdgeArray, importEdgeArrays, MMEdge } from '../model/edge-model';
import { importMMRoot, MMNode, MMRoot } from '../model/master-model';
import { cy } from './DiagramCanvas';
import { eleCounter, ElementCounter } from '../helper-functions/elementCounter';

const setMMNodePrototype = (node: MMNode) => {
  Object.setPrototypeOf(node, MMNode.prototype);
  for (const child of node.children) {
    setMMNodePrototype(child);
  }
};

const setDiagramTreeNodePrototype = (node: MMNode) => {
  Object.setPrototypeOf(node, DiagramTreeNode.prototype);
  for (const child of node.children) {
    setDiagramTreeNodePrototype(child);
  }
};

const setPrototypes = (data: any) => {
  Object.setPrototypeOf(data['edgeArray'], EdgeArray.prototype);
  Object.setPrototypeOf(data['derivedEdgeArray'], EdgeArray.prototype);

  Object.setPrototypeOf(data['masterModelRoot'], MMRoot.prototype);
  Object.setPrototypeOf(data['eleCounter'], ElementCounter.prototype);

  for (const edge of data['edgeArray'].edges) {
    Object.setPrototypeOf(edge, MMEdge.prototype);
  }

  for (const edge of data['derivedEdgeArray'].edges) {
    Object.setPrototypeOf(edge, MMEdge.prototype);
  }

  for (const node of data['masterModelRoot'].children) {
    setMMNodePrototype(node);
  }
  setDiagramTreeNodePrototype(data['diagramTreeRoot']);
};

const setImportedModel = (data: any) => {
  importMMRoot(data['masterModelRoot']);
  importDiagramTreeRoot(data['diagramTreeRoot']);
  importEdgeArrays(data['edgeArray'], data['derivedEdgeArray']);
  eleCounter.value = data['eleCounter'];
};

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
        //const importedData = parse(reader.result as string);
        // @ts-ignore
        const importedData = JSON.parse(reader.result as string, reviver({ allowClass: true, allowFunction: false }));
        setPrototypes(importedData);

        setImportedModel(importedData);
        cy.elements().remove();

        const diagramRoot = importedData['diagramTreeRoot'];
        cy.json(diagramRoot.diagramJson);
        dispatch({ type: ACTIONS.CHANGE_DIAGRAM, payload: diagramRoot });
        dispatch({ type: ACTIONS.UPDATE_TREE });
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