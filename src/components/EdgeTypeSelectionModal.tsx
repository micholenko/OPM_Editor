/* 
 * Author: Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * Copyright: Copyright 2022, OPM Editor
 * Made for Bachelor's Thesis - Agile Model Editor
 * License: MIT
*/

import { Card, Image, List, Modal } from "antd";
import 'antd/dist/antd.css';
import React from 'react';
import { edgeCancel, edgeCreate } from '../controller/edge';
import { EdgeType } from '../model/edge-model';
import agentImg from './../data/edge-type-images/agent.svg';
import aggregationImg from './../data/edge-type-images/aggregation.svg';
import classificationImg from './../data/edge-type-images/classification.svg';
import consumptionResultImg from './../data/edge-type-images/consumption-result.svg';
import effectImg from './../data/edge-type-images/effect.svg';
import exhibitionImg from './../data/edge-type-images/exhibition.svg';
import generalizationImg from './../data/edge-type-images/generalization.svg';
import instrumentImg from './../data/edge-type-images/instrument.svg';
import taggedImg from './../data/edge-type-images/tagged.svg';
import { ACTIONS, StateInterface } from './App';


interface ModalProps {
  state: StateInterface;
  dispatch: Function;
};

interface EdgeData {
  name: EdgeType;
  img: string;
};

const EdgeTypeSelectionModal: React.FC<ModalProps> = ({ state, dispatch }) => {
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
    dispatch({ type: ACTIONS.EDGE_TYPE_SELECTION, payload: false });
  };
  return (
    <div onContextMenu={(e) => {
      e.preventDefault();
    }}>

      <Modal
        visible={state.showEdgeTypeSelectonModal}
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
                  dispatch({ type: ACTIONS.EDGE_TYPE_SELECTION, payload: false });
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

export default EdgeTypeSelectionModal;
