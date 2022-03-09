export const cyStylesheet = [
  // cytoscape elements
  {
    selector: 'node',
    style: {
      'content': 'data(label)',
      'border-width': 2,
      'background-color': 'white',
      'width': '70px',
      'height': '50px',
      'text-valign': 'center',
    }
  },
  {
    selector: '$node > node',
    style: {
      'text-valign': 'top',
    }
  },

  {
    selector: 'node[type = "object"]',
    style: {
      'shape': 'rectangle',
      'border-color': 'green'
    }
  },
  {
    selector: 'node[type = "process"]',
    style: {
      'shape': 'ellipse',
      'border-color': 'DeepSkyBlue'
    }
  },

  {
    selector: 'edge',
    style: {
      'curve-style': 'straight',
      'target-arrow-shape': 'triangle'
    }
  },

  {
    selector: 'edge[type = "aggregation"]',
    style: {
      'curve-style': 'taxi',
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

]