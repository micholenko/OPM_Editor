import React from 'react'
// @ts-ignore
import CytoscapeComponent from 'react-cytoscapejs';


const DiagramCanvas = () => {
  const elements = [
    { data: { id: 'one', label: 'Node 1' }, position: { x: 0, y: 0 } },
    { data: { id: 'two', label: 'Node 2' }, position: { x: 100, y: 0 } },
    { data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' } }
 ];
  return (
    <div className='diagram-canvas'>
      <CytoscapeComponent elements={elements} style={ { width: '100%', height: '100%',  position: 'absolute' } } />
    </div>
  )
}

export default DiagramCanvas
