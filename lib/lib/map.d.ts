/**
 * MapboxService
 */
import { IMercator, IViewport, Viewport, BaseMapService } from '@antv/l7';
import * as L from 'leaflet';
export default class MapService extends BaseMapService<L.Map> {
  lngLatToMercator(lnglat: [number, number], altitude: number): IMercator;
  getModelMatrix(
    lnglat: [number, number],
    altitude: number,
    rotate: [number, number, number],
    scale: [number, number, number],
    origin: IMercator,
  ): number[];
  map: L.Map;
  protected viewport: Viewport;
  private sceneContainer;
  init(): Promise<void>;
  addMarkerContainer(): void;
  getOverlayContainer(): HTMLElement | undefined;
  private update;
  private onAnimZoom;
  protected handleCameraChanged: (e?: any) => void;
  private updateTransform;
  onCameraChanged(callback: (viewport: IViewport) => void): void;
}
