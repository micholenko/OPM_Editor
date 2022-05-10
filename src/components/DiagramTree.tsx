/**  
 * @file Diagram tree located in the left sidebar. Implemented with the use of Ant Design Tree component. 
 * @author Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * @copyright Copyright 2022, OPM Editor
 * @license MIT
 * Made for Bachelor's Thesis - Agile Model Editor
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

/**
 * Recursive function that transforms the diagram tree model (class instaces) to
 * a regular json that is required by the component
 */
const constructTreeJson = (jsonNode: any, parentModelNode: DiagramTreeNode): DataNode => {
  parentModelNode.children.forEach((modelNode) => {
    const newJsonNode: any = {
      title: modelNode.label,
      key: modelNode.label,
      modelReference: modelNode,
      children: []
    };
    const child = constructTreeJson(newJsonNode, modelNode);
    jsonNode.children.push(child);
  });
  return jsonNode;
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

  /**
   * Actions to be done on diagram selection in the diagram tree.
   * Diagrams have to be switched and the selected diagram is updated
   * @param info - Object with the selected node
   */
  const onSelect = (selectedKeys: React.Key[], info: any) => {
    if (info.node.selected === true)
      return;

    const nextDiagram = info.node.modelReference as DiagramTreeNode 

    switchDiagrams(state.currentDiagram, nextDiagram)
    updateFromMasterModel()

    dispatch({ type: ACTIONS.CHANGE_DIAGRAM, payload: nextDiagram });
  };

  return (
    <Tree
      className='diagram-tree'
      style={{ marginTop: '5px', height: '100%' }}
      height={500}
      showLine={{ showLeafIcon: false }}
      selectedKeys={[state.currentDiagram.label]}
      onSelect={onSelect}
      expandedKeys={expandedKeys}
      onExpand={onExpand}
      treeData={treeData} />
  );
};

export default DiagramTree;