import { Tree } from 'antd';
import { Core  } from 'cytoscape';
import 'antd/dist/antd.css';
import { useState } from 'react';
import { diagramTreeRoot, DiagramTreeNode } from '../model/diagram-tree-model';
import { ACTIONS, StateInterface } from './App';
import { cy } from './DiagramCanvas';

import { cyAddConnectedNodes } from '../helper-functions/cytoscape-interface';
import { MasterModelNode } from '../model/master-model';

import '../css/general.css'


interface DataNode {
  title: string;
  key: string;
  modelReference: DiagramTreeNode,
  children?: DataNode[];
}

interface Props {
  state: StateInterface;
  dispatch: Function;
};

const DiagramTree: React.FC<Props> = ({ state, dispatch }) => {
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>(['SD'])

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
    
    const currentDiagram = state.currentDiagram
    if (info.node.selected !== true) {
      setSelectedKeys(selectedKeys)
    }
    else
      return;

    currentDiagram.diagramJson = cy.json();
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

    dispatch({ type: ACTIONS.CHANGE_DIAGRAM, payload: modelReference });
  };

  return (
    <Tree
      className='diagram-tree'
      style={{marginTop: '5px', height: '100%'}}
      height={500} //set to scroll
      defaultExpandAll
      defaultExpandParent
      draggable={{ icon: false }}
      showLine={{ showLeafIcon: false }}
      defaultSelectedKeys={['SD']}
      selectedKeys={selectedKeys  }
      onSelect={onSelect}
      treeData={treeData} />
  );
};

export default DiagramTree;