import { useEffect, useState } from 'react';
import L from 'leaflet';
import React from 'react';
import { useRef } from 'react';
import { PointLayer, Scene } from '@antv/l7';
import { L7Layer } from '@antv/l7-leaflet';

export default () => {
  const [lat, setLat] = useState<number>(0);
  const [lng, setLng] = useState<number>(0);
  function setLngLat(e: any) {
    const lnglat = e.lngLat ?? e.lnglat ?? e.latlng;
    setLat(lnglat.lat);
    setLng(lnglat.lng);
  }
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!container.current) return;
    const map = L.map(container.current, {
      minZoom: 1,
      center: [24.48, 118.08],
      zoom: 12,
    });
    console.log(map);

    const mapType = 'vec';
    L.tileLayer(
      'https://t{s}.tianditu.gov.cn/' +
        mapType +
        '_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=' +
        mapType +
        '&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=b72aa81ac2b3cae941d1eb213499e15e',
      {
        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
        attribution:
          '&copy; <a href="http://lbs.tianditu.gov.cn/home.html">天地图 GS(2022)3124号 - 甲测资字1100471</a>',
      },
    ).addTo(map);
    const feature: GeoJSON.Feature = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: [118.08, 24.5, 0],
      },
    };
    const fc: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: [feature],
    };
    const l7layer = new L7Layer({}).addTo(map);
    const scene = l7layer.getScene() as Scene;
    console.log(scene);
    scene.on('loaded', () => {
      scene.on('mousemove', setLngLat);
      const controlLayer = new PointLayer();
      controlLayer.source(fc).color('red').size(15).shape('circle');
      scene.addLayer(controlLayer);
    });
  }, [container]);

  return (
    <div>
      <div>红点的坐标是：118.08, 24.5</div>
      <div>
        监听坐标{lng}，{lat}
      </div>
      <div
        ref={container}
        style={{
          height: '500px',
          position: 'relative',
        }}
      />
    </div>
  );
};
