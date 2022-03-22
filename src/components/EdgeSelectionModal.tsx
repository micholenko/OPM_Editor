
import React from 'react';

import { Modal, List, Card } from "antd";
import 'antd/dist/antd.css';

import edgeTypes from '../options/edge-types.json';
import { EdgeType } from '../model/edge-model';
import { ACTIONS, StateInterface } from './App';

import { edgeCreate, edgeCancel } from '../helper-functions/edge-interface';

import {cy} from './DiagramCanvas'

  interface ModalProps {
  state: StateInterface;
  dispatch: Function;
};

const EdgeSelectionModal: React.FC<ModalProps> = ({ state, dispatch }) => {
  const cancelModal = () => {
    edgeCancel();
    dispatch({ type: ACTIONS.EDGE_SELECTION, payload: false });
  };
  return (
    <div onContextMenu={(e) => {
      e.preventDefault();
    }}>

      <Modal
        visible={state.showEdgeSelectonModal}
        title="Choose edge type"
        onCancel={cancelModal}
        footer={null}
      >
        <List
          grid={{
            gutter: 12,
            column: 3
          }}
          dataSource={edgeTypes as EdgeType[]}
          renderItem={(EdgeType: EdgeType)=> (
            <List.Item>
              <Card
                hoverable
                title={EdgeType}
                onClick={() => {
                  edgeCreate(EdgeType);
                  dispatch({ type: ACTIONS.EDGE_SELECTION, payload: false });
                }}>
                  picture
              </Card>
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default EdgeSelectionModal;
