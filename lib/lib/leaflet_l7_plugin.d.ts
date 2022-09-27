import * as L from 'leaflet';
export default class LeafletLayer extends L.Layer {
  private container;
  private animate;
  private props;
  private scene;
  constructor(props: any);
  getScene(): any;
  onAdd(): this;
  onRemove(map: L.Map): this;
  /**
   * @returns {Object}
   */
  getEvents(): {
    moveend: () => void;
    zoom: () => void;
  };
  /**
   * @returns {void}
   */
  update(): void;
  reset(): void;
  onMoveEnd(): void;
  onAnimZoom(event: L.ZoomAnimEvent): void;
  onZoom(): void;
  /**
   * see https://stackoverflow.com/a/67107000/1823988
   * see L.Renderer._updateTransform https://github.com/Leaflet/Leaflet/blob/master/src/layer/vector/Renderer.js#L90-L105
   * @param {L.LatLng} center
   * @param {number} zoom
   */
  updateTransform(center: L.LatLng, zoom: number): void;
}
