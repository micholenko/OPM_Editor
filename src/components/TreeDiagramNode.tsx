// @ts-nocheck
import React, { useContext, useState } from 'react'
import { cyto } from './DiagramCanvas'
import PropTypes from 'prop-types';
import { diagramTree, diagramTreeNode } from '../model/diagramTreeModel'
import {TreeContext} from './App'


import TreeItem, { useTreeItem } from '@mui/lab/TreeItem';
import { Button, Typography } from '@mui/material';
import clsx from 'clsx';

type Props = {
  modelReferece: diagramTreeNode,
  counter: number
};

const CustomContent = React.forwardRef(function CustomContent(props, ref) {
  const {
    classes,
    className,
    label,
    onClick,
    nodeId,
    icon: iconProp,
    expansionIcon,
    displayIcon,
  } = props;

  const {
    disabled,
    expanded,
    selected,
    focused,
    handleExpansion,
    handleSelection,
    preventSelection,
  } = useTreeItem(nodeId);

  const icon = iconProp || expansionIcon || displayIcon;

  const handleMouseDown = (event) => {
    preventSelection(event);
  };

  const handleExpansionClick = (event) => {
    handleExpansion(event);
  };

  const handleSelectionClick = (event) => {
    handleSelection(event);
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={clsx(className, classes.root, {
        [classes.expanded]: expanded,
        [classes.selected]: selected,
        [classes.focused]: focused,
        [classes.disabled]: disabled,
      })}
      onMouseDown={handleMouseDown}
      ref={ref}
    >
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <div onClick={handleExpansionClick} className={classes.iconContainer}>
        {icon}
      </div>
      
      <Button onClick={onClick}>{label}</Button>
    </div>
  );
});


const CustomTreeItem = (props) => (
  <TreeItem ContentComponent={CustomContent} {...props} />
);

const TreeDiagramNode: React.FC<Props> = ({ modelReferece, counter}) => {
  const { updateTree, setUpdateTree, currentDiagram, setCurrentDiagram} = useContext(TreeContext);
  return (
    <CustomTreeItem nodeId={counter} label={'diagram' + counter} onClick={() => { 
        currentDiagram.diagramJson = cyto.json()
        cyto.elements().remove();
        cyto.json(modelReferece.diagramJson)
        setCurrentDiagram(modelReferece) }}
        >
      {modelReferece.children?.map((child) => <TreeDiagramNode modelReferece={child} counter={(parseInt(counter)+1).toString()}></TreeDiagramNode>)}
    </CustomTreeItem>

  )
}

export default TreeDiagramNode