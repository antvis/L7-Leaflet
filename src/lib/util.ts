import * as L from 'leaflet';
import { ISceneConfig, Scene } from '@antv/l7';
import { Map } from '../';
function getViewState(map: L.Map) {
  return {
    longitude: map.getCenter().lng,
    latitude: map.getCenter().lat,
    zoom: map.getZoom() - 1,
    pitch: 0,
    bearing: 0,
  };
}

export function createL7Instance(
  map: L.Map,
  container: HTMLDivElement,
  scene: Scene | undefined,
  props: Omit<ISceneConfig, 'id' | 'map'>,
) {
  if (!scene) {
    const viewState = getViewState(map);
    scene = new Scene({
      ...props,
      id: container,
      map: new Map({
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

export function updateL7View(scene: Scene, map: L.Map) {
  const viewState = getViewState(map);
  //   scene.map.jumpTo({
  //     center: [viewState.longitude, viewState.latitude],
  //     zoom: viewState.zoom,
  // });
  const size = map.getSize();
  // @ts-ignore
  scene.getMapService().updateView({
    viewportWidth: size.x,
    viewportHeight: size.y,
    center: [viewState.longitude, viewState.latitude],
    zoom: viewState.zoom,
  });
}
