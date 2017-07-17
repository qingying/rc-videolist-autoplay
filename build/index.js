'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VideoContainer = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _libImg = require('@ali/lib-img');

var _libImg2 = _interopRequireDefault(_libImg);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

require('./index.scss');

var imgHelper = (0, _libImg2.default)({
  'class': "lib-img", //图片class
  'dataSrc': 'data-src', //图片真实src 的data字段
  'sharpen': 's0', //锐化参数
  'q': ['q90', 'q70'], //图片质量[非弱网，弱网]
  'enableLazyload': true, //是否开启懒加载功能，默认true,
  'lazyHeight': window.innerHeight, //[可选]，预加载当前屏幕以下lazyHeight内的图片，默认0
  'lazyWidth': 0, //[可选]，预加载当前屏幕右边lazyWidth内的图片，默认0
  'enalbeIOSWifiLoadMore': false, //ios&&wifi情况下 是否取消懒加载,采用一次性加载，默认false,
  'filterDomains': [] //自定义过滤的域名命令，适用于不能收敛的域名url
});

var Page = function (_Component) {
  _inherits(Page, _Component);

  function Page(props, context) {
    _classCallCheck(this, Page);

    var _this = _possibleConstructorReturn(this, (Page.__proto__ || Object.getPrototypeOf(Page)).call(this, props, context));

    _this.state = {
      playIndex: -1
    };
    return _this;
  }

  _createClass(Page, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.initVideoList();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.initVideoList();
    }
  }, {
    key: 'initVideoList',
    value: function initVideoList() {
      this.getVideoTop();
      imgHelper.fireLazyload();
      this.setPlayVideo();
    }
  }, {
    key: 'getVideoTop',
    value: function getVideoTop() {
      var videoList = this.wrap.querySelectorAll('.video-wrap');
      var topList = [];
      for (var i = 0; i < videoList.length; i++) {
        var item = videoList[i];
        var offset = item.getBoundingClientRect();
        var winHeight = window.innerHeight;
        var top = offset.top + offset.height - winHeight;
        var bottom = false;
        if (i == 0) {
          top = offset.top - winHeight;
        }
        if (i == videoList.length - 1) {
          bottom = offset.top + offset.height;
        }
        topList.push({
          top: top,
          bottom: bottom,
          index: item.getAttribute('data-index')
        });
      }
      this.state.topList = topList;
    }
  }, {
    key: 'pageMove',
    value: function pageMove() {
      var current = new Date().getTime();
      if (this.lastMoveTime && current - this.lastMoveTime <= 100) {
        return;
      }
      this.lastMoveTime = current;
      this.setPlayVideo();
    }
  }, {
    key: 'pageMoveEnd',
    value: function pageMoveEnd() {
      this.setPlayVideo();
    }
  }, {
    key: 'setPlayVideo',
    value: function setPlayVideo() {
      var topList = this.state.topList;
      if (!topList.length) {
        return;
      }

      var scrollTop = this.wrap.scrollTop;
      var showItem = void 0;
      // console.log(scrollTop)
      topList.map(function (item, index) {
        if (scrollTop >= item.top) {
          showItem = index;
        }
        if (item.bottom && scrollTop > item.bottom) {
          showItem = index + 1;
        }
      });
      var showIndex = void 0;
      if (topList[showItem]) {
        showIndex = topList[showItem].index;
      } else {
        showIndex = -1;
      }
      if (showIndex != this.state.playIndex) {
        console.log(JSON.stringify(topList) + 'scrollTop ' + scrollTop);
        console.log('scrollTop' + scrollTop);
        console.log('showIndex' + showIndex);
        this.state.playIndex = showIndex;
        this.setPlayVideoEl(showIndex);
      }
    }
  }, {
    key: 'setPlayVideoEl',
    value: function setPlayVideoEl(playIndex) {
      var videoList = this.wrap.querySelectorAll('.video-wrap');
      for (var i = 0; i < videoList.length; i++) {
        var index = i;
        var item = videoList[i];
        var video = item.querySelector('video');
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
  }, {
    key: 'removeVideo',
    value: function removeVideo(wrap) {
      var video = wrap.querySelector('video');
      if (video) {
        wrap.removeChild(video);
        var pic = wrap.querySelector('.video-pic');
        var pause = wrap.querySelector('.pause');
        pic.classList.remove('hide');
        pause.classList.remove('hide');
      }
    }
  }, {
    key: 'addPlayVideo',
    value: function addPlayVideo(showVideoWrap) {
      var _this2 = this;

      var videoSrc = showVideoWrap.getAttribute('data-video-src');
      if (!videoSrc || videoSrc == '') {
        return;
      }
      var newVideoEl = document.createElement('video');
      newVideoEl.src = videoSrc;
      newVideoEl.setAttribute('webkit-playsinline', 'webkit-playsinline');;
      newVideoEl.setAttribute('playsinline', 'playsinline');
      newVideoEl.setAttribute('muted', 'muted');
      // newVideoEl.setAttribute('autoplay', 'autoplay');
      newVideoEl.setAttribute('loop', 'loop');
      newVideoEl.setAttribute('preload', 'metadata');
      showVideoWrap.appendChild(newVideoEl);
      this.readyVideo(showVideoWrap);

      newVideoEl.addEventListener('error', function (e) {
        var target = e.target;
        removeVideo(e.target);
        window.errorTimes += 1;
        var _env = env,
            _env$os = _env.os,
            os = _env$os === undefined ? {} : _env$os;
        var name = os.name,
            _os$version = os.version,
            version = _os$version === undefined ? {} : _os$version;

        var param = window.errorTimes + name + '(' + version.val + ')';
        util.goldLog('mfe.public.video.play', 'H1478724973', 'type=' + param);
      }, false);
      newVideoEl.addEventListener('canplay', function (e) {
        var video = e.target;
        var wrap = video.parentNode;
        _this2.playVideo(wrap);
      });
    }
  }, {
    key: 'readyVideo',
    value: function readyVideo(wrap) {
      var pic = wrap.querySelector('.video-pic');
      var pause = wrap.querySelector('.pause');
      var ready = wrap.querySelector('.play-ready');
      pic.classList.add('hide');
      pause.classList.add('hide');
      ready.classList.remove('hide');
    }
  }, {
    key: 'playVideo',
    value: function playVideo(wrap) {
      var ready = wrap.querySelector('.play-ready');
      var video = wrap.querySelector('video');
      ready.classList.add('hide');
      video.play();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props = this.props,
          _props$list = _props.list,
          list = _props$list === undefined ? [] : _props$list,
          _props$autoPlay = _props.autoPlay,
          autoPlay = _props$autoPlay === undefined ? true : _props$autoPlay;
      var playIndex = this.state.playIndex;

      return _react2.default.createElement(
        'div',
        { className: 'video-list', ref: function ref(el) {
            return _this3.wrap = el;
          } },
        list.map(function (item, index) {
          var videoSrc = item.videoSrc,
              pic = item.pic;


          var videoParam = {
            videoSrc: videoSrc,
            pic: pic,
            index: index,
            isPlay: index == playIndex
          };
          return _react2.default.createElement(
            'div',
            { className: 'list-item', key: index, onTouchMove: function onTouchMove() {
                return _this3.pageMove();
              }, onTouchEnd: function onTouchEnd() {
                return _this3.pageMoveEnd();
              } },
            _react2.default.createElement(VideoContainer, videoParam),
            _this3.props.children && _react2.default.cloneElement(_this3.props.children, _extends({}, item))
          );
        })
      );
    }
  }]);

  return Page;
}(_react.Component);

exports.default = Page;

var VideoContainer = exports.VideoContainer = function (_Component2) {
  _inherits(VideoContainer, _Component2);

  function VideoContainer() {
    _classCallCheck(this, VideoContainer);

    return _possibleConstructorReturn(this, (VideoContainer.__proto__ || Object.getPrototypeOf(VideoContainer)).apply(this, arguments));
  }

  _createClass(VideoContainer, [{
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          videoSrc = _props2.videoSrc,
          pic = _props2.pic,
          index = _props2.index;

      return _react2.default.createElement(
        'div',
        { className: 'video-wrap', 'data-video-src': videoSrc, 'data-pic-src': pic, 'data-index': index },
        _react2.default.createElement('p', { className: 'lib-img video-pic', 'data-size': '750x750', 'data-src': pic }),
        _react2.default.createElement('p', { className: 'pause hide' }),
        _react2.default.createElement('p', { className: 'play-ready' })
      );
    }
  }]);

  return VideoContainer;
}(_react.Component);