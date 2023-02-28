import  resolve  from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import postcss from "rollup-plugin-postcss";
import autoprefixer from 'autoprefixer';
import cssnano from "cssnano"
export default {
  input: './src/index.ts',
  output:[
    {
      dir: 'dist',
      format: 'umd',
      entryFileNames: '[name].umd.js',
      name: "captcha",
     
    },
        {
          dir: 'dist',
          format: 'cjs',
          entryFileNames: '[name].cjs.js',
        },
        {
          dir: 'dist',
          format: 'esm',
          entryFileNames: '[name].esm.js',
        }
  ],
   plugins: [resolve(), commonjs(), typescript(),postcss({
   
   plugins:[autoprefixer(),cssnano()],
  })],
};


  
