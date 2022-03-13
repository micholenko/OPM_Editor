
import React from 'react';

import { Modal, List, Card } from "antd";
import 'antd/dist/antd.css';

import edgeTypes from '../options/edge-types.json';
import { edgeType } from '../model/edge-model';
import { ACTIONS, StateInterface } from './App';

import { edgeCreate } from '../helper-functions/edge-interface';

import {cy} from './DiagramCanvas'

  interface ModalProps {
  state: StateInterface;
  dispatch: Function;
};

const EdgeSelectionModal: React.FC<ModalProps> = ({ state, dispatch }) => {
  const cancelModal = () => {
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
          dataSource={edgeTypes as edgeType[]}
          renderItem={(edgeType: edgeType)=> (
            <List.Item>
              <Card
                hoverable
                title={edgeType}
                onClick={() => {
                  edgeCreate(cy, edgeType);
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
