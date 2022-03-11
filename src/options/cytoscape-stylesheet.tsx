import { NodeSingular } from "cytoscape";



export const cyStylesheet = [
  // cytoscape elements
  {
    selector: 'node[label]',
    style: {
      'content': 'data(label)',
      'border-width': '2px',
      'background-color': 'white',
      'width': '70px',
      'height': '45 px',
      'text-valign': 'center',
      'taxi-direction': 'vertical'
    }
  },
  {
    selector: 'node[type = "object"]',
    style: {
      'shape': 'rectangle',
      'border-color': 'green',
      'padding': '5 px',
    }
  },
  {
    selector: 'node[type = "process"]',
    style: {
      'shape': 'ellipse',
      'border-color': 'DeepSkyBlue',
      'padding': '8 px',
    }
  },
  {
    selector: 'node[labelWidth]',
    style: {
      'width': 'data(labelWidth)',
    }
  },
  {
    selector: '$node > node',
    style: {
      'text-valign': 'top',
    }
  },

  
  
  {
    selector: 'edge',
    style: {
      'curve-style': 'straight',
      'target-arrow-shape': 'triangle',
      'content': 'data(label)'
    }
  },

  {
    selector: 'edge[type = "aggregation"]',
    style: {
      "curve-style": "taxi",
      "taxi-direction": "downward",
      "taxi-turn": 100,
    }
  },

  {
    selector: 'edge[type = "consumption"]',
    style: {
      'target-arrow-shape': 'triangle'
    }
  },

  {
    selector: 'edge[type = "effect"]',
    style: {
      'source-arrow-shape': 'triangle',
      'target-arrow-shape': 'triangle'
    }
  },


  // cytoscape-edge-handles extention

  {
    selector: '.eh-source',
    style: {
      'border-width': 2,
    }
  },

  {
    selector: '.eh-hover',
    style: {
      'border-width': 3,
      'background-color': 'lightgrey'
    }
  },

  {
    selector: '.eh-preview, .eh-ghost-edge',
    style: {
      'background-color': 'grey',
      'line-color': 'grey',
      'target-arrow-color': 'grey',
      'source-arrow-color': 'grey'
    }
  },

];