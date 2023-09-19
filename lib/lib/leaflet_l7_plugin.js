var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (
  (target = mod != null ? __create(__getProtoOf(mod)) : {}),
  __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule
      ? __defProp(target, 'default', { value: mod, enumerable: true })
      : target,
    mod,
  )
);
var __toCommonJS = (mod) => __copyProps(__defProp({}, '__esModule', { value: true }), mod);

// src/lib/leaflet_l7_plugin.ts
var leaflet_l7_plugin_exports = {};
__export(leaflet_l7_plugin_exports, {
  default: () => LeafletLayer,
});
module.exports = __toCommonJS(leaflet_l7_plugin_exports);
var L = __toESM(require('leaflet'));
var import_util = require('./util');
var LeafletLayer = class extends L.Layer {
  // protected _map: any;
  constructor(props) {
    super();
    this.animate = void 0;
    this.props = props;
  }
  getScene() {
    return this.scene;
  }
  onAdd() {
    this.container = L.DomUtil.create('div');
    this.container.className = 'leaflet-layer';
    if (this._zoomAnimated) {
      L.DomUtil.addClass(this.container, 'leaflet-zoom-animated');
    }
    this.getPane().appendChild(this.container);
    const size = this._map.getSize();
    this.container.style.width = `${size.x}px`;
    this.container.style.height = `${size.y}px`;
    this.scene = (0, import_util.createL7Instance)(this._map, this.container, this.scene);
    this.update();
    return this;
  }
  onRemove(map) {
    L.DomUtil.remove(this.container);
    return this;
  }
  /**
   * @returns {Object}
   */
  getEvents() {
    const events = {
      moveend: this.onMoveEnd,
      zoom: this.onZoom,
    };
    if (this._zoomAnimated) {
      events.zoomanim = this.onAnimZoom;
    }
    return events;
  }
  /**
   * @returns {void}
   */
  update() {
    if (this._map._animatingZoom) {
      return;
    }
    const size = this._map.getSize();
    this.container.style.width = `${size.x}px`;
    this.container.style.height = `${size.y}px`;
    const offset = this._map._getMapPanePos().multiplyBy(-1);
    L.DomUtil.setPosition(this.container, offset);
    (0, import_util.updateL7View)(this.scene, this._map);
  }
  reset() {
    this.updateTransform(this._map.getCenter(), this._map.getZoom());
    this.update();
  }
  onMoveEnd() {
    this.update();
  }
  onAnimZoom(event) {
    this.updateTransform(event.center, event.zoom);
  }
  onZoom() {
    this.updateTransform(this._map.getCenter(), this._map.getZoom());
  }
  /**
   * see https://stackoverflow.com/a/67107000/1823988
   * see L.Renderer._updateTransform https://github.com/Leaflet/Leaflet/blob/master/src/layer/vector/Renderer.js#L90-L105
   * @param {L.LatLng} center
   * @param {number} zoom
   */
  updateTransform(center, zoom) {
    const scale = this._map.getZoomScale(zoom, this._map.getZoom());
    const position = L.DomUtil.getPosition(this.container);
    const viewHalf = this._map.getSize().multiplyBy(0.5);
    const currentCenterPoint = this._map.project(this._map.getCenter(), zoom);
    const destCenterPoint = this._map.project(center, zoom);
    const centerOffset = destCenterPoint.subtract(currentCenterPoint);
    const topLeftOffset = viewHalf
      .multiplyBy(-scale)
      .add(position)
      .add(viewHalf)
      .subtract(centerOffset);
    if (L.Browser.any3d) {
      L.DomUtil.setTransform(this.container, topLeftOffset, scale);
    } else {
      L.DomUtil.setPosition(this.container, topLeftOffset);
    }
  }
};
