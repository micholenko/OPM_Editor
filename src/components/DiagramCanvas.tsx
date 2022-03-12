// @ts-nocheck
import React, { useContext, useEffect, useRef, useState } from 'react';
import cytoscape, { CoreGraphManipulation, CoreGraphManipulationExt } from 'cytoscape';
import edgehandles from 'cytoscape-edgehandles';
import popper from 'cytoscape-popper';
import contextMenus from 'cytoscape-context-menus';
import coseBilkent from 'cytoscape-cose-bilkent';

import { diagramTreeRoot, DiagramTreeNode } from '../model/diagram-tree-model';
import { edgeArray, Edge, derivedEdgeArray } from '../model/edge-model';

import { defaults } from '../options/cytoscape-edge-handles-defaults';
import { cyStylesheet } from '../options/cytoscape-stylesheet';
import { cyAddNodeFromContextMenu, cyAddInzoomedNodes, cyAddConnectedNodes } from '../helper-functions/cytoscape-interface';
import { nodeLabelEditingPopup, edgeLabelEditingPopup } from '../helper-functions/tippy-elements';

import 'cytoscape-context-menus/cytoscape-context-menus.css';
import '../css/general.css';
import { MasterModelNode } from '../model/master-model';

import { ACTIONS } from './App';

cytoscape.use(contextMenus);
cytoscape.use(edgehandles);
cytoscape.use(popper);
cytoscape.use(coseBilkent);

let cy: Core;
let nodeCounter = 0;

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

const DiagramCanvas = ({ state, dispatch }) => {

  const currentDiagram = useRef()
  currentDiagram.current = state.currentDiagram

  const registerEdgeEventHandlers = (cy: Core) => {
    let sourceNode = null;
    let targetNode = null;

    let eh = cy.edgehandles(defaults);

    cy.on('cxttapstart', 'node', (evt: Event) => {
      sourceNode = evt.target;
      sourceNode.addClass('eh-source');
      eh.start(sourceNode);
    });

    cy.on('cxttapend', 'node', (evt: Event) => {
      eh.stop();
    });

    cy.on('ehstop', (evt: Event) => {
      if (sourceNode != null && targetNode != null) {
        let modelEdge, derivedEdge;

        modelEdge = new Edge(
          sourceNode.data('MasterModelRef'),
          targetNode.data('MasterModelRef'),
          'consumption'//default
        );
        const addedEdge = cy.add({
          group: 'edges',
          data: {
            'source': sourceNode.data('id'),
            'target': targetNode.data('id'),
            'MasterModelRef': modelEdge
          },
        });

        edgeArray.addEdge(modelEdge);
        if (sourceNode.isChild()) {
          derivedEdge = new Edge(
            sourceNode.parent().data('MasterModelRef'),
            targetNode.data('MasterModelRef'),
            'consumption',//default
          );
          derivedEdgeArray.addEdge(derivedEdge);
        }
        else if (targetNode.isChild()) {
          derivedEdge = new Edge(
            sourceNode.data('MasterModelRef'),
            targetNode.parent().data('MasterModelRef'),
            'consumption',//default
          );
          derivedEdgeArray.addEdge(derivedEdge);
        }

        targetNode.removeClass('eh-hover');

        dispatch({type: ACTIONS.CHANGE_CREATED_EDGE, payload:addedEdge})
      }
      sourceNode = null;
      targetNode = null;
    });

    cy.on('cxtdragover', 'node', (evt: Event) => {
      if (sourceNode != null) {
        targetNode = evt.target;
        targetNode.addClass('eh-hover');
      }
    });

    cy.on('cxtdragout', 'node', (evt: Event) => {
      evt.target.removeClass('eh-hover');
      targetNode = null;
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
            const nodeMMRef = target.data('MasterModelRef'); //to function set deleted and null reference
            nodeMMRef.deleted = true;
            target.data({ 'MasterModelRef': null });

            for (const connectedEdge of target.connectedEdges()) {
              const edgeMMRef = connectedEdge.data('MasterModelRef');
              edgeArray.removeEdge(edgeMMRef);
              connectedEdge.data({ 'MasterModelRef': null });
            }
            target.remove();
          },
          hasTrailingDivider: true
        },
        {
          id: 'in-zoom',
          content: 'in-zoom',
          tooltipText: 'in-zoom',
          selector: 'node',
          onClickFunction: function (event) {
            var target = event.target;
            let nextDiagram;
            const MMReference = target.data('MasterModelRef');
            if (nextDiagram = MMReference.diagram) { //already inzoomed
              currentDiagram.current.diagramJson = cy.json();
              cy.elements().remove();
              cy.json(nextDiagram.diagramJson);
              dispatch({ type: ACTIONS.CHANGE_DIAGRAM, payload: nextDiagram });
              return;
            }

            currentDiagram.current.diagramJson = cy.json();
            cy.elements().remove();
            nextDiagram = new DiagramTreeNode(nodeCounter, MMReference); //change counter, remove?
            MMReference.diagram = nextDiagram;
            currentDiagram.current.addChild(nextDiagram);
            console.log(cy.zoom());
            cyAddInzoomedNodes(cy, event);

            cyAddConnectedNodes(cy, MMReference);

            let layout = cy.layout(defaultOptions);
            layout.run();
            cy.center();
            console.log(cy.zoom());
            cy.zoom(1);

            dispatch({ type: ACTIONS.CHANGE_DIAGRAM, payload: nextDiagram });
          },
          hasTrailingDivider: true
        },


        {
          id: 'add-object',
          content: 'add object',
          tooltipText: 'add object',
          coreAsWell: true,
          selector: 'node',
          onClickFunction: function (event) {
            cyAddNodeFromContextMenu(cy, event, 'object');
          }
        },
        {
          id: 'add-process',
          content: 'add process',
          tooltipText: 'add process',
          coreAsWell: true,
          selector: 'node',
          onClickFunction: function (event) {
            cyAddNodeFromContextMenu(cy, event, 'process');
          }
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

    registerEdgeEventHandlers(cy);
    registerPopperHandlers(cy);
    registerContextMenu(cy);

    /* ffff */

  }, []);

  return (
    <div className='diagram-canvas' id='cy' />);
};

export default DiagramCanvas;
export { cy };
