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
      }, {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader'
          },
        ],
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
        namespace: 'https://4chan.org',
        include: 'https://*.4chan*.org/*',
        grant: 'none'
      },
      proxyScript: {
        baseUrl: 'http://127.0.0.1:12345',
        filename: '[basename].proxy.user.js',
        enable: () => process.env.LOCAL_DEV === '1'
      }
    })
  ]
};

export default config;