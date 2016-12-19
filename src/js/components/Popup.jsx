import styles from '../../styles/popup.scss';
import React from 'react';
import {render} from 'react-dom';
import {initializePopup} from '../popup.js'

//TODO: Render each ComponentItem into the components-container below
//TODO: Replace class="collection" with style from "styles" import

class Popup extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   color: props.initialColor
    // };
  }

  render () {
    return <div class="collection"></div>
  }
}

// call this after port.onMessage.addListener(function(response) { comes back
// and pass in elements as props
render(<Popup/>, document.getElementById('popup'));
