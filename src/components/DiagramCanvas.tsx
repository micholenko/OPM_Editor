// @ts-nocheck
import React, { useContext, useEffect, useRef, useState } from 'react';
import cytoscape, { CoreGraphManipulation, CoreGraphManipulationExt } from 'cytoscape';
import edgehandles from 'cytoscape-edgehandles';
import popper from 'cytoscape-popper';
import coseBilkent from 'cytoscape-cose-bilkent';

import { diagramTreeRoot, DiagramTreeNode } from '../model/diagram-tree-model';
import { edgeArray, MMEdge, derivedEdgeArray } from '../model/edge-model';

import { ehDefaults } from '../options/cytoscape-edge-handles-defaults';
import { eeDefaults } from '../options/cytoscape-edge-editing-defaults';

import { cyStylesheet } from '../options/cytoscape-stylesheet';
import { cyAddNodeFromContextMenu, cyAddInzoomedNodes, cyAddConnectedNodes } from '../helper-functions/cytoscape-interface';
import { nodeLabelEditingPopup, edgeLabelEditingPopup } from '../helper-functions/tippy-elements';
import { edgeCheckValidTargets, edgeDragOut, edgeDragOver, edgeStartDrawing, edgeStopDrawing } from '../helper-functions/edge-interface';

import 'cytoscape-context-menus/cytoscape-context-menus.css';
import '../css/general.css';

import { ACTIONS, useReducerProps, PropagationEnum } from './App';
import { json } from 'stream/consumers';

import { Essence, Affiliation } from '../enums/node-property-enums';

var $ = require('jquery');
var konva = require('konva');
const contextMenus = require('cytoscape-context-menus');
var edgeEditing = require('cytoscape-edge-editing');
const nodeEditing = require('cytoscape-node-editing');

window.$ = $;
contextMenus(cytoscape, $);
edgeEditing(cytoscape, $, konva);
nodeEditing(cytoscape, $, konva);

cytoscape.use(edgehandles);
cytoscape.use(popper);
cytoscape.use(coseBilkent);

let cy: Core;

var defaultOptions = {
  name: "cose-bilkent",
  // other options
  fit: false,
  padding: 250,
  nodeDimensionsIncludeLabels: true,
  idealEdgeLength: 150,
  edgeElasticity: 0.1,
  nodeRepulsion: 8500
};

