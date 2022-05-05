/* 
 * Author: Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * Copyright: Copyright 2022, OPM Editor
 * Made for Bachelor's Thesis - Agile Model Editor
 * License: MIT
*/

import { List, Modal } from "antd";
import 'antd/dist/antd.css';
import React from 'react';
import { getAllConnectedEdges } from '../controller/general';
import { MMNode } from "../model/master-model";
import { ACTIONS, StateInterface } from './App';
import { cy } from './DiagramCanvas';
import EdgeSelectionCard from './EdgeSelectionCard';


interface ModalProps {
  state: StateInterface;
  dispatch: Function;
};

const EdgeSelectionModal: React.FC<ModalProps> = ({ state, dispatch }) => {
  const cancelModal = () => {
    dispatch({ type: ACTIONS.EDGE_SELECTION, payload: false });
  };
  let connectedEdges;
  if (state.targetNode !== null)
    connectedEdges = getAllConnectedEdges(cy, state.targetNode);

  return (
    <div onContextMenu={(e) => {
      e.preventDefault();
    }}>

      <Modal
        visible={state.showEdgeSelectionModal}
        title="Choose an edge:"
        onCancel={cancelModal}
        footer={null}
        width={400}
      >
        {<List
          grid={{
            gutter: 12,
            column: 1
          }}
          locale={{emptyText: 'No additional edges can be added'}}
          dataSource={connectedEdges}
          renderItem={(edge: any) => (
            <List.Item>
              <EdgeSelectionCard dispatch={dispatch} edge={edge} targetNode={state.targetNode as unknown as MMNode}/>
            </List.Item>
          )}
        />}
      </Modal>
    </div>
  );
};

export default EdgeSelectionModal;