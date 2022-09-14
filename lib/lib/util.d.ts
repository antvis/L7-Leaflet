import * as L from 'leaflet';
import { Scene } from '@antv/l7';
export declare function createL7Instance(
  map: L.Map,
  container: HTMLDivElement,
  scene: Scene,
): Scene;
export declare function updateL7View(scene: Scene, map: L.Map): void;
