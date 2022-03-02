// @ts-nocheck
import React, { useContext, useState } from 'react';
import { diagramTreeRoot, DiagramTreeNode } from '../model/diagram-tree-model';
import { TreeContext } from './App';
import TreeDiagramNode from './TreeDiagramNode';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';



const TreeDiagram = () => {
  const [update, setUpdate] = useState({});
  return (
    <>
      <div>TreeDiagram</div>
      <TreeView
        aria-label="file system navigator"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
      >
        <TreeDiagramNode modelReferece={diagramTreeRoot} counter='0' ></TreeDiagramNode>
      </TreeView>

    </>
  );
};

export default TreeDiagram;