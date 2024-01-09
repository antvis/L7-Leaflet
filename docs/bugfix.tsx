import { useEffect } from 'react';
import L from 'leaflet';
import React from 'react';
import { useRef } from 'react';
import { Scene, PointLayer } from '@antv/l7';
import { L7Layer } from '@antv/l7-leaflet';
import { addBaseLayer } from './utils';
export default () => {
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!container.current) return;
    const map = L.map(container.current, {
      minZoom: 1,
      center: [24.48, 118.08],
      zoom: 12,
    });
    addBaseLayer('vec', map);
    addBaseLayer('cva', map);
    const fc: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: [118.08, 24.5, 0],
          },
        },
      ],
    };
    const l7layer = new L7Layer({}).addTo(map);
    const scene = l7layer.getScene() as Scene;
    scene.on('loaded', () => {
      const layer = new PointLayer();
      layer.source(fc).color('red').size(15).shape('circle');
      scene.addLayer(layer);
      layer.on('unclick', (e: unknown) => {
        console.log(e);
      });
    });
  }, [container]);

  return (
    <div
      ref={container}
      style={{
        height: '500px',
        position: 'relative',
      }}
    />
  );
};
