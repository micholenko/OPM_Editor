// @ts-nocheck
import { CoreGraphManipulation } from 'cytoscape';
import cytoscape from 'cytoscape';
import React, { useContext } from 'react'
import { TreeContext } from './App';
// @ts-ignore
import CytoscapeComponent from 'react-cytoscapejs';
import contextMenus from 'cytoscape-context-menus';
// @ts-ignore
import edgehandles from 'cytoscape-edgehandles';
import { masterModel, TreeNode } from '../model/model'
import 'cytoscape-context-menus/cytoscape-context-menus.css';
import { diagramTree, diagramTreeNode } from '../model/diagramTreeModel';
cytoscape.use(edgehandles);
cytoscape.use(contextMenus);

let cyto: CoreGraphManipulation;
let eh
let nodeCounter = 0
const DiagramCanvas = () => {
  const { updateTree, setUpdateTree, currentDiagram, setCurrentDiagram } = useContext(TreeContext);


  const elements = [];
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
  return (
    <div className='diagram-canvas'>
      <CytoscapeComponent
        stylesheet={[
          {
            selector: 'node[label]',
            style: {
              'label': 'data(label)',
            }
          },

          {
            selector: 'edge',
            style: {
              'curve-style': 'taxi',
              'target-arrow-shape': 'triangle'
            }
          },

          // some style for the extension

          {
            selector: '.eh-handle',
            style: {
              'background-color': 'red',
              'width': 12,
              'height': 12,
              'shape': 'ellipse',
              'overlay-opacity': 0,
              'border-width': 12, // makes the handle easier to hit
              'border-opacity': 0
            }
          },

          {
            selector: '.eh-hover',
            style: {
              'background-color': 'red'
            }
          },

          {
            selector: '.eh-source',
            style: {
              'border-width': 2,
              'border-color': 'red'
            }
          },

          {
            selector: '.eh-target',
            style: {
              'border-width': 2,
              'border-color': 'red'
            }
          },

          {
            selector: '.eh-preview, .eh-ghost-edge',
            style: {
              'background-color': 'red',
              'line-color': 'red',
              'target-arrow-color': 'red',
              'source-arrow-color': 'red'
            }
          },

          {
            selector: '.eh-ghost-edge.eh-preview-active',
            style: {
              'opacity': 0
            }
          }
        ]
        }
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
                  let reference = target.data()
                  let parentId = target.id()
                  currentDiagram.diagramJson = cy.json()
                  cy.elements().remove();
                  let nextDiagram = new diagramTreeNode()
                  currentDiagram.addChild(nextDiagram)

                  cy.add({
                    group: 'nodes',
                    data: reference,
                  })

                  let modelNode = new TreeNode(nodeCounter)
                  cy.add({
                    group: 'nodes',
                    data: {
                      id: nodeCounter,
                      group: 'nodes',
                      'MasterModelReference': modelNode, label: 'node ' + nodeCounter,
                      'parent': parentId,
                    },
                    position: { x: 200, y: 200 },
                  })
                  nodeCounter++;
                  modelNode = new TreeNode(nodeCounter)
                  cy.add({
                    group: 'nodes',
                    data: {
                      id: nodeCounter,
                      group: 'nodes',
                      'MasterModelReference': modelNode, label: 'node ' + nodeCounter,
                      'parent': parentId,
                    },
                    position: { x: 300, y: 300 },
                  })
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
                  let modelNode = new TreeNode(nodeCounter)
                  masterModel.addChild(modelNode)
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

        elements={elements}
        style={{ width: '100%', height: '100%', position: 'absolute' }} />
    </div>
  )
}

export default DiagramCanvas
export { cyto, eh }
