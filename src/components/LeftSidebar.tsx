// @ts-nocheck
import React from 'react'
import '../css/general.css'
import { cyto, eh } from './DiagramCanvas'
import TreeDiagram from './TreeDiagram'

const LeftSidebar = ({currentDiagram}) => {
  
  return (
    <div className='left-sidebar'>
      <button onClick={() => cyto.add({
        group: 'nodes',
        data: { weight: 75, ismine:true },
        position: { x: 200, y: 200 },
        label: 'reee'
      })
      }>Add Node</button>
      <button onClick={() => { eh.enableDrawMode(); }}>enable edge</button>
      <button onClick={() => { eh.disableDrawMode(); }}>disable edge</button>
      <TreeDiagram/>
    </div>
  )
}

export default LeftSidebar