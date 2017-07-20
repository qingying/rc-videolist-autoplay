import React from 'react';
import { TransitionGroup } from 'react-transition-group'

export default class Transition extends React.Component {
  constructor(props, context) {
    super(props);
    this.state = {
      render: props.show,
      appear: props.show,
      disappear: false
    }
  }
  setConfig(config) {
    this.config = config;
  }
  addTransitionSection(el, type, time = 300, awaitTime) {
    if (!el) {
      return;
    }
    awaitTime = awaitTime || this.config.awaitTime || time;
    this.transitionQueue = this.transitionQueue || [];
    // el是component时，取wrap
    el = el.wrap || el;
    this.transitionQueue.push({
      el,
      type,
      time,
      awaitTime
    })
  }
  componentDidMount() {
    this.doTransition();
    let self = this;
    document.addEventListener('fireAppear', () => {
      if (self.state.appear) {
        self.inPlayground();
      }
    })
  }
  componentWillUpdate(nextProps) {
    let preShow = this.props.show;
    let nextShow = nextProps.show;
    if (preShow != nextShow) {
      if (nextShow) {
        this.setState({
          render: nextShow,
          appear: true,
        })
      } else {
        this.setState({
          disappear: true
        })
      }
    }
  }
  componentDidUpdate() {
    this.doTransition();
  }
  reset() {
    this.transitionQueue = [];
  }
  doTransition() {
    this.reset()
    this.initTransition();
    let { appear, disappear } = this.state;
    if (appear) {
      // this.inPlayground();
      this.state.appear = true;
    }
    if (disappear) {
      this.outPlayground();
    }
  }
  transitionOver() {
    if (this.state.disappear) {
      this.setState({
        render: false
      })
      let fireAppear = new Event('fireAppear');
      document.dispatchEvent(fireAppear);

    }
    this.state.appear = false;
    this.state.disappear = false;
  }
  checkTransitionSec() {
    return this.transitionQueue && this.transitionQueue.length;
  }
  inPlayground(){
    if (!this.checkTransitionSec()) {
      return;
    }
    let queue = this.transitionQueue.concat()
    let len = queue.length;
    console.log('len' + len)
    let start = async () => {
      let i = 0;
      let item;
      while(item = queue[i]){
        console.log(item);
        this.inAnim(item);
        await this.sleep(item.awaitTime);
        if (i == (len -1)) {
          this.transitionOver();
        }
        i += 1;
      }
    }
    start();
  }
  inAnim(item) {
    // do trandition=
    let { el, type = 'left' , time } = item;
    let wrapOffset = this.config.wrap.getBoundingClientRect();
    let itemOffset = el.getBoundingClientRect();
    let translate = '';
    switch(type) {
      case 'left':
        translate = wrapOffset.left - itemOffset.left - itemOffset.width + 'px, 0, 0';
        break;
      case 'right':
        translate = wrapOffset.right - itemOffset.right + itemOffset.width + 'px, 0, 0';
        break;
      case 'top':
        translate = '0, ' + (wrapOffset.top - itemOffset.top - itemOffset.height) + 'px, 0';
        break;
      case 'bottom':
        translate = '0, ' + (wrapOffset.bottom - itemOffset.top + itemOffset.height) + 'px, 0';
        break;
      default: 
        break;
    }
    console.log(el);
    el.style.webkitTransform = 'translate3d(' + translate + ')';
    el.style.visibility = 'visible';
    console.log(el);
    setTimeout(() => {
      el.style.webkitTransition = 'transform ' + time/1000 + 's ease-in';
      el.style.webkitTransform = 'translate3d(0,0,0)';
    }, 30)
  }
  outPlayground() {
    if (!this.checkTransitionSec()) {
      return;
    }
    let queue = this.transitionQueue.concat().reverse();
    let len = queue.length;
    let start = async () => {
      let i = 0;
      let item;
      while(item = queue[i]){
        this.outAnim(item);
        await this.sleep(item.awaitTime);
        if (i == (len -1)) {
          this.transitionOver();
        }
        i += 1;
      }
    }
    start();
  }
  outAnim(item) {
    let { el, type = 'left' , time } = item;
    let wrapOffset = this.config.wrap.getBoundingClientRect();
    let itemOffset = el.getBoundingClientRect();
    let translate = '';
    switch(type) {
      case 'left':
        translate = wrapOffset.left - itemOffset.left - itemOffset.width + 'px, 0, 0';
        break;
      case 'right':
        translate = wrapOffset.right - itemOffset.right + itemOffset.width + 'px, 0, 0';
        break;
      case 'top':
        translate = '0, ' + (wrapOffset.top - itemOffset.top - itemOffset.height) + 'px, 0';
        break;
      case 'bottom':
        translate = '0, ' + (wrapOffset.bottom - itemOffset.top + itemOffset.height) + 'px, 0';
        break;
      default: 
        break;
    }
    el.style.webkitTransition = 'transform ' + time/1000 + 's ease-in';
    el.style.webkitTransform = 'translate3d(' + translate + ')';
    setTimeout(() => {
      el.style.visibility = 'hidden';
    }, time)
  }
  sleep(awaitTime) {
    return new Promise((resolve) => {
      setTimeout(() => resolve && resolve(), awaitTime)
    })
  }
  render() {
    let { render } = this.state;
    if (render) {
      return this.renderContent();
    } else {
      return null;
    }
    
  }
}