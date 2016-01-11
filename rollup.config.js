import babel from 'rollup-plugin-babel';
import npm from 'rollup-plugin-npm';
import commonjs from 'rollup-plugin-commonjs';

export default {
    entry: 'src/index.js'
  , format: 'umd'
  , dest: 'build/knockout-jsonapi-utils.js'
  , moduleName: 'KnockoutJsonApiUtils'
  , globals: {
      ko: 'knockout'
    , moment: 'moment'
  }
  , plugins: [
    babel({
        presets: ["es2015-rollup"]
      , exclude: 'node_modules/**'
    }),
    npm({
        jsnext: true
      , main: true
      , skip: ['knockout', 'moment']
    }),
    commonjs({
      include: 'node_modules/**/*'
    })
  ]
};
