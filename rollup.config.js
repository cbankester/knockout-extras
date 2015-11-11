import babel from 'rollup-plugin-babel';
import npm from 'rollup-plugin-npm';
import commonjs from 'rollup-plugin-commonjs';

export default {
  entry: 'src/index.js',
  dest: 'build/index.js',
  format: 'umd',
  exports: 'default',
  moduleName: 'KnockoutJsonApiUtils',
  globals: {
    ko: 'ko',
    moment: 'moment',
    'fraction.js': 'Fraction',
    'humanize-duration': 'humanizeDuration'
  },
  plugins: [
    babel(),
    npm({jsnext: true, main: true}),
    commonjs({
      include: 'node_modules/**/*'
    })
  ]
};
