require('./index.scss');
import React, { Component } from 'react';
import img from '@ali/lib-img';
let imgHelper = img({
  'class': "lib-img", //图片class
  'dataSrc': 'data-src', //图片真实src 的data字段
  'sharpen': 's0', //锐化参数
  'q': ['q90', 'q70'], //图片质量[非弱网，弱网]
  'enableLazyload': true, //是否开启懒加载功能，默认true,
  'lazyHeight': window.innerHeight, //[可选]，预加载当前屏幕以下lazyHeight内的图片，默认0
  'lazyWidth': 0, //[可选]，预加载当前屏幕右边lazyWidth内的图片，默认0
  'enalbeIOSWifiLoadMore': false, //ios&&wifi情况下 是否取消懒加载,采用一次性加载，默认false,
  'filterDomains': []//自定义过滤的域名命令，适用于不能收敛的域名url
});
export default class Page extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      playIndex: -1
    }
  }
  componentDidMount() {
    this.initVideoList();
  }
  componentDidUpdate() {
    this.initVideoList();
  }
  initVideoList() {
    this.getVideoTop();
    imgHelper.fireLazyload();
    this.setPlayVideo();
  }
  getVideoTop() {
    let videoList = this.wrap.querySelectorAll('.video-wrap');
    let topList = [];
    for(var i = 0; i < videoList.length; i++) {
      let item = videoList[i];
      let offset = item.getBoundingClientRect();
      let winHeight = window.innerHeight;
      let top = offset.top + offset.height - winHeight;
      let bottom = false;
      if ( i == 0 ) {
        top = offset.top - winHeight;
      }
      if (i == videoList.length -1) {
        bottom = offset.top + offset.height;
      }
      topList.push({
        top,
        bottom,
        index: item.getAttribute('data-index')
      })
    }
    this.state.topList = topList;
  }
  pageMove() {
    let current = new Date().getTime();
    if (this.lastMoveTime && current - this.lastMoveTime <= 100) {
      return;
    }
    this.lastMoveTime = current;
    this.setPlayVideo();
  }
  pageMoveEnd() {
    this.setPlayVideo();
  }
  setPlayVideo() {
    let topList = this.state.topList;
    if (!topList.length) {
      return;
    }
    
    let scrollTop = this.wrap.scrollTop;
    let showItem;
    // console.log(scrollTop)
    topList.map((item, index) => {
      if (scrollTop >= item.top) {
        showItem = index;
      }
      if (item.bottom && scrollTop > item.bottom) {
        showItem = index + 1;
      }
    })
    let showIndex;
    if (topList[showItem]) {
      showIndex = topList[showItem].index;
    } else {
      showIndex = -1;
    }
    if (showIndex != this.state.playIndex) {
      console.log(JSON.stringify(topList) + 'scrollTop ' + scrollTop)
      console.log('scrollTop' + scrollTop)
      console.log('showIndex' + showIndex)
      this.state.playIndex = showIndex;
      this.setPlayVideoEl(showIndex);
    }
  }
  setPlayVideoEl(playIndex) {
    let videoList = this.wrap.querySelectorAll('.video-wrap');
    for (let i = 0; i < videoList.length; i++) {
      let index = i;
      let item = videoList[i];
      let video = item.querySelector('video');
      if (index == playIndex) {
        this.addPlayVideo(item);
      } else {
        if (video) {
          this.removeVideo(item);
        }
      }
      // else if (index + 1 == playIndex || index - 1 == playIndex) {
      //   if (!video) {
      //     this.addPlayVideo(item);
      //   }
      // } 
      
    }
  }
  removeVideo(wrap) {
    let video = wrap.querySelector('video');
    if (video) {
      wrap.removeChild(video);
      let pic = wrap.querySelector('.video-pic');
      let pause = wrap.querySelector('.pause');
      pic.classList.remove('hide');
      pause.classList.remove('hide');
    }
  }
  addPlayVideo(showVideoWrap) {
    let videoSrc = showVideoWrap.getAttribute('data-video-src');
    if (!videoSrc || videoSrc == '') {
      return;
    }
    let newVideoEl = document.createElement('video');
    newVideoEl.src = videoSrc;
    newVideoEl.setAttribute('webkit-playsinline', 'webkit-playsinline');;
    newVideoEl.setAttribute('playsinline', 'playsinline');
    newVideoEl.setAttribute('muted', 'muted');
    // newVideoEl.setAttribute('autoplay', 'autoplay');
    newVideoEl.setAttribute('loop', 'loop');
    newVideoEl.setAttribute('preload', 'metadata');
    showVideoWrap.appendChild(newVideoEl);
    this.readyVideo(showVideoWrap);

    newVideoEl.addEventListener('error', (e) => {
      let target = e.target;
      removeVideo(e.target);
      window.errorTimes += 1;
      let { os = {} } = env;
      let { name, version = {} } = os;
      let param = window.errorTimes + name + '(' + version.val + ')';
      util.goldLog('mfe.public.video.play', 'H1478724973', 'type=' + param);
    }, false)
    newVideoEl.addEventListener('canplay', (e) => {
      let video = e.target;
      let wrap = video.parentNode;
      this.playVideo(wrap);
    })
  }
  readyVideo(wrap) {
    let pic = wrap.querySelector('.video-pic');
    let pause = wrap.querySelector('.pause');
    let ready = wrap.querySelector('.play-ready');
    pic.classList.add('hide');
    pause.classList.add('hide');
    ready.classList.remove('hide');
  }
  playVideo(wrap) {
    let ready = wrap.querySelector('.play-ready');
    let video = wrap.querySelector('video');
    ready.classList.add('hide');
    video.play();
  }
  render() {
    let { list = [], autoPlay = true  } = this.props;
    let { playIndex } = this.state;
    return <div className="video-list" ref={(el) => this.wrap = el}>
      {
        list.map((item, index) => {
          let { videoSrc, pic } = item;

          let videoParam = {
            videoSrc,
            pic,
            index,
            isPlay: index == playIndex
          }
          return <div className="list-item" key={index} onTouchMove={() => this.pageMove()} onTouchEnd={() => this.pageMoveEnd()}>
            <VideoContainer {...videoParam}></VideoContainer>
            { this.props.children && React.cloneElement(this.props.children, {...item}) }
          </div>
        })
      }
    </div>
  }
}

export class VideoContainer extends Component {
  render() {
    let {videoSrc, pic, index } = this.props;
    return <div className="video-wrap" data-video-src={videoSrc} data-pic-src={pic} data-index={index}>
          <p className="lib-img video-pic" data-size="750x750" data-src={pic} />
          <p className="pause hide"></p>
          <p className="play-ready"></p>
        </div>
  }
}