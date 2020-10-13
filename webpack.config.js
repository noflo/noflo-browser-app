const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    app: './app.js',
    test: './node_modules/noflo-runtime-headless/spec/build/webpack.entry.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  mode: 'production',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /noflo([\\]+|\/)lib([\\]+|\/)loader([\\]+|\/)register.js$/,
        use: [
          {
            loader: 'noflo-component-loader',
            options: {
              graph: null,
              debug: true,
              baseDir: __dirname,
              manifest: {
                runtimes: ['noflo'],
                discover: true,
              },
              runtimes: [
                'noflo',
                'noflo-browser',
              ],
            },
          },
        ],
      },
      {
        test: /\.s$/,
        // exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.coffee$/,
        use: [
          {
            loader: 'coffee-loader',
            options: {
              transpile: {
                presets: ['@babel/preset-env'],
              },
            },
          },
        ],
      },
      {
        test: /\.fbp$/,
        use: [
          {
            loader: 'fbp-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'assets/*.html',
          flatten: true,
        },
        {
          from: 'assets/*.css',
          flatten: true,
        },
      ],
    }),
    new webpack.ProvidePlugin({
      process: ['process'],
    }),
  ],
  resolve: {
    extensions: ['.coffee', '.js'],
    fallback: {
      assert: false,
      constants: false,
      fs: false,
      os: false,
      path: require.resolve('path-browserify'),
      util: require.resolve('util/'),
    },
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    host: process.env.HOST || 'localhost',
    port: 8080,
    inline: true,
  },
};
