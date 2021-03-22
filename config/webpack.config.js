const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack');
const path = require('path');


module.exports = (env) => {
  return {
    mode: env.production ? "production" : "development",
    entry: './src/index.ts',
    devtool: env.production ? 'source-map' : 'eval',
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.(scss|css)$/,
          use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    output: {
      filename: 'tour-player.js',
      path: path.resolve(__dirname, '../', 'build'),
    },
    plugins: [
      ...(env.production ? [] : [
        new HtmlWebpackPlugin({
          template: "src/index.html",
          hash: true,
          filename: 'index.html'
        }),
        new webpack.HotModuleReplacementPlugin(),
      ]),

      new webpack.DefinePlugin({
        'process.env.production': env.production,
        'process.env.development': env.development,
      })
    ],
    devServer: {
      host: 'localhost',
      port: 3030,
      static: true,
      open: true,
      hot: true
    },
  };
};
