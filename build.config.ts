import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
    'src/index_vue2',
  ],
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
    json: {
      compact: true,
      namedExports: false,
      preferConst: false,
    },
    commonjs: {
      requireReturnsDefault: 'auto',
    },
    dts: {
      respectExternal: false,
    },
  },
  externals: ['vue-demi'],
  clean: true,
  declaration: true,
})
