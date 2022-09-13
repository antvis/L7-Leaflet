/**
 * MapboxService
 */
import { IMercator, IViewport, Viewport, BaseMapService } from '@antv/l7';
import * as L from 'leaflet';

export default class MapService<T> extends BaseMapService<L.Map> {
  public lngLatToMercator(lnglat: [number, number], altitude: number): IMercator {
    throw new Error('Method not implemented.');
  }
  public getModelMatrix(
    lnglat: [number, number],
    altitude: number,
    rotate: [number, number, number],
    scale: [number, number, number],
    origin: IMercator,
  ): number[] {
    throw new Error('Method not implemented.');
  }
  // @ts-ignore
  public map: L.Map & T;

  protected viewport: Viewport;

  // @ts-ignore
  private sceneContainer: HTMLElement;

  public async init(): Promise<void> {
    const {
      id = 'map',
      style = 'light',
      rotation = 0,
      mapInstance,
      version = 'Leaflet',
      mapSize = 10000,
      ...rest
    } = this.config;

    this.viewport = new Viewport();

    if (mapInstance) {
      // @ts-ignore
      this.map = mapInstance;
      this.$mapContainer = this.map.getContainer();
    } else {
      this.$mapContainer = this.creatMapContainer(id);
      // @ts-ignore
      this.map = new L.Map(this.$mapContainer, {
        zoomSnap: 0,
        zoomAnimation: true,
        center: rest.center?.reverse() as L.LatLngExpression,
        zoom: rest.zoom,
      });
    }
    L.DomUtil.addClass(this.$mapContainer as HTMLElement, 'leaflet-zoom-anim');
    this.map.on('zoomanim', this.onAnimZoom.bind(this));
    this.map.on('moveend', this.update.bind(this));

    // 不同于高德地图，需要手动触发首次渲染
    this.handleCameraChanged();
  }
  // init
  public addMarkerContainer(): void {
    this.markerContainer = this.map.getPane('markerPane') as HTMLElement;
  }

  public getOverlayContainer(): HTMLElement | undefined {
    const overlayPane = this.map.getPane('overlayPane') as HTMLElement;
    const container = L.DomUtil.create('div');
    overlayPane.appendChild(container);
    container.className = 'leaflet-layer';
    const size = this.map.getSize();
    container.style.width = `${size.x}px`;
    container.style.height = `${size.y}px`;
    // @ts-ignore
    if (this.map._zoomAnimated) {
      L.DomUtil.addClass(container, 'leaflet-zoom-animated');
    }
    this.sceneContainer = container;
    return container;
  }
  private update() {
    // @ts-ignore
    if (this.map._animatingZoom) {
      return;
    }

    const size = this.map.getSize();
    this.sceneContainer.style.width = `${size.x}px`;
    this.sceneContainer.style.height = `${size.y}px`;

    // invert map position
    // @ts-ignore
    const offset = this.map._getMapPanePos().multiplyBy(-1);
    L.DomUtil.removeClass(this.sceneContainer, 'leaflet-zoom-animated');
    L.DomUtil.setPosition(this.sceneContainer as HTMLElement, offset);
    // @ts-ignore

    this.handleCameraChanged();
  }

  private onAnimZoom(ev: any) {
    // @ts-ignore
    if (this.map._zoomAnimated) {
      L.DomUtil.addClass(this.sceneContainer, 'leaflet-zoom-animated');
    }
    this.updateTransform(ev.center, ev.zoom);
  }
  protected handleCameraChanged = (e?: any) => {
    const { lat, lng } = this.map.getCenter();
    const { x, y } = this.map.getSize();
    // Tip: 统一触发地图变化事件
    this.emit('mapchange');
    // resync
    (this.viewport as IViewport).syncWithMapCamera({
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
    this.cameraChangedCallback(this.viewport as IViewport);
  };

  private updateTransform(center: any, zoom: number) {
    // @ts-ignore
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
  public onCameraChanged(callback: (viewport: IViewport) => void): void {
    this.cameraChangedCallback = callback;
  }
}
