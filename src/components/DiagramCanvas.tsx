// @ts-nocheck
import React, { useContext, useEffect, useMemo } from 'react';
import cytoscape, { CoreGraphManipulation } from 'cytoscape';
import edgehandles from 'cytoscape-edgehandles';
import CytoscapeComponent from 'react-cytoscapejs';
import contextMenus from 'cytoscape-context-menus';

import { TreeContext } from './App';
import { diagramTreeRoot, DiagramTreeNode } from '../model/diagram-tree-model';
import { masterModelRoot, MasterModelNode } from '../model/master-model';

import { cyStylesheet } from '../options/cytoscape-stylesheet';

import 'cytoscape-context-menus/cytoscape-context-menus.css';

cytoscape.use(contextMenus);
cytoscape.use(edgehandles);

let cyto: CoreGraphManipulation;
let eh;
let nodeCounter = 0;
let defaults = {
  canConnect: function (sourceNode: any, targetNode: any) {
    // whether an edge can be created between source and target
    return !sourceNode.same(targetNode); // e.g. disallow loops
  },
  edgeParams: function (sourceNode: any, targetNode: any) {
    // for edges between the specified source and target
    // return element object to be passed to cy.add() for edge
    return {};
  },

};
const DiagramCanvas = () => {
  const { currentDiagram, setCurrentDiagram } = useContext(TreeContext);
  useEffect(() => {
    console.log('cytoscape rendered');

  }, []);

  return useMemo(() => //uff toto neni dobre
    <div className='diagram-canvas'>
      <CytoscapeComponent
        stylesheet={cyStylesheet}
        cy={(cy: CoreGraphManipulation) => {
          cyto = cy;
          eh = cy.edgehandles(defaults);
          cy.on('add', 'node', function (evt: Event) {
            var node = evt.target;

            if (!node.hasClass('eh-ghost')) {

            }
          });
          cy.on('add', 'edge', function (evt) {
            var node = evt.target;
            if (!node.hasClass('eh-ghost'))
              console.log('added  edge ');
          });
          cy.on('remove', 'node', function (evt) {
            var node = evt.target;
            if (!node.hasClass('eh-ghost'))
              console.log('removed node');
          });
          cy.on('remove', 'edge', function (evt: Event) {
            var node = evt.target;
            if (!node.hasClass('eh-ghost'))
              console.log('removed  edge ');
          });

          var contextMenu = cy.contextMenus({
            menuItems: [
              {
                id: 'remove',
                content: 'remove',
                tooltipText: 'remove',
                selector: 'node, edge',
                onClickFunction: function (event) {
                  var target = event.target || event.cyTarget;
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
                  var target = event.target || event.cyTarget;
                  let reference = target.data();
                  let parentId = target.id();
                  currentDiagram.diagramJson = cy.json();
                  cy.elements().remove();
                  let nextDiagram = new DiagramTreeNode();
                  currentDiagram.addChild(nextDiagram);

                  cy.add({
                    group: 'nodes',
                    data: reference,
                  });

                  let modelNode = new MasterModelNode(nodeCounter);
                  cy.add({
                    group: 'nodes',
                    data: {
                      id: nodeCounter,
                      group: 'nodes',
                      'MasterModelReference': modelNode, label: 'node ' + nodeCounter,
                      'parent': parentId,
                    },
                    position: { x: 200, y: 200 },
                  });
                  nodeCounter++;
                  modelNode = new MasterModelNode(nodeCounter);
                  cy.add({
                    group: 'nodes',
                    data: {
                      id: nodeCounter,
                      group: 'nodes',
                      'MasterModelReference': modelNode, label: 'node ' + nodeCounter,
                      'parent': parentId,
                    },
                    position: { x: 300, y: 300 },
                  });
                  nodeCounter++;
                  setCurrentDiagram(nextDiagram);

                },
                hasTrailingDivider: true
              },


              {
                id: 'add-node',
                content: 'add node',
                tooltipText: 'add node',
                coreAsWell: true,
                selector: 'node',
                onClickFunction: function (event) {
                  let modelNode = new MasterModelNode(nodeCounter);
                  masterModelRoot.addChild(modelNode);
                  console.log('added node' + nodeCounter);

                  var data = {
                    id: nodeCounter,
                    group: 'nodes',
                    'MasterModelReference': modelNode, label: 'node ' + nodeCounter
                  };

                  var pos = event.position || event.cyPosition;

                  cy.add({
                    data: data,
                    position: {
                      x: pos.x,
                      y: pos.y
                    }
                  });

                  nodeCounter++;
                }
              },

            ]
          });
        }}

        elements={[]}
        style={{ width: '100%', height: '100%', position: 'absolute' }} />
    </div>
    , []
  );
};

export default DiagramCanvas;
export { cyto, eh };
