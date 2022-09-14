import { Scene, LineLayer } from '@antv/l7';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Map } from '@antv/l7-leaflet';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new Map({
        pitch: 0,
        center: [112, 37.8],
        zoom: 3,
        minZoom: 1,
      }),
    });
    scene.on('loaded', () => {
      fetch('https://gw.alipayobjects.com/os/rmsportal/UEXQMifxtkQlYfChpPwT.txt')
        .then((res) => res.text())
        .then((data) => {
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
          ).addTo(scene.map);
          const mapLabelType = 'cva';
          L.tileLayer(
            'https://t{s}.tianditu.gov.cn/' +
              mapLabelType +
              '_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=' +
              mapLabelType +
              '&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=b72aa81ac2b3cae941d1eb213499e15e',
            {
              subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
            },
          ).addTo(scene.map);

          L.marker([37.8, 112])
            .addTo(scene.map)
            .setIcon(
              new L.Icon({
                iconUrl:
                  'https://gw.alipayobjects.com/mdn/rms_5e897d/afts/img/A*6ONoRKNECC0AAAAAAAAAAAAAARQnAQ',
                iconSize: [16, 16],
              }),
            )
            .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
            .openPopup();
          const layer = new LineLayer({})
            .source(data, {
              parser: {
                type: 'csv',
                x: 'lng1',
                y: 'lat1',
                x1: 'lng2',
                y1: 'lat2',
              },
            })
            .size(1)
            .shape('arc')
            .color('#8C1EB2')
            .style({
              opacity: 0.8,
              blur: 0.99,
            });
          console.log(scene);
          scene.addLayer(layer);
        });
    });

    return () => {
      scene.destroy();
    };
  }, []);

  return (
    <div
      id="map"
      style={{
        height: '500px',
        position: 'relative',
      }}
    />
  );
};
