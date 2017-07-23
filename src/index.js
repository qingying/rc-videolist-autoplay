import React from 'react';
import sceneTransition from './sceneTransition';

export default class Transition extends React.Component {
  constructor(props, context) {
    super(props);
    this.state = {
      render: props.show,
      appear: props.show,
      disappear: false
    }
  }
  componentDidMount() {
    this.doTransition();
    let self = this;
    document.addEventListener('fireAppear', () => {
      if (self.state.appear) {
        sceneTransition.playScene(self.name, 'in');
      }
    })
  }
  componentWillUpdate(nextProps) {
    console.log('will update')
    console.log(nextProps);
    console.log(this.sceneConfig())
    console.log('*******');
    let preShow = this.props.show;
    let nextShow = nextProps.show;
    if (preShow != nextShow) {
      if (nextShow) {
        this.setState({
          render: nextShow,
          appear: true,
          disappear: false
        })
      } else {
        this.setState({
          disappear: true,
          render: false,
          appear: false
        })
      }
    }
  }
  componentDidUpdate() {
    this.doTransition();
  }
  addScene(config) {
    this.name = config.name;
    sceneTransition.addScene(config);
  }
  doTransition() {
    let { appear, disappear, render } = this.state;
    console.log('did update')
    console.log(this.state);
    console.log(this.sceneConfig());
    
    if (render) {
      console.log('add scene')
      this.addScene(this.sceneConfig());
    }
    console.log('*******');
    if (disappear) {
      sceneTransition.playScene(self.name, 'out');
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
  render() {
    let { render } = this.state;
    if (render) {
      return this.renderContent();
    } else {
      return null;
    }
    
  }
}