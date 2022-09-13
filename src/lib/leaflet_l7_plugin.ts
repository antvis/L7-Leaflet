import * as L from 'leaflet';
import { Scene } from '@antv/l7';

import { createL7Instance, updateL7View } from './util';
export default class LeafletLayer extends L.Layer {
  private container!: HTMLDivElement;

  private animate: boolean | undefined = undefined;

  private props: any;

  private scene: Scene | undefined;

  constructor(props: any) {
    super();

    this.props = props;
  }

  public getScene() {
    return this.scene;
  }

  public onAdd() {
    this.container = L.DomUtil.create('div');
    this.container.className = 'leaflet-layer';
    // @ts-ignore
    if (this._zoomAnimated) {
      L.DomUtil.addClass(this.container, 'leaflet-zoom-animated');
    }

    this.getPane()!.appendChild(this.container);
    const size = this._map.getSize();
    this.container.style.width = `${size.x}px`;
    this.container.style.height = `${size.y}px`;
    this.scene = createL7Instance(this._map, this.container, this.scene as Scene);
    this.update();

    return this;
  }

  public onRemove(map: L.Map) {
    L.DomUtil.remove(this.container!);
    return this;
  }

  /**
   * @returns {Object}
   */
  public getEvents() {
    const events = {
      moveend: this.onMoveEnd,
      zoom: this.onZoom,
    };
    // @ts-ignore
    if (this._zoomAnimated) {
      // @ts-ignore
      events.zoomanim = this.onAnimZoom;
    }
    return events;
  }

  /**
   * @returns {void}
   */
  public update() {
    // @ts-ignore
    if (this._map._animatingZoom) {
      return;
    }

    const size = this._map.getSize();
    this.container.style.width = `${size.x}px`;
    this.container.style.height = `${size.y}px`;

    // invert map position
    // @ts-ignore
    const offset = this._map._getMapPanePos().multiplyBy(-1);
    L.DomUtil.setPosition(this.container as HTMLElement, offset);

    updateL7View(this.scene as Scene, this._map);
  }

  public reset() {
    this.updateTransform(this._map.getCenter(), this._map.getZoom());
    this.update();
  }

  public onMoveEnd() {
    // 移动停止重绘
    this.update();
  }

  public onAnimZoom(event: L.ZoomAnimEvent) {
    this.updateTransform(event.center, event.zoom);
  }

  public onZoom() {
    this.updateTransform(this._map.getCenter(), this._map.getZoom());
  }

  /**
   * see https://stackoverflow.com/a/67107000/1823988
   * see L.Renderer._updateTransform https://github.com/Leaflet/Leaflet/blob/master/src/layer/vector/Renderer.js#L90-L105
   * @param {L.LatLng} center
   * @param {number} zoom
   */
  updateTransform(center: L.LatLng, zoom: number) {
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
}
