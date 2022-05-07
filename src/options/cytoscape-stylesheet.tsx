/* 
 * Author: Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * Copyright: Copyright 2022, OPM Editor
 * Made for Bachelor's Thesis - Agile Model Editor
 * License: MIT
*/

export const cyStylesheet = [
  // cytoscape elements
  {
    selector: 'node',
    style: {
      'border-width': '2px',
      'background-color': 'white',
      'width': '70px',
      'height': '45 px',
      'text-valign': 'center',
      'taxi-direction': 'vertical',
      'ghost-offset-x': 3,
      'ghost-offset-y': 3,
      'ghost-opacity': 0.4,
    }
  },

  {
    selector: 'node[MMRef.label]',
    style: {
      'content': 'data(MMRef.label)',
    }
  },

  {
    selector: 'node[MMRef.essence]',
    style: {
      'ghost': 'data(MMRef.essence)',
    }
  },

  {
    selector: 'node[MMRef.affiliation]',
    style: {
      'border-style': 'data(MMRef.affiliation)',
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
    selector: 'node[type = "state"]',
    style: {
      'shape': 'round-rectangle',
      'border-color': 'orange',
      'min-width': 50
    }
  },
  {
    selector: 'node[labelWidth]',
    style: {
      'width': 'data(labelWidth)',
    }
  },
  {
    selector: '$node > node[type = "state"]',
    style: {
      'text-valign': 'top',
      'padding': 8,
      'min-width': 80,
      'min-height': 60
    }
  },

  {
    selector: '$node > node[type = "object"], $node > node[type = "process"]',
    style: {
      'text-valign': 'top',
      'padding': 8,
      'min-width': 180,
      'min-height': 300
    }
  },

  {
    selector: 'node:parent[type = "process"]',
    style: {
      'text-valign': 'top',
      'padding': 0,
      'min-width': 0,
      'min-height': 0
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
    selector: 'edge[type = "Consumption/Result"]',
    style: {
      'target-arrow-shape': 'triangle'
    }
  },

  {
    selector: 'edge[type = "Effect"]',
    style: {
      'source-arrow-shape': 'triangle',
      'target-arrow-shape': 'triangle'
    }
  },
  {
    selector: `edge[type = "Aggregation-participation"],
              edge[type = "Exhibition-characterization"], 
              edge[type = "Generalization-specialization"], 
              edge[type = "Classification-instantiation"]`,
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
    selector: 'edge[type = "Exhibition-characterization"]',
    style: {
      'source-arrow-shape': 'triangle-inner-triangle',
      'source-arrow-fill': 'hollow',
    }
  },
  {
    selector: 'edge[type = "Generalization-specialization"]',
    style: {
      'source-arrow-fill': 'hollow',
    }
  },
  {
    selector: 'edge[type = "Classification-instantiation"]',
    style: {
      'source-arrow-shape': 'triangle-inner-circle',
      'source-arrow-fill': 'hollow',
    }
  },
  {
    selector: 'edge[type = "Instrument"]',
    style: {
      'target-arrow-shape': 'circle',
      'target-arrow-fill': 'hollow',
    }
  },
  {
    selector: 'edge[type = "Agent"]',
    style: {
      'target-arrow-shape': 'circle',
    }
  },
  {
    selector: 'edge[type = "Tagged"]',
    style: {
      'target-arrow-shape': 'vee'
    }
  },

  {
    selector: 'node[display], edge[display]',
    style: {
      'display': 'data(display)'
    }
  },

  {
    selector: 'edge[MMRef.originalEdges.length > 0]',
    style: {
      'line-color': '#ccc',
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