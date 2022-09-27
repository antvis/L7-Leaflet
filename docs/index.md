# introduction

<p align="center">
<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*BoKITowtFWwAAAAAAAAAAAAAARQnAQ" alt="l7-leaflet-info" style="width:500px;"/>
</p>
L7-leaflet a lib you can be use L7 or Leaflet. it means in L7 project you can use leafet map features and in leaflet project you can use L7 Visualistion features. L7-leaflet consists of two parts：

- L7 plugin for Lealfet，use by Leaflet
- Leafet BaseMap for L7 use by Leaflet L7

### L7

- [L7](https://github.com/antvis/l7) Large-scale WebGL-powered Geospatial data visualization analysis engine.
<p align="center">
<img src="https://camo.githubusercontent.com/9dce91a0264bc3f6eb0b54c4cb7b4911555af7206db6eb9cb9bd9a9d000e8de8/68747470733a2f2f67772e616c697061796f626a656374732e636f6d2f6d646e2f726d735f3835356261622f616674732f696d672f412a532d373351704f386430594141414141414141414141426b4152516e4151" alt="l7demo" style="width:500px;"/>
</p>

### Leaflet

<p align="center">
<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*0UvOQa_6rPcAAAAAAAAAAAAAARQnAQ" alt="l7-leaflet-info" style="width:500px;"/>
</p>

### L7 Leaflet

<p align="center">
<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*lAtVT4xvuQYAAAAAAAAAAAAAARQnAQ" alt="l7-leaflet-info" style="width:500px;"/>
</p>

### install

```
 npm install  @antv/l7-leaflet

```

or

```
<script src="https://unpkg.com/@antv/l7-leaflet"></script>

```

### L7 plugin for Lealfet use in Leaflet

```jsx pure
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LineLayer } from '@antv/l7';
import { L7Layer } from '@antv/l7-leaflet';

import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    // Init Map
    const map = L.map('map', {
      minZoom: 1,
    }).setView([30, 112], 3);

    // add tile layer

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
    ).addTo(map);

    // add Maker

    L.marker([30, 112])
      .addTo(map)
      .setIcon(
        new L.Icon({
          iconUrl:
            'https://gw.alipayobjects.com/mdn/rms_5e897d/afts/img/A*6ONoRKNECC0AAAAAAAAAAAAAARQnAQ',
          iconSize: [16, 16],
        }),
      )
      .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
      .openPopup();

    // add L7Layer
    const l7layer = new L7Layer().addTo(map);
    const scene = l7layer.getScene();

    fetch('https://gw.alipayobjects.com/os/rmsportal/UEXQMifxtkQlYfChpPwT.txt')
      .then((res) => res.text())
      .then((data) => {
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
        scene.addLayer(layer);
      });
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
```

### Leafet BaseMap for L7 use in L7

```jsx pure
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
```
