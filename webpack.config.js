//@ts-check
/// <reference types="webpack-dev-server" />
const webpack = require('webpack')
const fs = require('fs')
const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

/** @type {() => import('webpack').Configuration} */
const config = (env = {}) => {
    const isProd = env.prod
    const mode = isProd ? 'production' : 'development'
    return {
        mode,
        entry: path.resolve(__dirname, './src/main.ts'),
        target: 'web',
        devtool: isProd ? false : 'source-map',
        output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname, 'dist'),
            clean: true,
        },
        resolve: {
            extensions: ['.ts', '.js'],
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    loader: 'vue-loader',
                    options: {
                        reactivityTransform: true,
                        productionMode: isProd,
                    },
                },
                // at least esbuild-loader should be used here
                {
                    test: /\.ts$/,
                    use: [
                        {
                            loader: 'ts-loader',
                            options: {
                                appendTsSuffixTo: [/\.vue$/],
                            },
                        },
                    ],
                },
                {
                    test: /\.scss$/,
                    use: [
                        'vue-style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                url: false,
                            },
                        },
                        'sass-loader',
                    ],
                },
            ],
        },
        plugins: [
            new VueLoaderPlugin(),
            new HtmlWebpackPlugin({
                templateContent: fs
                    .readFileSync(path.join(__dirname, './index.html'), 'utf-8')
                    .replace('<script src="./src/main.ts" type="module"></script>', ''),
            }),
            new webpack.DefinePlugin({
                // just for libs
                'process.env.NODE_ENV': JSON.stringify(mode),
            }),
            ...(isProd
                ? [
                      new CopyWebpackPlugin({
                          patterns: [
                              {
                                  from: 'public',
                              },
                          ],
                      }),
                  ]
                : []),
        ],
        optimization: {
            minimize: isProd,
        },
        devServer: {
            hot: true,
        },
    }
}

module.exports = config
