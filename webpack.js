var path = require('path')
var webpack = require('webpack')
var autoprefixer = require('autoprefixer')
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var pagelist = {
  index: './test/src/index.js',
}

var entryList = {};
for(var i in pagelist) {
  var src = pagelist[i];
  if (process.env.NODE_ENV === 'production') {
    entryList[i] = [src];
  } else {
   entryList[i] = [
      'webpack-dev-server/client?http://dev.wapa.taobao.com',
      'webpack/hot/only-dev-server',
      'react-hot-loader/patch',
      src
   ];
  }
}

var config = {
  entry: entryList,
  output: {
      path: path.join(__dirname, 'dist'),
      filename: '[name].js',
      publicPath: '/dist/'
  },
  resolve: {
      extensions: ['.scss','.jsx','.js']
  },
  module: {
    rules: [
      {
        test: /.(js|jsx)?$/,
        include: [path.join(__dirname, '/')],
        loaders: ['babel-loader']
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=10000'
      },
      {
        test: /\.(css)$/,
        loaders: ['style-loader', 'css-loader', 'resolve-url-loader']
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    // 抽离重复plguin
    // new webpack.optimize.DedupePlugin(),
    new webpack.LoaderOptionsPlugin({
      test: /\.scss$/,
      debug: true,
      options: {
        postcss: [
          autoprefixer({
            browsers: ['last 2 versions', 'safari 5', 'ios 6', 'android 4']
          })
        ],
        context: path.join(__dirname, 'css'),
        output: {
          path: path.join(__dirname, 'build')
        }
      }
    })
  ],
  devtool: 'cheap-module-eval-source-map',
}

if (process.env.NODE_ENV === 'production') {
    delete config.devtool;
    config.output.path = path.join(__dirname, 'build');
    config.output.publicPath = '/build/';
    config.module.rules.push({
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
          'css-loader',
          'postcss-loader',
          'px2rem-loader',
          'resolve-url-loader',
          'sass-loader?sourceMap&outputStyle=expanded'
        ]
      })
    })
    config.plugins.push(new ExtractTextPlugin("[name].css"));
} else {
  config.module.rules.push({
    test: /\.scss$/,
    loaders: [
      'style-loader', 
      'css-loader', 
      'postcss-loader',
      'px2rem-loader',
      'sass-loader?sourceMap&outputStyle=expanded'
    ]
  })
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
}

module.exports = config;