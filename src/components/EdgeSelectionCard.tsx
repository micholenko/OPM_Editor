/**  
 * @file Card component in the EdgeSelectionModal. Implemented with Ant Design Card component.
 *    Each card has its unique Cytoscape.js instance to render available options.
 * @author Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * @copyright Copyright 2022, OPM Editor
 * @license MIT
 * Made for Bachelor's Thesis - Agile Model Editor
*/

import { Card } from 'antd';
import cytoscape from 'cytoscape';
import React, { useEffect } from 'react';
//@ts-ignore
import { v4 as uuidv4 } from 'uuid';
import { bringConnectedEdge } from '../controller/general';
import { hierarchicalStructuralEdges, MMEdge } from '../model/edge-model';
import { MMNode } from '../model/node-model';
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
    const source = edge.source
    const target = edge.target
    const srcParent = source.parent as MMNode
    const tgtParent = target.parent as MMNode
    const isSourceState = source.type === 'state'
    const isTargetState = target.type === 'state'
    
    //determine ideal positions based on context
    let positions = [];
    if (hierarchicalStructuralEdges.includes(edge.type))
      positions = [{ x: 150, y: 30 }, { x: 210, y: 130 }];
    else if (isSourceState)
      positions = [{ x: 90, y: 60 }, { x: 270, y: 110 }];
    else if (isTargetState)
      positions = [{ x: 90, y: 40 }, { x: 270, y: 100 }];
    else
      positions = [{ x: 90, y: 40 }, { x: 270, y: 110 }];

    const cyCard = cytoscape({
      container: document.getElementById(ID),
      //@ts-ignore
      style: cyStylesheet,
      autolock: true,
      zoom: 0.93,
      userZoomingEnabled: false,
      userPanningEnabled: false,
      autounselectify: false,
      layout: { name: 'preset' },
    });

    if (isSourceState){
      cyCard.add({
        group: 'nodes',
        data: {
          id: srcParent.id,
          type: 'object',
          MMRef: srcParent
        },
        position: positions[0]
      })
    }
    else if (isTargetState) {
      cyCard.add({
        group: 'nodes',
        data: {
          id: tgtParent.id,
          type: 'object',
          MMRef: tgtParent
        },
        position: positions[1]
      })
    }
    cyCard.add([
      {
        group: 'nodes',
        // @ts-ignore
        data: {
          id: source.id,
          type: source.type,
          MMRef: source,
          parent: isSourceState ? srcParent.id :  null
        },
        position: positions[0]
      },
      {
        group: 'nodes',
        // @ts-ignore
        data: {
          id: target.id,
          type: target.type,
          MMRef: target,
          parent: isTargetState ? tgtParent.id : null
        },
        position: positions[1]
      },
      {
        group: 'edges',
        data: {
          id: edge.id,
          label: edge.label,
          type: edge.type,
          source: source.id,
          target: target.id,
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