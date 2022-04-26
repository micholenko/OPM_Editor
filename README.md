# OPM Editor
Object-Process Methodology diagram editor.

Available [here](https://opm-editor.netlify.app/).

Object-Process Methodology is a modeling language in which only 2 types of elements exist: statefull objects and processes. A model consist of many hierachical diagrams structured in a tree.

More information on [wikipedia](https://en.wikipedia.org/wiki/Object_Process_Methodology).

### Simple usage:
Add objects and processes by right clicking on the diagram canvas and selecting options in the context menu. Connect them by holding right-click. Create new diagrams by in-zooming processes (context menu of processes). Switch currently displayed diagram by clicking on nodes in the diagram tree.

---
## Manual

The following is a quick reference to the editor’s functions:
- **Basic functions**:
  - **Adding objects** – Right-click on the diagram canvas and choose *add object* in the context menu.
  - **Adding processes** – Right-click on the diagram canvas and choose *add process* in the context menu.
  - **Creating edges** – Right-click on the desired source element, hold, and release on the target element. In the pop-up modal, select an edge type.
  - **In-zooming processes** – Right-click on the a process and choose *in-zoom* in the context menu.
- **Element editing**:
  - **Add states to objects** – Right-click an object and choose *add state* in the context menu.
  - **Change affiliation** – Right-click on an object or process and choose *change affiliation* in the context menu.
  - **Change essence** – Right-click on an object or process and choose *change essence* in the context menu.
- **Edge editing**:
  - **Reconnecting edges** – Select an edge by left-clicking on it. Two anchors should appear at both ends of the edge. By left-clicking, drag either of the anchors to a new endpoint.
  - **Adding bend points edges** – Select an edge by left-clicking on it. Right-click on the selected edge and choose add bend point in the context menu. Position the bend point to edit the edge.
  - **Adding control points edges** – Select an edge by left-clicking on it. Right-click on the selected edge and choose *add control* point in the context menu. Position the bend point to edit the edge.
  - **Removing bend points** – Select an edge by left-clicking on it. Right-click on a bend point and choose *remove bend point* in the context menu.
  - **Removing control points** – Select an edge by left-clicking on it. Right-click on a control point and choose *remove control point* in the context menu.
- **Hide/Remove**:
  - **Hide elements or edges** – Right-click an element or edge and choose *hide* in the context menu. This action hides the target in the current diagram.
  - **Remove elements or edges** – Right-click an element or edge and choose *remove* in the context menu. This action removes the target from all diagrams.
  - **Show all hidden** – Right-click on the diagram canvas and choose *show hidden* in the context menu.

