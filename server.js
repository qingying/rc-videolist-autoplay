var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack');
var c = require('child_process');
var child_process = require("child_process"),
  url = "http://dev.wapa.taobao.com/test/index.html";
var open = require('open');
var cmd;

if(process.platform == 'wind32'){

  cmd  = 'start "%ProgramFiles%\Internet Explorer\iexplore.exe"';

}else if(process.platform == 'linux'){

  cmd  = 'xdg-open';

}else if(process.platform == 'darwin'){

  cmd  = 'open';

}

// https: 443 http: 80
new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    https: false,
    hot: true,
    stats: {
      colors: true
    },
    historyApiFallback: true
}).listen(80, '127.0.0.1', function (err, result) {
        if (err) {
            console.log(err);
        }
        // child_process.exec(cmd + ' "'+url + '"');
        open(url)
    });
