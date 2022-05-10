/**  
 * @file Initilizing options for cytoscape.js-edge-editing extension, which is used for reconnecting and
 *    adding bend points and control points. 
 * @author Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * @copyright Copyright 2022, OPM Editor
 * @license MIT
 * Made for Bachelor's Thesis - Agile Model Editor
*/

// @ts-nocheck
import { edgeReconnect } from "../controller/edge";

export const eeDefaults = {
  anchorShapeSizeFactor: 5,
  handleReconnectEdge: function (sourceID, targetID, data, location) {
    edgeReconnect(sourceID, targetID, data)
  },
  enableCreateAnchorOnDrag: false,
};