const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/index.js',
    mode: 'development',
    output: {
        publicPath: 'dist/',
        filename: 'phylo.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'PhyloIO',
    },
    resolve: {
        fallback: {
            crypto: require.resolve("crypto-browserify"),
            stream: require.resolve("stream-browserify"),
            assert: require.resolve("assert"),
            http: require.resolve("stream-http"),
            https: require.resolve("https-browserify"),
            os: require.resolve("os-browserify"),
            url: require.resolve("url"),
            buffer: require.resolve("buffer"),
            process: require.resolve("process/browser"),
            vm: require.resolve("vm-browserify"),
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
        }),
        new webpack.DefinePlugin({
            global: 'globalThis',
            'global.Buffer': ['buffer', 'Buffer'],
        }),
    ],
    optimization: {
        splitChunks: false,      // disable vendor splitting
        runtimeChunk: false      // disable runtime chunk
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/'
                        }
                    }
                ]
            },
            {
                test: /worker_.*\.js$/,
                use: {
                    loader: 'worker-loader',
                    options: {
                        inline: 'fallback',
                        filename: '[name].[contenthash].worker.js'
                    }
                }
            }
        ],
    },
};