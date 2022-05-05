/* 
 * Author: Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * Copyright: Copyright 2022, OPM Editor
 * Made for Bachelor's Thesis - Agile Model Editor
 * License: MIT
*/

import { Card } from 'antd';
import cytoscape from 'cytoscape';
import React, { useEffect } from 'react';
//@ts-ignore
import { v4 as uuidv4 } from 'uuid';
import { bringConnectedEdge, createCyEdgeData, cyAddEdge } from '../controller/general';
import { hierarchicalStructuralEdges, MMEdge } from '../model/edge-model';
import { MMNode } from '../model/master-model';
import { cyStylesheet } from '../options/cytoscape-stylesheet';
import { ACTIONS } from './App';
import { cy } from './DiagramCanvas';


interface ModalProps {
  dispatch: Function;
  edge: MMEdge;
  targetNode: MMNode;
};

const EdgeSelectionCard: React.FC<ModalProps> = ({ dispatch, edge, targetNode }) => {
  const ID = uuidv4();

  useEffect(() => {
    console.log(ID);
    let positions = [];
    if (hierarchicalStructuralEdges.includes(edge.type))
      positions = [{ x: 150, y: 30 }, { x: 210, y: 130 }];
    else
      positions = [{ x: 90, y: 40 }, { x: 270, y: 110 }];

    const cyCard = cytoscape({
      container: document.getElementById(ID), // container to render in
      //@ts-ignore
      style: cyStylesheet,
      autolock: true,
      zoom: 0.93,
      userZoomingEnabled: false,
      userPanningEnabled: false,
      autounselectify: false,
      layout: { name: 'preset' },
    });
    cyCard.add([
      {
        group: 'nodes',
        data: {
          id: edge.source.id,
          type: edge.source.type,
          MMRef: edge.source
        },
        position: positions[0]
      },
      {
        group: 'nodes',
        data: {
          id: edge.target.id,
          type: edge.target.type,
          MMRef: edge.target
        },
        position: positions[1]
      },
      {
        group: 'edges',
        data: {
          id: edge.id,
          label: edge.label,
          type: edge.type,
          source: edge.source.id,
          target: edge.target.id,
          MMRef: edge,
        },
      }
    ]);
  });

  return (
    <Card
      hoverable
      bodyStyle={{
        padding: '0px',
        height: '150px',
        marginTop: '10px',
        marginBottom: '5px',
        textAlign: 'left'

      }}
      onClick={() => {
        dispatch({ type: ACTIONS.EDGE_SELECTION, payload: false });
        bringConnectedEdge(cy, edge, targetNode);
      }}>
      <div className='cytoscapeEdgeSelectionCard' id={ID}></div>
    </Card>
  );
};

export default EdgeSelectionCard;