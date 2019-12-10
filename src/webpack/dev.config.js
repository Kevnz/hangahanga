const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const baseConfig = require('./config')

const configs = {}

Object.keys(process.env).map(k => {
  configs[k] = `"${process.env[k]}"`
})

const devConfig = {
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new webpack.DefinePlugin({
      process: {
        env: {
          ...configs,
          NODE_ENV: '"development"',
        },
      },
    }),
    new HtmlWebpackPlugin({
      title: 'Web App',
      template: './src/ui/index.html',
    }),
  ],
  devServer: {
    historyApiFallback: true,
    contentBase: './src/public',
    hot: true,
    proxy: {
      '/api': 'http://localhost:3001/',
    },
  },
}

module.exports = {
  ...baseConfig,
  ...devConfig,
}
