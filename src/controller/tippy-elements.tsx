/**  
 * @file Definitions of name editing popups. The popups are html elements that get invoked
 *    on double click. They are implemented with the cytoscape-popper extension.
 * @author Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * @copyright Copyright 2022, OPM Editor
 * @license MIT
 * Made for Bachelor's Thesis - Agile Model Editor
*/

import { Core } from "cytoscape";
import tippy from "tippy.js";

/**
 * Definition of node name editing popup
 * @param cy Cytoscape instance
 */
const nodeLabelEditingPopup = (cy: Core) => {
  cy.on('dbltap', 'node', (evt: any) => {
    const targetNode = evt.target;
    let ref = targetNode.popperRef();
    let dummyDomEle = document.createElement('div');
    document.body.appendChild(dummyDomEle);
    let tip = tippy(dummyDomEle, {
      getReferenceClientRect: ref.getBoundingClientRect,
      trigger: 'manual',
      placement: 'bottom',
      interactive: true,
      content: () => {
        let content = document.createElement('div');
        content.classList.add('renameDialog')

        const inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.value = targetNode.data('label');
        inputElement.classList.add('labelInput');
        let newLabel = inputElement.value;

        inputElement.addEventListener("change", function (event) {
          // @ts-ignore
          newLabel = event.target.value;
        });
        inputElement.classList.add('display-block');
        content.appendChild(inputElement);

        const buttonConfirm = document.createElement('button');
        buttonConfirm.type = 'button';
        buttonConfirm.innerHTML = "Ok";
        buttonConfirm.addEventListener("click", function (event) {
          event.preventDefault();
          targetNode.data({ label: newLabel });
          const newLabelWidth = newLabel.length * 8.5 > 60 ?  newLabel.length  * 8.5 : 60
          targetNode.data({ labelWidth: newLabelWidth });
          targetNode.data('MMRef').label = newLabel;
          tip.hide();
          
        });

        content.appendChild(buttonConfirm);

        const buttonCancel = document.createElement('button');
        buttonCancel.type = 'button';
        buttonCancel.innerHTML = "Cancel";
        buttonCancel.addEventListener("click", function (event) {
          event.preventDefault();
          tip.hide();
        });
        content.appendChild(buttonCancel);
        return content;
      },
    });
    tip.show();
  });
};

/**
 * Definition of edge name editing popup
 * @param cy Cytoscape instance
 */
const edgeLabelEditingPopup = (cy: Core) => {
  cy.on('dbltap', 'edge', (evt: any) => {
    const targetEdge = evt.target;
    let ref = targetEdge.popperRef();
    let dummyDomEle = document.createElement('div');
    document.body.appendChild(dummyDomEle);
    let tip = tippy(dummyDomEle, {
      getReferenceClientRect: ref.getBoundingClientRect,
      trigger: 'manual',
      placement: 'bottom',
      interactive: true,

      content: () => {
        let content = document.createElement('div');
        content.classList.add('renameDialog')

        const inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.value = targetEdge.data('label');
        let newLabel = inputElement.value;

        inputElement.addEventListener("change", function (event) {
          // @ts-ignore
          newLabel = event.target.value;
        });
        inputElement.classList.add('display-block');
        content.appendChild(inputElement);

        const buttonConfirm = document.createElement('button');
        buttonConfirm.type = 'button';
        buttonConfirm.innerHTML = "Ok";
        buttonConfirm.addEventListener("click", function (event) {
          event.preventDefault();
          targetEdge.data({ label: newLabel });
          const MMRef = targetEdge.data('MMRef')
          MMRef.label = newLabel;
          if (MMRef.originalEdges.length)
            MMRef.originalEdge.label = newLabel;
            
          tip.hide();
        });
        buttonConfirm.classList.add('tippyButton');

        content.appendChild(buttonConfirm);

        const buttonCancel = document.createElement('button');
        buttonCancel.type = 'button';
        buttonCancel.classList.add('tippyButton');
        buttonCancel.innerHTML = "Cancel";
        buttonCancel.addEventListener("click", function (event) {
          event.preventDefault();
          tip.hide();
        });
        content.appendChild(buttonCancel);
        return content;
      },
    });
    tip.show();
  });
};

export { nodeLabelEditingPopup, edgeLabelEditingPopup };
