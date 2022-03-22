import { Tree } from 'antd';
import { Core } from 'cytoscape';
import 'antd/dist/antd.css';
import { useEffect, useState } from 'react';
import { diagramTreeRoot, DiagramTreeNode } from '../model/diagram-tree-model';
import { ACTIONS, useReducerProps } from './App';
import { cy } from './DiagramCanvas';

import { cyAddConnectedNodes } from '../helper-functions/cytoscape-interface';
import { masterModelRoot, MMNode } from '../model/master-model';

import '../css/general.css';
import { MMEdge } from '../model/edge-model';


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

const getEdgeLabel = (MMRef: MMEdge): string => {
  if (MMRef.originalEdge)
    return MMRef.originalEdge.label;
  else
    return MMRef.label;
};

const updateNodesFromMM = (cy: Core, mainNode: MMNode) => {

  for (const node of cy.nodes() as any) {
    const MMRef = node.data('MMRef') as MMNode;
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
  for (const edge of cy.edges()) {
    const MMRef = edge.data('MMRef');
    if (MMRef.deleted ||
      edge.data('source') != MMRef.source.id ||
      edge.data('target') != MMRef.target.id || //edge.source()
      MMRef.originalEdge?.deleted) {

      const prevTargetId = edge.target().data('MMRef').id;
      const prevSourceId = edge.source().data('MMRef').id;
      
      edge.remove();
      if (mainNode === masterModelRoot) {
        if (prevSourceId !== MMRef.source.id && MMRef.source.diagram !== null) {
          edge.source().remove();
        }
        else if (prevTargetId !== MMRef.target.id && MMRef.target.diagram !== null) {
          edge.target().remove();
        }
      }
      else {
        if (mainNode.id === prevSourceId) {
          edge.target().remove();
        }
        else if (mainNode.id === prevTargetId) {
          edge.source().remove();
        }
      }
    }
    else {
      edge.data({
        label: getEdgeLabel(MMRef),
      });
    }
  }

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
    const currentDiagram = state.currentDiagram;
    if (info.node.selected === true)
      return;

    currentDiagram.diagramJson = cy.json();
    cy.elements().remove();

    const modelReference = info.node.modelReference;
    cy.json(modelReference.diagramJson);
    //add extra

    updateNodesFromMM(cy, modelReference.mainNode);
    if (modelReference === diagramTreeRoot) {
      const nodes = modelReference.mainNode.children;
      nodes.forEach((node: MMNode) => {
        cyAddConnectedNodes(cy, node);
      });
    }
    else {
      cyAddConnectedNodes(cy, modelReference.mainNode);
    }

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