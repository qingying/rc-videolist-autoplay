require('./index.scss');
import React from 'react';
import {render} from 'react-dom';
import VideoList from '../../src/index';
import ListItem from './listItem';
import mockData from '../data';
console.log(mockData)
let params = {
  list: mockData,
  autoPlay: true,
  playCb: (index) => {
    console.log('play index' + index);
  }
}

render(
  <VideoList {...params}> 
    <ListItem></ListItem>
  </VideoList>,
  document.querySelector('#react-wrap')
)