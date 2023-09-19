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

// src/lib/map.ts
var map_exports = {};
__export(map_exports, {
  default: () => MapService,
});
module.exports = __toCommonJS(map_exports);
var import_l7 = require('@antv/l7');
var L = __toESM(require('leaflet'));
var MapService = class extends import_l7.BaseMapService {
  constructor() {
    super(...arguments);
    this.viewport = void 0;
    this.handleCameraChanged = (e) => {
      const { lat, lng } = this.map.getCenter();
      const { x, y } = this.map.getSize();
      this.viewport.syncWithMapCamera({
        bearing: 0,
        center: [lng, lat],
        viewportHeight: y,
        pitch: 0,
        viewportWidth: x,
        zoom: this.map.getZoom() - 1,
        // mapbox 中固定相机高度为 viewport 高度的 1.5 倍
        cameraHeight: 0,
      });
      this.updateCoordinateSystemService();
      this.cameraChangedCallback(this.viewport);
    };
  }
  lngLatToMercator(lnglat, altitude) {
    throw new Error('Method not implemented.');
  }
  getModelMatrix(lnglat, altitude, rotate, scale, origin) {
    throw new Error('Method not implemented.');
  }
  // 地图初始化
  async init() {
    var _a;
    const {
      id = 'map',
      style = 'light',
      rotation = 0,
      mapInstance,
      version = 'Leaflet',
      mapSize = 1e4,
      ...rest
    } = this.config;
    this.viewport = new import_l7.Viewport();
    if (mapInstance) {
      this.map = mapInstance;
      this.$mapContainer = this.map.getContainer();
    } else {
      this.$mapContainer = this.creatMapContainer(id);
      this.map = new L.Map(this.$mapContainer, {
        zoomSnap: 0,
        zoomAnimation: true,
        ...rest,
        center: (_a = rest.center) == null ? void 0 : _a.reverse(),
      });
    }
    L.DomUtil.addClass(this.$mapContainer, 'leaflet-zoom-anim');
    this.map.on('zoomanim', this.onAnimZoom.bind(this));
    this.map.on('moveend', this.update.bind(this));
    this.handleCameraChanged();
  }
  // 设置 Marker 容器
  addMarkerContainer() {
    this.markerContainer = this.map.getPane('markerPane');
  }
  getOverlayContainer() {
    const overlayPane = this.map.getPane('overlayPane');
    const container = L.DomUtil.create('div');
    overlayPane.appendChild(container);
    container.className = 'leaflet-layer';
    const size = this.map.getSize();
    container.style.width = `${size.x}px`;
    container.style.height = `${size.y}px`;
    if (this.map._zoomAnimated) {
      L.DomUtil.addClass(container, 'leaflet-zoom-animated');
    }
    this.sceneContainer = container;
    return container;
  }
  update() {
    if (this.map._animatingZoom) {
      return;
    }
    const size = this.map.getSize();
    this.sceneContainer.style.width = `${size.x}px`;
    this.sceneContainer.style.height = `${size.y}px`;
    const offset = this.map._getMapPanePos().multiplyBy(-1);
    L.DomUtil.removeClass(this.sceneContainer, 'leaflet-zoom-animated');
    L.DomUtil.setPosition(this.sceneContainer, offset);
    this.handleCameraChanged();
  }
  onAnimZoom(ev) {
    if (this.map._zoomAnimated) {
      L.DomUtil.addClass(this.sceneContainer, 'leaflet-zoom-animated');
    }
    this.updateTransform(ev.center, ev.zoom);
  }
  updateTransform(center, zoom) {
    const container = this.sceneContainer;
    const scale = this.map.getZoomScale(zoom, this.map.getZoom()),
      position = L.DomUtil.getPosition(container),
      viewHalf = this.map.getSize().multiplyBy(0.5),
      currentCenterPoint = this.map.project(this.map.getCenter(), zoom),
      destCenterPoint = this.map.project(center, zoom),
      centerOffset = destCenterPoint.subtract(currentCenterPoint),
      topLeftOffset = viewHalf
        .multiplyBy(-scale)
        .add(position)
        .add(viewHalf)
        .subtract(centerOffset);
    if (L.Browser.any3d) {
      L.DomUtil.setTransform(container, topLeftOffset, scale);
    } else {
      L.DomUtil.setPosition(container, topLeftOffset);
    }
  }
  onCameraChanged(callback) {
    this.cameraChangedCallback = callback;
  }
};
