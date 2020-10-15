// rollup.config.js
import typescript from 'rollup-plugin-typescript';

export default {
  input: 'src/index.ts',
  output: {
    file: 'main.js',
    format: 'cjs',
  },
  plugins: [
    typescript(),
  ],
};
