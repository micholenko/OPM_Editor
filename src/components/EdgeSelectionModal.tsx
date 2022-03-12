// @ts-nocheck

import React from 'react';

import { Modal, List, Card } from "antd";
import 'antd/dist/antd.css';

import edgeTypes from '../options/edge-types.json';
import { ACTIONS, StateInterface } from './App';

  interface ModalProps {
  state: StateInterface;
  dispatch: Function;
};

const EdgeSelectionModal: React.FC<ModalProps> = ({ state, dispatch }) => {
  const cancelModal = () => {
    state.createdEdge.remove();
    state.createdEdge.data({ 'MasterModelRef': null });
    dispatch({ type: ACTIONS.CHANGE_CREATED_EDGE, payload: null });
  };
  return (
    <div onContextMenu={(e) => {
      e.preventDefault();
    }}>

      <Modal
        visible={state.createdEdge}
        title="Choose edge type"/*  */
        onCancel={cancelModal}
        footer={null}
      >
        <List
          grid={{
            gutter: 12,
            column: 3
          }}
          dataSource={edgeTypes}
          renderItem={item => (
            <List.Item>
              <Card
                hoverable
                title={item}
                onClick={() => {
                  state.createdEdge.data({ type: item });
                  state.createdEdge.data({ label: '' });
                  state.createdEdge.data('MasterModelRef').type = item;
                  dispatch({ type: ACTIONS.CHANGE_CREATED_EDGE, payload: null });
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
