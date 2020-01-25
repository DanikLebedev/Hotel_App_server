const path = require('path');
const nodeExternals = require('webpack-node-externals');
const {
    NODE_ENV = 'development',
} = process.env;
module.exports = {
    entry: './src/index.ts',
    mode: NODE_ENV,
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'index.scss.js'
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    'ts-loader',
                ]
            },
        ]
    },
    plugins: [

    ],
    externals: [nodeExternals()],
}