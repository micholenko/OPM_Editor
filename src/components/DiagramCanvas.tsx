// @ts-nocheck
/* 
 * Author: Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * Copyright: Copyright 2022, OPM Editor
 * Made for Bachelor's Thesis - Agile Model Editor
 * License: MIT
*/

import cytoscape from 'cytoscape';
import 'cytoscape-context-menus/cytoscape-context-menus.css';
import coseBilkent from 'cytoscape-cose-bilkent';
import edgehandles from 'cytoscape-edgehandles';
import popper from 'cytoscape-popper';
import React, { useEffect, useRef } from 'react';
import { edgeCheckValidTargets, edgeDragOut, edgeDragOver, edgeStartDrawing, edgeStopDrawing } from '../controller/edge';
import { cyBringAllStates, cyBringAllConnected, cyAddConnectedNodesInzoom, cyAddInzoomedNodes, cyAddNodeFromContextMenu, removeEdgeContextMenu, removeNodeContextMenu } from '../controller/general';
import { edgeLabelEditingPopup, nodeLabelEditingPopup } from '../controller/tippy-elements';
import '../css/general.css';
import { DiagramTreeNode } from '../model/diagram-tree-model';
import { Affiliation, Essence } from "../model/master-model";
import { eeDefaults } from '../options/cytoscape-edge-editing-defaults';
import { ehDefaults } from '../options/cytoscape-edge-handles-defaults';
import { cyStylesheet } from '../options/cytoscape-stylesheet';
import { ACTIONS, PropagationEnum, useReducerProps } from './App';

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
          id: 'hide',
          content: 'Hide',
          selector: 'node, edge',
          onClickFunction: function (event) {
            const target = event.target;
            target.data({ lastParent: target.data('parent')});
            target.move({ parent: null });
            target.data({ display: 'none' });
          },
        },
        {
          id: 'remove',
          content: 'Remove',
          selector: 'node, edge',
          onClickFunction: function (event) {
            const target = event.target;
            if (target.isNode()) {
              removeNodeContextMenu(target, dispatch);
            }
            else if (target.isEdge()) {
              removeEdgeContextMenu(target);
            }
            target.remove();
          },
          hasTrailingDivider: true
        },
        {
          id: 'in-zoom',
          content: 'In-zoom',
          selector: 'node[type = "process"]node:childless',
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
              cyAddConnectedNodesInzoom(cy, MMReference);

            dispatch({ type: ACTIONS.INZOOM_DIAGRAM, payload: nextDiagram });
          },
          hasTrailingDivider: true
        },
        {
          id: 'add-state',
          content: 'Add State',
          coreAsWell: false,
          selector: 'node[type = "object"]',
          onClickFunction: function (event) {
            cyAddNodeFromContextMenu(cy, event, 'state', currentDiagram.current);
          },
        },
        {
          id: 'add-object',
          content: 'Add Object',
          coreAsWell: true,
          selector: '$node > node[type != "state"]',
          onClickFunction: function (event) {
            cyAddNodeFromContextMenu(cy, event, 'object', currentDiagram.current);
          }
        },
        {
          id: 'add-process',
          content: 'Add Process',
          coreAsWell: true,
          selector: '$node > node[type != "state"]',
          onClickFunction: function (event) {
            cyAddNodeFromContextMenu(cy, event, 'process', currentDiagram.current);
          },
          hasTrailingDivider: true,
        },
        {
          id: 'change-essence',
          content: 'Change Essence',
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
          content: 'Change Affiliation',
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
        {
          id: 'bring-all-connected',
          content: 'Bring All Connected',
          coreAsWell: false,
          selector: 'node',
          onClickFunction: function (event) {
            const node = event.target;
            const MMRef = node.data('MMRef');
            cyBringAllConnected(cy, MMRef);
          },
          hasTrailingDivider: false,
        },
        {
          id: 'bring-all-states',
          content: 'Bring All States',
          coreAsWell: false,
          selector: 'node[type = "object"]',
          onClickFunction: function (event) {
            const node = event.target;
            cyBringAllStates(cy, node);
          },
          hasTrailingDivider: false,
        },
        {
          id: 'show-hidden',
          content: 'Show Hidden',
          coreAsWell: true,
          onClickFunction: function (event) {
            for (const element of cy.elements()) {
              if (element.data('display') === 'none') {
                const parentId = element.data('lastParent')
                element.move({ parent: parentId });
                element.data({ display: 'element' });
              }
            }
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
    cy.edgeEditing(eeDefaults);
  }, []);

  return (
    <div className='diagram-canvas' id='cy' />);
};

export default DiagramCanvas;
export { cy };

