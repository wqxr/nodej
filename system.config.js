SystemJS.config({
  typescriptOptions:{
    path:"./tsconfig.json",
  },
  meta:{
    './node_modules/core-js/client/shim.min.js': {
      format: 'global', // load this module as a global
    },
    './node_modules/echarts/dist/echarts.common.js': {
      format: 'cjs', // load this module as a global
    },
  },
  packages: {
    "ts": {
      "main": "plugin.js"
    },
    "typescript": {
      "main": "lib/typescript.js",
      "meta": {
        "lib/typescript.js": {
          "exports": "ts"
        }
      }
    },
    "webApp": {
      "defaultExtension": "ts",
    },
    "rxjs": {
      "main": "Rx.js",
      "defaultExtension": 'js'
    },
    "core-js":{
      "defaultExtension": 'js'
    },
    "zone.js":{
      "main": "dist/zone.js",
      "defaultExtension": 'js'
    },
    "webAppDist":{
      "main": "bootstrap-jit",
      "defaultExtension": 'js'
    },
    "electron":{
      "main": "index",
      "defaultExtension": 'js'
    },
    "lodash":{
      "main":"lodash.min",
      "defaultExtension": 'js'
    },
    "echarts":{
      "main": "dist/echarts.common.js",
      "defaultExtension": 'js'
    }
  },
  "map":{
    "ts": "./node_modules/plugin-typescript/lib",
    "typescript": "./node_modules/typescript",
    'rxjs':'./node_modules/rxjs',
    'zone.js':'./node_modules/zone.js',
    'core-js':'./node_modules/core-js',
    '@angular/common': './node_modules/@angular/common/bundles/common.umd.js',
    '@angular/compiler': './node_modules/@angular/compiler/bundles/compiler.umd.js',
    '@angular/forms': './node_modules/@angular/forms/bundles/forms.umd.js',
    '@angular/core': './node_modules/@angular/core/bundles/core.umd.js',
    '@angular/platform-browser': './node_modules/@angular/platform-browser/bundles/platform-browser.umd.js',
    '@angular/platform-browser-dynamic': './node_modules/@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
    'electron':'./node_modules/electron',
    'lodash': 'node_modules/lodash',
    'echarts':'./node_modules/echarts',
  },
  //transpiler: 'ts',
});

SystemJS.import("webAppDist")
.catch(function(e){
  console.log(e);
});