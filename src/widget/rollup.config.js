import { config } from 'dotenv'
import { terser } from 'rollup-plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import resolve, { nodeResolve } from '@rollup/plugin-node-resolve'
import cleanup from 'rollup-plugin-cleanup'
import serve from 'rollup-plugin-serve'
import alias from '@rollup/plugin-alias'
import exBuiltins from 'builtin-modules'
import builtins from 'rollup-plugin-node-builtins'
import replace from '@rollup/plugin-replace'
import globals from 'rollup-plugin-node-globals'
import strip from '@rollup/plugin-strip'
import htmlTemplate from './build/generate-html-template'
import copy from 'rollup-plugin-copy'
import vue from 'rollup-plugin-vue'
import image from '@rollup/plugin-image'
import json from '@rollup/plugin-json'
import postcss from 'rollup-plugin-postcss'; // v4.0.0
import typescript from '@rollup/plugin-typescript';

const isProduction = process.env.BUILD === 'production';

// This json will attach all configurations in .env file.
const processClone = {
  env: {
    ...config({
      path: isProduction ? '.env' : '.env.local'
    }).parsed // attached the .env config
  }
}; 
// How to use json? i.e: __process.env.VUE_APP_ROOT_API

const processEnv = processClone.env;

// To use any .env vars, must be set bellow config() in processClone
const sourcePath = './src/widget'; // processEnv.WIDGET_SRC_PATH;
const outputPath = './dist-widget'; // processEnv.WIDGET_DIST_PATH;

const plugins = [];
if (isProduction) {
  plugins.push(terser()) // Production minify
  if (processEnv.WIDGET_DEBUG_MODE !== 'true') { // disable debug
    plugins.push(strip()) // Production remove console log
  }
} else {
  plugins.push(serve({
    contentBase: [`${outputPath}`],
    port: 8484,
    headers: { // Add CORS to local serve
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    }
  }));
}

const extensions = ['.mjs', '.js', '.json', '.node', '.vue', '.jsx', '.ts', '.tsx']
const standard_plugins = [
  alias({
    entries: {
      // resolve: ['.js', '.vue', '.json', '.ts'],
      fs: 'fs'
    }
  }),
  replace({
    preventAssignment: true,
    __process: JSON.stringify(processClone),
  }),
  nodeResolve({
    browser: true,
    preferBuiltins: false
  }),
  typescript({lib: ["es5", "es6", "dom"], target: "ES2017"}),
  commonjs({ extensions: ['.js', '.ts'] }),
  resolve({
    mainFields: ['module', 'main', 'jsnext:main', 'browser'],
    extensions
  }),
  globals(),
  builtins(),
  ...plugins,
  cleanup({
    comments: 'none'
  })
]

export default [{ // Bundle external files
  input: [
    `${sourcePath}/src/main.ts`,
    `${sourcePath}/src/socket.ts`,
    `${sourcePath}/src/tracking.ts`
  ],
  external: exBuiltins,
  output: {
    sourcemap: false,
    sourcemapExcludeSources: true,
    dir: `${outputPath}`,
    format: 'es',
    // plugins: [terser()], // minify
    // file: isProduction ? 'bundle[hash].min.js' : 'dist/bundle.js'
  },
  plugins: [
    htmlTemplate({
      attrs: ['async'],
      template: `${sourcePath}/public/index.html`,
      target: `${outputPath}/index.html`,
      suffix: `?org_id=${processEnv.WIDGET_DEMO_ORG_ID}&workspace_id=${processEnv.WIDGET_DEMO_WS_ID}&domain=${processEnv.WIDGET_DEMO_DOMAIN}&is_demo=${processEnv.WIDGET_DEMO_MODE}`
    }),
    ...standard_plugins
  ]
},
{ // Bundle widget script
  input: `${sourcePath}/src/main-widget.ts`,
  external: exBuiltins,
  // inlineDynamicImports: true,
  output: {
    sourcemap: false,
    sourcemapExcludeSources: true,
    format: 'es',
    // file: isProduction ? 'bundle-widget[hash].min.js' : 'dist/bundle-widget.js'
    file: `${outputPath}/bundle-widget.js`
  },
  plugins: [
    image(),
    json({
      compact: true
    }),
    vue({
      preprocessStyles: true,
    }),
    postcss({
      modules: {},
    }),
    copy({
      targets: [{
        src: `${sourcePath}/public/emoji.png`,
        dest: `${outputPath}`
        //  }, {
        // 		src: `${sourcePath}/public/icons/*`,
        // 		dest: `${outputPath}/icons`
        // 	}, {
        // 		src: `${sourcePath}/public/sounds/*`,
        // 		dest: `${outputPath}/sounds`
      }]
    }),
    ...standard_plugins
  ]
}
]
