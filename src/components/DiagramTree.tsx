import { Tree } from 'antd';
import { Core, NodeSingular } from 'cytoscape';
import 'antd/dist/antd.css';
import { useContext, useEffect, useRef, useState } from 'react';
import { diagramTreeRoot, DiagramTreeNode } from '../model/diagram-tree-model';
import { TreeContext } from './App';
import { cy } from './DiagramCanvas';
import { edgeArray } from '../model/edge-model';

import { cyAddConnectedNodes } from '../helper-functions/cytoscape-interface';
import { OptionUnstyled } from '@mui/base';
import { MasterModelNode } from '../model/master-model';


interface DataNode {
  title: string;
  key: string;
  modelReference: DiagramTreeNode,
  children?: DataNode[];
}

const DiagramTree = () => {

  const { currentDiagram } = useContext(TreeContext);
  let initTreeData: DataNode =
  {
    title: 'SD',
    key: 'SD',
    modelReference: diagramTreeRoot,
    children: [],
  };

  const constructTreeJson = (data: any, parentNode: DiagramTreeNode, parentIndex: string): DataNode => {
    parentNode.children.forEach((modelNode, index) => {
      index++;
      let currentIndex;
      if (parentIndex === '')
        currentIndex = parentIndex + index;
      else
        currentIndex = parentIndex + '.' + index;
      const title = 'SD' + currentIndex;
      const newNode: any = {
        title: title,
        key: title,
        modelReference: modelNode,
        children: []
      };
      const treeNode = constructTreeJson(newNode, modelNode, currentIndex);
      data.children.push(treeNode);
    });
    return data;
  };
  let treeData = [constructTreeJson(initTreeData, diagramTreeRoot, '')];

  const updateNodesFromMM = (cy: Core) => {
    for (const node of cy.nodes() as any) {
      const MMRef = node.data('MasterModelRef') as MasterModelNode;
      if (MMRef.deleted) {
        node.remove();
        continue;
      }
      node.data({
        label: MMRef.label,
        labelWidth: MMRef.label.length * 8.5
      });
    }
  };


  const onSelect = (selectedKeys: React.Key[], info: any) => {
    if (info.node.selected == true)
      return;

    currentDiagram.current.diagramJson = cy.json();
    cy.elements().remove();

    const modelReference = info.node.modelReference;
    console.log(modelReference.diagramJson);
    cy.json(modelReference.diagramJson);
    //add extra

    if (modelReference === diagramTreeRoot) {
      console.log('root');
      const nodes = modelReference.mainNode.children;
      nodes.forEach((node: MasterModelNode) => {
        cyAddConnectedNodes(cy, node);
      });
    }
    else {
      console.log('not root');
      cyAddConnectedNodes(cy, modelReference.mainNode);
    }
    updateNodesFromMM(cy);
    cy.center();


    currentDiagram.current = modelReference;
  };

  return (
    <Tree
      height={500} //set to scroll
      defaultExpandAll
      defaultExpandParent
      draggable={{ icon: false }}
      showLine={{ showLeafIcon: false }}
      defaultSelectedKeys={['SD']}
      onSelect={onSelect}
      treeData={treeData} />
  );
};

export default DiagramTree;