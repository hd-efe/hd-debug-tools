const pkg = require('./package.json');
const Webpack = require('webpack');
const Path = require('path');

module.exports = {
  mode: 'production',
  devtool: false,
  entry: {
    debugger : Path.resolve(__dirname, './src/debugger.js')
  },
  output: {
    path: Path.resolve(__dirname, './dist'),
    filename: '[name].min.js',
    library: 'Debugger',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.html$/, loader: 'html-loader?minimize=false'
      },
      { 
        test: /\.js$/, loader: 'babel-loader'
      },
      {
        test: /\.less$/,
        loader: 'style-loader!css-loader!less-loader'
      }
    ]
  },
  stats: {
    colors: true,
  },
  plugins: [
    new Webpack.BannerPlugin([
        'Debugger v' + pkg.version,
        '',
        'Hundun is pleased to support the open source community by making Debugger available.',
        'Copyright (C) 2017 THL A29 Limited, a Hundun company. All rights reserved.',
        'Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at',
        'http://opensource.org/licenses/MIT',
        'Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.'
    ].join('\n')),
  ]
};