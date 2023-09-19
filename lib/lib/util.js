var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all) __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if ((from && typeof from === 'object') || typeof from === 'function') {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, {
          get: () => from[key],
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
        });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, '__esModule', { value: true }), mod);

// src/lib/util.ts
var util_exports = {};
__export(util_exports, {
  createL7Instance: () => createL7Instance,
  updateL7View: () => updateL7View,
});
module.exports = __toCommonJS(util_exports);
var import_l7 = require('@antv/l7');
var import__ = require('../');
function getViewState(map) {
  return {
    longitude: map.getCenter().lng,
    latitude: map.getCenter().lat,
    zoom: map.getZoom() - 1,
    pitch: 0,
    bearing: 0,
  };
}
function createL7Instance(map, container, scene) {
  if (!scene) {
    const viewState = getViewState(map);
    scene = new import_l7.Scene({
      id: container,
      map: new import__.Map({
        pitchEnabled: false,
        rotateEnabled: false,
        interactive: false,
        center: [viewState.longitude, viewState.latitude],
        zoom: viewState.zoom,
        pitch: 0,
        rotation: 0,
        mapInstance: map,
      }),
    });
  }
  return scene;
}
function updateL7View(scene, map) {
  const viewState = getViewState(map);
  const size = map.getSize();
  scene.getMapService().updateView({
    viewportWidth: size.x,
    viewportHeight: size.y,
    center: [viewState.longitude, viewState.latitude],
    zoom: viewState.zoom,
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 &&
  (module.exports = {
    createL7Instance,
    updateL7View,
  });
