import * as path from 'path';
import * as webpack from 'webpack';
import WebpackUserscript from 'webpack-userscript';

const dev = process.env.NODE_ENV === 'development';

const config: webpack.Configuration = {
  mode: dev ? 'development' : 'production',
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'wojaker.bundle.js'
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist')
  },
  plugins: [
    new WebpackUserscript({
      headers: {
        version: dev ? `[version]-build.[buildNo]` : `[version]`,
        match: 'https://*.4chan*.org/*'
      }
    })
  ]
};

export default config;