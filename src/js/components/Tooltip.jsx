import styles from '../../styles/tooltip.scss';
import React from 'react';
import {render} from 'react-dom';

class Tooltip extends React.Component {
  constructor (props) {
    super(props);
    //FIXME: Replace 20 / 20 below with vars #magicNumbers
    let styles = {
      top: (props.top - 20 - 20) + 'px',
      left: props.left + 'px',
      border: '1px solid #bdc3c7',
      borderRadius: '4px',
      backgroundColor: 'rgba(51, 55, 64, 1)',
      fontFamily: 'Georgia',
      color: '#ecf0f1',
      height: '20px',
      padding: '4px',
      whiteSpace: 'nowrap',
      zIndex: '50000'
    }

    let arrowStyles = {
      position: 'absolute',
      bottom: '-8px',
      left: '8px',
      width: '0px',
      height: '0px',
      borderLeft: '8px solid transparent',
      borderRight: '8px solid transparent',
      borderTop: '8px solid transparent'
    }

    this.state = {
      styles: styles
      arrowStyles: arrowStyles
    }
  }

  render () {
    return <div style={this.state.styles}>
      <span style={this.state.arrowStyles}
    </div>
  }
}
