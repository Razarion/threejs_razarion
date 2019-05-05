const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/main.js',
    devtool: 'source-map',
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: 'src/index.html'
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
                test: /\.(png|svg|jpg|gif|dae)$/,
                use: 'file-loader',
            },
            {
                test: /\.(png|tga)$/,
                include: [
                    path.resolve(__dirname, "src/models")
                ],
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                    },
                }
            }

        ],
    }
};
