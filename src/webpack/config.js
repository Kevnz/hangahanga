require('xtconf')()
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const cssLoader = 'css-loader'
module.exports = {
  entry: './src/ui/index.js',
  module: {
    rules: [
      {
        test: /\.(mjs|js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.module\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: cssLoader,
            options: {
              modules: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        exclude: /\.module.(s(a|c)ss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: cssLoader,
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              // options...
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.mjs', '.js', '.jsx'],
    modules: ['node_modules', 'src'],
    alias: {},
  },
  output: {
    path: path.join(__dirname, '/dist'),
    publicPath: '/',
    filename: 'bundle.js',
  },
}
