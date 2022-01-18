const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/main.js',
    devtool: 'source-map',
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        }),
        new CopyWebpackPlugin({
            patterns: [
                {from: 'src/models/TreeTexture.png', to: 'TreeTexture.png'},
                {from: 'src/gltf/Vehicle_11.bin', to: 'Vehicle_11.bin'}
            ]
        }),
    ],
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.(glsl|vert|frag)$/,
                use: 'raw-loader',
            },
            {
                test: /\.(glb|png|svg|jpg|gif|dae|gltf|bin)$/,
                use: 'file-loader',
            }
        ],
    }
};
