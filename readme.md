## rc-videolist-autoplay

react组件，视频列表滚动时自动播放当前屏幕内合适的一个。

### props
autoPlay: 是否自动播放，默认true, 一般wifi环境则自动播放视频
clickPlay: 是否点击播放视频，如果不是，则可以监听
children: react 组件的children，可自定义除视频外的其他内容   
playCb(index): 视频播放的回调，传参当前播放视频的index
clickCb(item): 点击视频回调   
list: 视频数据  
  {  
    videoSrc: '视频链接',
    pic: '图片链接，视频播放前显示的封面信息'
  }     