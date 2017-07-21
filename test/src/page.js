import React, {Component} from 'react';
import Transition from '../../src/index'

export default class Page extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      showSection: 1
    }
  }
  getContent() {
    let { showSection } = this.state;
    showSection = showSection.toString();
    switch(showSection) {
      case '1':
        return <Section1 />
      case '2':
        return <Section2 />
      case '3':
        return <Section3 />
      default:
        return null;
    }
  }
  changeShowSection(index) {
    this.setState({
      showSection: index
    })
  }
  componentDidMount() {
    let fireAppear = new Event('fireAppear');
    document.dispatchEvent(fireAppear);
  }
  render() {
    let { showSection } = this.state;
    return <div className="page">
      <div className="container">
        <Section1 show={1 == showSection}/>
        <Section2 show={2 == showSection}/>
        
      </div>
      <p className="btn-wrap">
        <span onClick={() => this.changeShowSection(1)}>1</span>
        <span onClick={() => this.changeShowSection(2)}>2</span>
      </p>
    </div>
  }
}

export class Section1 extends Transition {
  initTransition() {
    this.setConfig({
      wrap: this.wrap
    })
    this.addTransitionSection(this.left, 'left');
    this.addTransitionSection(this.right, 'right');
    this.addTransitionSection(this.top, 'top');
    this.addTransitionSection(this.bottom, 'bottom');
  }
  renderContent() {
    return <div className="wrap section1" ref={(el) => this.wrap = el}>
      <p ref={(el) => this.left = el} >left1</p>
      <p ref={(el) => this.top = el}>top1</p>
      <p ref={(el) => this.right = el}>right1</p>
      <p ref={(el) => this.bottom = el}>bottom1</p>
    </div>
  }
}

export class Section2 extends Transition {
  initTransition() {
    this.setConfig({
      wrap: this.wrap
    })
    this.addTransitionSection(this.left, 'left');
    this.addTransitionSection(this.right, 'right');
    this.addTransitionSection(this.top, 'top');
    this.addTransitionSection(this.bottom, 'bottom');
  }
  renderContent() {
    return <div className="wrap section2" ref={(el) => this.wrap = el}>
      <p ref={(el) => this.left = el} >left2</p>
      <p ref={(el) => this.right = el}>right2</p>
      <p ref={(el) => this.top = el}>top2</p>
      <p ref={(el) => this.bottom = el}>bottom2</p>
    </div>
  }
}

export class Section3 extends Transition {
  initTransition() {
    this.setConfig({
      wrap: this.wrap
    })
    this.addTransitionSection(this.left, 'left');
    this.addTransitionSection(this.right, 'right');
    this.addTransitionSection(this.top, 'top');
    this.addTransitionSection(this.bottom, 'bottom');
  }
  renderContent() {
    return <div className="wrap section3" ref={(el) => this.wrap = el}>
      <p ref={(el) => this.left = el}>left3</p>
      <p ref={(el) => this.right = el}>right3</p>
      <p ref={(el) => this.top = el}>top3</p>
      <p ref={(el) => this.bottom = el}>bottom3</p>
    </div>
  }
}