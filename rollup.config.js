import babel from 'rollup-plugin-babel';
import npm from 'rollup-plugin-npm';
import commonjs from 'rollup-plugin-commonjs';

export default {
  entry: 'src/index.js',
  format: 'umd',
  dest: 'build/knockout-jsonapi-utils.js',
  moduleName: 'KnockoutJsonApiUtils',
  globals: {
    ko: 'ko',
    moment: 'moment'
  },
  plugins: [
    babel({
      plugins: ["transform-es2015-classes", "external-helpers-2"],
      exclude: 'node_modules/**'
    }),
    npm({
      jsnext: true,
      main: true,
      skip: ['ko', 'moment']
    }),
    commonjs({
      include: 'node_modules/**/*',
    })
  ]
};
