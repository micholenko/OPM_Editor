# OPM Editor
Object-Process Methodology diagram editor.

Available [here](https://opm-editor.netlify.app/).

Object-Process Methodology is a modeling language in which only two types of elements exist: statefull objects objectand processes. A model consist of many hierachical diagrams structured in a tree.

More information on [wikipedia](https://en.wikipedia.org/wiki/Object_Process_Methodology).

### Simple usage:
Add objects and processes by right clicking on the diagram canvas and selecting options in the context menu. Connect them by holding right-click. Create new diagrams by in-zooming processes (context menu of processes). Switch currently displayed diagram by clicking on nodes in the diagram tree.

## Manual 

The following is a quick reference to the editor’s functions:
- **Basic functions**:
  - **Adding objects** – Right-click on the diagram canvas and choose *Add Object* in the context menu.
  - **Adding processes** – Right-click on the diagram canvas and choose *Add Process* in the context menu.
  - **Creating edges** – Right-click on the desired source element, hold, and release on the target element. In the pop-up modal, select an edge type.
  - **In-zooming processes** – Right-click on the a process and choose *In-zoom* in the context menu.
- **Element editing**:
  - **Add states to objects** – Right-click an object and choose *Add State* in the context menu.
  - **Change affiliation** – Right-click on an object or process and choose *Change Affiliation* in the context menu.
  - **Change essence** – Right-click on an object or process and choose *Change Essence* in the context menu.
- **Edge editing**:
  - **Reconnecting edges** – Select an edge by left-clicking on it. Two anchors should appear at both ends of the edge. By left-clicking, drag either of the anchors to a new endpoint.
  - **Adding bend points edges** – Select an edge by left-clicking on it. Right-click on the selected edge and choose *Add Bend Point* in the context menu. Position the bend point to edit the edge.
  - **Adding control points edges** – Select an edge by left-clicking on it. Right-click on the selected edge and choose *Add Control Point* in the context menu. Position the bend point to edit the edge.
  - **Removing bend points** – Select an edge by left-clicking on it. Right-click on a bend point and choose *Remove Bend Point* in the context menu.
  - **Removing control points** – Select an edge by left-clicking on it. Right-click on a control point and choose *Remove Control Point* in the context menu.
- **Hide/Remove**:
  - **Hide elements or edges** – Right-click an element or edge and choose *Hide* in the context menu. This action hides the target in the current diagram.
  - **Remove elements or edges** – Right-click an element or edge and choose *Remove* in the context menu. This action removes the target from all diagrams.
  - **Show ll hidden** – Right-click on the diagram canvas and choose *Show Hidden* in the context menu.
- **Propagation:**
  - **Bring connected elements** – Right-click an element and choose *Bring Connected* in the context menu. A modal appears with options of elements connected to the selected element. Click on an option to add it into the current diagram.
  - **Bring states** – Right-click an object and choose *Bring States* in the context menu.
This action automatically adds states of the selected object that are not present in the current diagram.
  - **Propagation selection** – Choose a mode of propagation in the selection located in the top toolbar. The options are *None*, *One Level* and *Complete*. Elements will be automatically propagated (or not) based on the selected mode.
- **Select demo** – In the top toolbar, select a demo to import an already pre-made model.
- **Export current diagram to PNG** – Click on the associated button located in the top toolbar.
- **Export/import the whole model to/from JSON** – Click on the associated button located in the top toolbar.


## Build instructions
The lastest build is available [here](https://opm-editor.netlify.app/).

To build locally run `npm install` before building.

Run `npm start` to start the development server.

Run `npm run build` to build the application for production into the `build` directory.
