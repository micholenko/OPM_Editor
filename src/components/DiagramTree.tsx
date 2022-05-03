/* 
 * Author: Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * Copyright: Copyright 2022, OPM Editor
 * Made for Bachelor's Thesis - Agile Model Editor
 * License: MIT
*/

import { Tree } from 'antd';
import 'antd/dist/antd.css';
import { useEffect, useState } from 'react';
import { switchDiagrams, updateFromMasterModel } from '../controller/diagram-switching';
import '../css/general.css';
import { DiagramTreeNode, diagramTreeRoot } from '../model/diagram-tree-model';
import { ACTIONS, useReducerProps } from './App';


interface DataNode {
  title: string;
  key: string;
  modelReference: DiagramTreeNode,
  children?: DataNode[];
}

const constructTreeJson = (data: any, parentNode: DiagramTreeNode): DataNode => {

  parentNode.children.forEach((modelNode) => {
    const newNode: any = {
      title: modelNode.label,
      key: modelNode.label,
      modelReference: modelNode,
      children: []
    };
    const treeNode = constructTreeJson(newNode, modelNode);
    data.children.push(treeNode);
  });
  return data;
};



const DiagramTree: React.FC<useReducerProps> = ({ state, dispatch }) => {
  let initTreeData: DataNode =
  {
    title: 'SD',
    key: 'SD',
    modelReference: diagramTreeRoot,
    children: [],
  };
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['SD']);
  const [treeData, setTreedata] = useState([initTreeData]);

  useEffect(() => {
    setTreedata([constructTreeJson(initTreeData, diagramTreeRoot)]);
    if (state.lastCreatedDiagram) {
      setExpandedKeys((prevState) => {
        const newKey = state.lastCreatedDiagram.label;
        if (!expandedKeys.includes(newKey))
          return [...prevState, newKey];
        else
          return [...prevState];
      });
    }
  }, [state.lastCreatedDiagram]);

  useEffect(() => {
    setTreedata([constructTreeJson(initTreeData, diagramTreeRoot)]);
  }, [state.timestamp]);


  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue);
  };


  const onSelect = (selectedKeys: React.Key[], info: any) => {
    if (info.node.selected === true)
      return;

    const nextDiagram = info.node.modelReference as DiagramTreeNode 

    switchDiagrams(state.currentDiagram, nextDiagram)
    updateFromMasterModel(nextDiagram)

    dispatch({ type: ACTIONS.CHANGE_DIAGRAM, payload: nextDiagram });
  };

  return (
    <Tree
      className='diagram-tree'
      style={{ marginTop: '5px', height: '100%' }}
      height={500} //set to scroll
      /* draggable={{ icon: false }} */
      showLine={{ showLeafIcon: false }}
      selectedKeys={[state.currentDiagram.label]}
      onSelect={onSelect}
      expandedKeys={expandedKeys}
      onExpand={onExpand}
      treeData={treeData} />
  );
};

export default DiagramTree;