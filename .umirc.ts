import { defineConfig } from 'dumi';
const isProduction = process.env.NODE_ENV === 'production';
export default defineConfig({
  title: 'L7-Leaflet',
  devServer: {
    port: 8080,
  },
  favicon: 'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png',
  logo: 'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png',
  outputPath: 'docs-dist',
  copy: isProduction ? ['docs/CNAME'] : [],
  // more config: https://d.umijs.org/config
});
