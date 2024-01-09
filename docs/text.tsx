import { Scene, PointLayer } from '@antv/l7';
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
      ).addTo(scene.map as L.Map);

      fetch('https://gw.alipayobjects.com/os/rmsportal/oVTMqfzuuRFKiDwhPSFL.json')
        .then((res) => res.json())
        .then((data) => {
          const pointLayer = new PointLayer({})
            .source(data.list, {
              parser: {
                type: 'json',
                x: 'j',
                y: 'w',
              },
            })
            .shape('m', 'text')
            .size(12)
            .color('#084081')
            .style({
              textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
              textOffset: [0, 0], // 文本相对锚点的偏移量 [水平, 垂直]
              spacing: 2, // 字符间距
              padding: [1, 1], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
              stroke: '#ffffff', // 描边颜色
              strokeWidth: 2, // 描边宽度
              strokeOpacity: 1.0,
              // rotation: 60, // 常量旋转
              rotation: {
                // 字段映射旋转
                field: 't',
                value: [30, 270],
              },
              textAllowOverlap: true, // 是否允许文本重复标注
            });

          scene.addLayer(pointLayer);
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
