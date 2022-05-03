
import React from 'react';

import { Modal, List, Card, Image } from "antd";
import 'antd/dist/antd.css';

import { EdgeType } from '../model/edge-model';
import { ACTIONS, StateInterface } from './App';

import { edgeCreate, edgeCancel } from '../controller/edge';

import consumptionResultImg from './../data/edge-type-images/consumption-result.svg';
import taggedImg from './../data/edge-type-images/tagged.svg';
import effectImg from './../data/edge-type-images/effect.svg';
import instrumentImg from './../data/edge-type-images/instrument.svg';
import agentImg from './../data/edge-type-images/agent.svg';
import aggregationImg from './../data/edge-type-images/aggregation.svg';
import exhibitionImg from './../data/edge-type-images/exhibition.svg';
import generalizationImg from './../data/edge-type-images/generalization.svg';
import classificationImg from './../data/edge-type-images/classification.svg';



interface ModalProps {
  state: StateInterface;
  dispatch: Function;
};

interface EdgeData {
  name: EdgeType;
  img: string;
};

const EdgeSelectionModal: React.FC<ModalProps> = ({ state, dispatch }) => {
  const imgSet = [
    consumptionResultImg,
    taggedImg,
    effectImg,
    instrumentImg,
    agentImg,
    aggregationImg,
    exhibitionImg,
    generalizationImg,
    classificationImg,
  ];
  const EdgeTypeArray = Object.values(EdgeType);

  const edgeData = EdgeTypeArray.map((type: EdgeType, index: number) => {
    return {
      'name': type,
      'img': imgSet[index]
    };
  });

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
        title="Choose an edge type:"
        onCancel={cancelModal}
        footer={null}
        width={600}
      >
        <List
          grid={{
            gutter: 12,
            column: 3
          }}
          dataSource={edgeData as any}
          renderItem={(edge: EdgeData) => (
            <List.Item>
              <Card
                headStyle={{ fontSize: 10, paddingLeft: 15 }}
                hoverable
                title={edge.name}
                bodyStyle={{
                  padding: '0px',
                  height: '50px',
                  marginTop: '10px',
                  marginBottom: '5px',
                  textAlign: 'center'

                }}
                onClick={() => {
                  edgeCreate(edge.name, state);
                  dispatch({ type: ACTIONS.EDGE_SELECTION, payload: false });
                }}>
                <Image
                  src={edge.img}
                  preview={false}
                  height={50}
                />
              </Card>
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default EdgeSelectionModal;
