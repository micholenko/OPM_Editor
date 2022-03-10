import { Tree } from 'antd';
import 'antd/dist/antd.css';
import { useContext, useEffect, useRef, useState } from 'react';
import { diagramTreeRoot, DiagramTreeNode } from '../model/diagram-tree-model';
import { TreeContext } from './App';
import { cy } from './DiagramCanvas';
import { edgeArray } from '../model/edge-model';


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

  const onSelect = (selectedKeys: React.Key[], info: any) => {
    if (info.node.selected == true)
      return;
    const modelReference = info.node.modelReference;
    currentDiagram.current.diagramJson = cy.json();
    cy.elements().remove();
    cy.json(modelReference.diagramJson);
    //add extra

    const ingoingEdges = edgeArray.findIngoingEdges(modelReference.mainNode);
    const outgoingEdges = edgeArray.findOutgoingEdges(modelReference.mainNode);
    ingoingEdges.map((edge) => {
      const node = edge.source;
      cy.add(
        {
          group: 'nodes',
          data: {
            'id': node.id,
            'MasterModelRef': node,
            'label': node.label,
            'type': node.type
          },
        }
      );
      cy.add(
        {
          group: 'edges',
          data: {
            'source': edge.source.id,
            'target': edge.target.id,
            'MasterModelRef': edge,
            'type': edge.type
          },
        }
      );
    });

    outgoingEdges.map((edge) => {
      const node = edge.target;
      cy.add(
        {
          group: 'nodes',
          data: {
            'id': node.id,
            'MasterModelRef': node,
            'label': node.label,
            'type': node.type
          },
        }
      );
      cy.add(
        {
          group: 'edges',
          data: {
            'source': edge.source.id,
            'target': edge.target.id,
            'MasterModelRef': edge,
            'type': edge.type
          }
        }
      );
    });


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