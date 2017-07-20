## rc-videolist-autoplay

react组件，视频列表滚动时自动播放当前屏幕内合适的一个。

### props
isWifi: 是否wifi环境，wifi环境则自动播放视频  
children: react 组件的children，可自定义除视频外的其他内容   
playCb(index): 视频播放的回调，传参当前播放视频的index  
list: 视频数据  
  {  
    videoSrc: '视频链接',
    pic: '图片链接，视频播放前显示的封面信息'
  }     