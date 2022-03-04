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
  },
  
]