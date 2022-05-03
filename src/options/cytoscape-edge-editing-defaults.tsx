// @ts-nocheck
import { edgeReconnect } from "../controller/edge";

export const eeDefaults = {
  // A function parameter to get bend point positions, should return positions of bend points
  bendPositionsFunction: function (ele) {
    return ele.data('bendPointPositions ' + ele);
  },
  // A function parameter to get control point positions, should return positions of control points
  controlPositionsFunction: function (ele) {
    return ele.data('controlPointPositions');
  },
  // A function parameter to set bend point positions
  bendPointPositionsSetterFunction: function (ele, bendPointPositions) {
    ele.data('bendPointPositions', bendPointPositions);
  },
  // A function parameter to set bend point positions
  controlPointPositionsSetterFunction: function (ele, controlPointPositions) {
    ele.data('controlPointPositions', controlPointPositions);
  },
  // whether to initilize bend and control points on creation of this extension automatically
  initAnchorsAutomatically: false,
  // the classes of those edges that should be ignored
  ignoredClasses: [],
  // whether the bend editing operations are undoable (requires cytoscape-undo-redo.js)
  undoable: false,
  // the size of bend and control point shape is obtained by multipling width of edge with this parameter
  anchorShapeSizeFactor: 5,
  // z-index value of the canvas in which bend points are drawn
  zIndex: 999,
  /*An option that controls the distance (in pixels) within which a bend point is considered near the line segment between 
    its two neighbors and will be automatically removed
    min value = 0 , max value = 20 , values less than 0 are set to 0 and values greater than 20 are set to 20
  */
  bendRemovalSensitivity: 16,
  // to not show a menu item, pass `false` for corresponding menu item title. Below are 6 menu item titles.
  // title of add bend point menu item (User may need to adjust width of menu items according to length of this option)
  addBendMenuItemTitle: "Add Bend Point",
  // title of remove bend point menu item (User may need to adjust width of menu items according to length of this option)
  removeBendMenuItemTitle: "Remove Bend Point",
  // title of remove all bend points menu item
  removeAllBendMenuItemTitle: "Remove All Bend Points",
  // title of add control point menu item (User may need to adjust width of menu items according to length of this option)
  addControlMenuItemTitle: "Add Control Point",
  // title of remove control point menu item (User may need to adjust width of menu items according to length of this option)
  removeControlMenuItemTitle: "Remove Control Point",
  // title of remove all control points menu item
  moveSelectedAnchorsOnKeyEvents: function () {
    return true;
  },
  // Can be a function or boolean. If `false`, edge reconnection won't be active. If `true`, connects edge to its new source/target as usual. 
  // If a function is given, the function will be called with parameters: newSource.id(), newTarget.id(), edge.data(), location
  handleReconnectEdge: function (sourceID, targetID, data, location) {
    edgeReconnect(sourceID, targetID, data)
  },

  // Can be `false` or `true`. If `false`, it won't interact with anchors (control and bend points). If `false`, it won't show any context menu items as well.
  handleAnchors: true,
  // this function checks validation of the edge and its new source/target
  validateEdge: function (edge, newSource, newTarget) {
    return 'valid';
  },
  // this function is called with reconnected edge if reconnected edge is not valid according to `validateEdge` function
  actOnUnsuccessfulReconnection: undefined,
  // specifically for edge-editing menu items, whether trailing dividers should be used
  useTrailingDividersAfterContextMenuOptions: false,
  // Enable / disable drag creation of anchor points when there is at least one anchor already on the edge
  enableCreateAnchorOnDrag: true,
  // size of anchor point can be auto changed to compensate the impact of zoom
  enableFixedAnchorSize: false,
  // automatically remove anchor (bend point) if its previous segment and next segment is almost in a same line
  enableRemoveAnchorMidOfNearLine: true,
  // edge reconnection handles can be shown with select or hover events
  isShowHandleOnHover: false,
  anchorColor: '#000000',  // default anchor color is black
  endPointColor: '#000000' // default endpoint color is black
};