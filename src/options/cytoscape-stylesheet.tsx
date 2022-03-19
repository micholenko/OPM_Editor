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
    selector: 'node:parent',
    style: {
      'text-valign': 'top',
      'padding': 8,
      'min-width': 180,
      'min-height': 300
    }
  },
  {
    selector: 'edge',
    style: {
      'curve-style': 'bezier',
      'arrow-scale': 1.5,
    }
  },
  {
    selector: 'edge[label]',
    style: {
      'content': 'data(label)',
      'text-background-opacity': 0.8,
      'text-background-color': 'white',
      'text-background-shape': 'round-rectangle',
      'text-background-padding': 5
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

  {
    selector: 'edge[type = "aggregation"]',
    style: {
      "curve-style": "taxi",
      "taxi-direction": "downward",
      "taxi-turn": '100px',
      'source-arrow-shape': 'triangle',
      'arrow-scale': 3,
      'source-distance-from-node': '30px',
      'target-endpoint': 'outside-to-node'


    }
  },

  {
    selector: 'edge[type = "instrument"]',
    style: {
      'target-arrow-shape': 'circle',
      'target-arrow-fill': 'hollow',
    }
  },

  {
    selector: 'edge[type = "tagged"]',
    style: {
      'target-arrow-shape': 'vee'
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