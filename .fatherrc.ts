export default {
  // more father 4 config: https://github.com/umijs/father-next/blob/master/docs/config.md
  esm: {
    output: 'es',
  },
  cjs: {
    output: 'lib',
  },
  umd: {
    output: 'dist',
    externals: {
      leaflet: 'L',
      '@antv/l7': 'L7',
    },
  },
};
