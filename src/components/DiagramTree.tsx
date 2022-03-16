import { Tree } from 'antd';
import { Core } from 'cytoscape';
import 'antd/dist/antd.css';
import { useEffect, useState } from 'react';
import { diagramTreeRoot, DiagramTreeNode } from '../model/diagram-tree-model';
import { ACTIONS, StateInterface } from './App';
import { cy } from './DiagramCanvas';

import { cyAddConnectedNodes } from '../helper-functions/cytoscape-interface';
import { MasterModelNode } from '../model/master-model';

import '../css/general.css';


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
  
  //remove unlinked
  // @ts-ignore
  for (const edge of cy.edges())
  {
    const MMRef = edge.data('MasterModelRef')
    if (MMRef.deleted || 
        edge.data('source') != MMRef.source.id  ||
        edge.data('target') != MMRef.target.id)
    {
      edge.remove()
    }
    else
    {
      edge.data({
        label: MMRef.label,
      })
    }
  }

};

const DiagramTree: React.FC<Props> = ({ state, dispatch }) => {
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

  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue);
  };

  const onSelect = (selectedKeys: React.Key[], info: any) => {
    const currentDiagram = state.currentDiagram;
    if (info.node.selected === true)
      return;

    currentDiagram.diagramJson = cy.json();
    cy.elements().remove();

    const modelReference = info.node.modelReference;
    console.log(modelReference.diagramJson);
    cy.json(modelReference.diagramJson);
    //add extra

    if (modelReference === diagramTreeRoot) {
      const nodes = modelReference.mainNode.children;
      nodes.forEach((node: MasterModelNode) => {
        cyAddConnectedNodes(cy, node);
      });
    }
    else {
      cyAddConnectedNodes(cy, modelReference.mainNode);
    }

    updateNodesFromMM(cy);
    //cy.center();

    dispatch({ type: ACTIONS.CHANGE_DIAGRAM, payload: modelReference });
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