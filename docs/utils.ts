import * as L from 'leaflet';

export function addBaseLayer(mapType: string, map: L.Map) {
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
}
