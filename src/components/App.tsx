import React from 'react';
import logo from './logo.svg';
import './../css/general.css';
import TopToolbar from './TopToolbar';
import LeftSidebar from './LeftSidebar';
import DiagramCanvas from './DiagramCanvas';

function App() {
  return (
    <div className="app">
      <TopToolbar/>
      <div className='flex-wrapper'>
        <LeftSidebar/>
        <DiagramCanvas/>
      </div>
    </div>
  );
}

export default App;
