
export new sceneTransition();

export class sceneTransition {
  constructor() {
    this.scenes = {};
  }
  /*
    config:
      name: 场景名称
      parent: 父场景名称
      isSame: 出场和进场动画相同
  */
  addScene(config) {
    let { name, parent = 'root', isSame } = config;
    if (this.scenes[name]) {
      this.resetScene(name);
    }
    this.scenes[name] = {
      scene: new Scene(config),
      parentScene: parent,
      childScene: []
    }
    let parentScene = this.scenes[parentScene];
    if (parentScene) {
      parentScene.childScene.push(name);
    }
  }
  // 重置一个场景
  resetScene(name) {
    let { parentScene, childScene} = this.scene[name];
    // 移除子场景
    childScene.map((item) => this.resetScene(item.name))
    // 父场景的childScene移除它
    if (parent != 'root') {
      let parentChildScene =  this.scene[parent].childScene;
      let index;
      for( let i = 0; i < parentChildScene.length; i++ ) {
        if (parentChildScene[i] == name) {
          index = i;
          break;
        }
      }
      if (index || index == 0) {
        parentChildScene.slice(index,)
      }
    }
    // 当前场景置为null
    this.scene[name] = null;
  }
  /*
    name: 场景标识
    type: in/out 进场or出场
  */
  playScene(name, type) {
    let scene = this.scenes[name];
    if (!scene) {
      console.error(name + ' the scene has not be added');
    }
    scene.play(type);
  }
}

// 单个场景状态切换
export class Scene {
  /*
    config:
      inQueue: 入场队列
      outQueue: 出场队列
      isSame: 出场和进场动画相同
      inPlayOverCb: 进场动画播放结束回调
      outPlayOverCb: 出场动画播放结束回调
      inPlayTime: 单个区域入场动画时间
      outPlayTime: 单个区域出场动画时间
      inAwaitTime: 两个区域入场等待时间
      outAwaitTime: 两个区域出场等待时间
      inPlayType: 进场动画类型
      outPlayType: 出场动画类型
    queueItem:
      el: 动画区域
      playTime: 动画时间
      playType: 动画类型:平移(left,top,bottom,right) 渐影(fade) 平移到下场景(translate)
      waitTime: 下一区域动画等待时间，默认是上一场结束
      tranlateName: 多场景平移相同区域标识字段
  */
  constructor(config) {
    let { name, inQueue, outQueue, inAwaitTime, outAwaitTime, inPlayType, outPlayType, inPlayTime, outPlayTime, isSame, inPlayOverCb, outPlayOverCb } = config
    inQueue.map((item) => {
      item.playTime = item.playTime || inPlayTime;
      item.waitTime = item.waitTime || inAwaitTime || item.playTime;
      item.playType = item.playType || inPlayType;
    });
    outQueue.map(item => {
      item.playTime = item.playTime || outPlayTime;
      item.waitTime = item.waitTime || outAwaitTime || item.playTime;
      item.playType = item.playType || outPlayType;
    });
    if (isSame && (!outQueue || !outQueue.length)) {
      outQueue = inQueue;
    }
    this.inQueue = inQueue;
    this.outQueue = outQueue;
    this.name = name;
    this.outPlayOverCb = outPlayOverCb;
    this.inPlayOverCb = inPlayOverCb;
    this.translateData = {}
  }
  playover(type){
    if (type == 'in') {
      this.inPlayOverCb && this.inPlayOverCb();
    }
    if (type == 'out') {
      this.outPlayOverCb && this.outPlayOverCb(this.translateData);
    }
  }
  play(type) {
    let queueList = {
      'in': this.inQueue,
      'out': this.outQueue
    }
    let quene = queueList[type],
    let len = quene.length;
    let start = async () => {
      let i = 0;
      let item;
      while(item = queue[i]){
        this.inAnim(item);
        if (item.playType == 'translate' && type == 'out') {
          item.awaitTime = 0;
        }
        await this.sleep(item.awaitTime);
        i += 1;
      }
      this.playover(type);
    }
    start();
  }
  anim(item, type) {
    let { el, tranlateName, playType } = item;
    let wrap = el.parentNode;
    let wrapOffset = wrap.getBoundingClientRect();
    let itemOffset = el.getBoundingClientRect();
    let translate;
    let opacity;
    let extraData;
    switch(type) {
      case 'left':
      case 'right':
      case 'top':
      case 'bottom':
        this.translateAnim(playType, type, itemOffset, wrapOffset, item)
        break;
      case 'fade':
        this.fadeAnim(type, item);
        break;
      case 'translate':
        this.translateData[tranlateName] =  itemOffset;
        break;
      default: 
        break;
    }  
  }
  translateAnim(dir, type, itemOffset, wrapOffset, item) {
    let { el, playTime } = item
    let translate;
    switch(dir) {
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
    if (type == 'in') {
      el.style.webkitTransform = 'translate3d(' + translate + ')';
      el.style.visibility = 'visible';
      setTimeout(() => {
        el.style.webkitTransition = 'transform ' + playTime/1000 + 's ease-in';
        el.style.webkitTransform = 'translate3d(0,0,0)';
      }, 30)
    }
    if (type == 'out') {
      el.style.webkitTransition = 'transform ' + playTime/1000 + 's ease-in';
      el.style.webkitTransform = 'translate3d(' + translate + ')';
      setTimeout(() => {
        el.style.visibility = 'hidden';
      }, playTime)
    }
  }
  fadeAnim(type, item) {
    let { el, playTime } = item;
    if (type == 'in') {
      el.style.opacity = 0;
      el.style.visibility = 'visible';
      setTimeout(() => {
        el.style.webkitTransition = 'opacity ' + playTime/1000 + 's ease-in';
        el.style.opacity = 1;
      })
    }
    if (type == 'out') {
      el.style.opacity = 0;
      el.style.webkitTransition = 'opacity ' + playTime/1000 + 's ease-in';
      setTimeout(() => {
        el.style.visibility = 'hidden';
      }, playTime)
    }

  }
  sleep(awaitTime) {
    return new Promise((resolve) => {
      setTimeout(() => resolve && resolve(), awaitTime)
    })
  }
}