const DiagramCanvas: React.FC<useReducerProps> = ({ state, dispatch }) => {
  const currentDiagram = useRef();
  currentDiagram.current = state.currentDiagram;

  const propagation = useRef();
  propagation.current = state.propagation;

  const registerEdgeEventHandlers = (cy: Core) => {

    let eh = cy.edgehandles(ehDefaults);

    cy.on('cxttapstart', 'node', (evt: Event) => {
      edgeStartDrawing(eh, evt);
    });

    cy.on('cxttapend', 'node', (evt: Event) => {
      edgeStopDrawing(eh);
    });

    cy.on('cxtdragover', 'node', (evt: Event) => {
      edgeDragOver(evt);

    });
    cy.on('cxtdragout', 'node', (evt: Event) => {
      edgeDragOut(evt);
    });

    cy.on('ehstop', (evt: Event,) => {
      const callback = () => dispatch({ type: ACTIONS.EDGE_SELECTION, payload: true });
      edgeCheckValidTargets(callback);
    });
  };

  const registerPopperHandlers = (cy: Core) => {
    nodeLabelEditingPopup(cy);
    edgeLabelEditingPopup(cy);
  };

  const registerContextMenu = (cy: Core) => {
    cy.contextMenus({
      menuItems: [
        {
          id: 'remove',
          content: 'remove',
          tooltipText: 'remove',
          selector: 'node, edge',
          onClickFunction: function (event) {
            const target = event.target;
            const elemMMRef = target.data('MMRef'); //to function set deleted and null reference
            if (target.isNode()) {
              elemMMRef.deleted = true;
              target.data({ 'MMRef': null });
              for (const connectedEdge of target.connectedEdges()) {
                const edgeMMRef = connectedEdge.data('MMRef');

                elemMMRef.deleted = true;
                edgeArray.removeEdge(edgeMMRef);
                if (edgeMMRef.originalEdge !== null) {
                  edgeArray.removeEdge(elemMMRef.originalEdge);
                  edgeMMRef.originalEdge.deleted = true;
                }
                derivedEdgeArray.removeEdgesById(edgeMMRef.id);
                connectedEdge.data({ 'MMRef': null });
              }
            }
            else if (target.isEdge()) {
              elemMMRef.deleted = true;
              edgeArray.removeEdge(elemMMRef);
              if (elemMMRef.originalEdge !== null) {
                edgeArray.removeEdge(elemMMRef.originalEdge);
                elemMMRef.originalEdge.deleted = true;
              }
              derivedEdgeArray.removeEdgesById(elemMMRef.id);
              target.data({ 'MMRef': null });
            }
            target.remove();
          },
          hasTrailingDivider: true
        },
        {
          id: 'in-zoom',
          content: 'in-zoom',
          tooltipText: 'in-zoom',
          selector: 'node[type != "state"]',
          onClickFunction: function (event) {
            var target = event.target;
            let nextDiagram;
            const MMReference = target.data('MMRef');
            if (nextDiagram = MMReference.diagram) { //already inzoomed
              currentDiagram.current.diagramJson = cy.json();
              cy.elements().remove();
              cy.json(nextDiagram.diagramJson);
              dispatch({ type: ACTIONS.CHANGE_DIAGRAM, payload: nextDiagram });
              return;
            }

            currentDiagram.current.diagramJson = cy.json();
            cy.elements().remove();
            nextDiagram = new DiagramTreeNode('', MMReference); //change counter, remove?
            MMReference.diagram = nextDiagram;
            currentDiagram.current.addChild(nextDiagram);

            cyAddInzoomedNodes(cy, event);

            if (propagation.current !== PropagationEnum.None)
              cyAddConnectedNodes(cy, MMReference);

            let layout = cy.layout(defaultOptions);
            layout.run();

            cy.pan({ x: 500, y: 250 });
            cy.zoom(1);

            dispatch({ type: ACTIONS.INZOOM_DIAGRAM, payload: nextDiagram });
          },
          hasTrailingDivider: true
        },
        {
          id: 'add-state',
          content: 'add state',
          tooltipText: 'add state',
          coreAsWell: false,
          selector: 'node[type = "object"]',
          onClickFunction: function (event) {
            cyAddNodeFromContextMenu(cy, event, 'state');
          },
        },
        {
          id: 'add-object',
          content: 'add object',
          tooltipText: 'add object',
          coreAsWell: true,
          selector: 'node[type != "state"]',
          onClickFunction: function (event) {
            cyAddNodeFromContextMenu(cy, event, 'object');
          }
        },
        {
          id: 'add-process',
          content: 'add process',
          tooltipText: 'add process',
          coreAsWell: true,
          selector: 'node[type != "state"]',
          onClickFunction: function (event) {
            cyAddNodeFromContextMenu(cy, event, 'process');
          },
          hasTrailingDivider: true,
        },
        {
          id: 'change-essence',
          content: 'change essence',
          coreAsWell: false,
          selector: 'node[type != "state"]',
          onClickFunction: function (event) {
            const node = event.target;
            const MMRef = node.data('MMRef');
            if (MMRef.essence === Essence.Informatical)
              MMRef.essence = Essence.Physical;
            else
              MMRef.essence = Essence.Informatical;

            node.data({ labelWidth: node.width() + 1 });
          },
        },
        {
          id: 'change-affiliation',
          content: 'change affiliation',
          coreAsWell: false,
          selector: 'node[type != "state"]',
          onClickFunction: function (event) {
            const node = event.target;
            const MMRef = node.data('MMRef');
            if (MMRef.affiliation === Affiliation.Systemic)
              MMRef.affiliation = Affiliation.Environmental;
            else
              MMRef.affiliation = Affiliation.Systemic;

            node.data({ labelWidth: node.width() + 1 }); // workaround: width has to be changed or ghost node does not appear
          },
          hasTrailingDivider: true,
        },

      ]
    });
  };

  useEffect(() => {
    cy = cytoscape({
      container: document.getElementById('cy'), // container to render in
      style: cyStylesheet,
      wheelSensitivity: 0.1,

    });
    registerContextMenu(cy);
    registerEdgeEventHandlers(cy);
    registerPopperHandlers(cy);
    console.log('reregistered');
    cy.edgeEditing(eeDefaults);

  }, []);

  return (
    <div className='diagram-canvas' id='cy' />);
};

export default DiagramCanvas;
export { cy };
