"use strict";
const path = require('path');
const webpack = require('webpack');
let UglifyJSPlugin = require('uglifyjs-webpack-plugin');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
    entry:{
        app:'./webApp/bootstrap-jit.ts',
        vendor:[
            'core-js/client/shim.min.js',
            'lodash',
            'rxjs'
        ]
    },
    output: {
        filename: '[name].bundle.js',//.[hash]
        path: path.resolve(__dirname, './dist/')
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use:[{
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true
                    }
                }],
            },
            {
                 test: /\.html$/,
                 exclude: /node_modules/,
                 use:[{
                    loader: 'html-loader',
                }],
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.css'],
        alias: {
            "lodash": "lodash/lodash.min.js",
            "rxjs": "rxjs"
        }
    },
    plugins:[
		new UglifyJSPlugin({
			comments      : false,
			mangle		  : true,
            sequences     : true,  // join consecutive statemets with the “comma operator”
            properties    : true,  // optimize property access: a["foo"] → a.foo
            dead_code     : true,  // discard unreachable code
            drop_debugger : true,  // discard “debugger” statements
            unsafe        : false, // some unsafe optimizations (see below)
            conditionals  : true,  // optimize if-s and conditional expressions
            comparisons   : true,  // optimize comparisons
            evaluate      : true,  // evaluate constant expressions
            booleans      : true,  // optimize boolean expressions
            loops         : true,  // optimize loops
            unused        : true,  // drop unused variables/functions
            hoist_funs    : true,  // hoist function declarations
            hoist_vars    : false, // hoist variable declarations
            if_return     : true,  // optimize if-s followed by return/continue
            join_vars     : true,  // join var declarations
            cascade       : true,  // try to cascade `right` into `left` in sequences
            side_effects  : true,  // drop side-effect-free statements
            warnings      : true,  // warn about potentially dangerous optimizations/code
            global_defs   : {}     // global definitions
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            filename: "vendor.bundle.js"
        }),
        new CopyWebpackPlugin([
            { from: './webApp/resources', to: 'resources' }
        ]),
        // new ExtractTextPlugin({
        //   filename: '[name].css'
        // }),
        new HtmlWebpackPlugin({
            template: './index.html',
            filename:'dist.html'
        })
    ]
};