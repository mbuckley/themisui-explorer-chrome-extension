import styles from '../../styles/component-item.scss';

import React from 'react';
import classnames from 'classnames';
import {render} from 'react-dom';

//TODO: Add this onclick to a pin icon so it doesn't conflict
//with the click to see the element docs
// onClick={this.togglePinnedCustomElements.bind(this)}
class ComponentItem extends React.Component {
  constructor(props) {
    super(props);
    console.log("componentItem props", props);
    this.state = { active: false };
  }

  render () {
    let classes = classnames(styles.componentItem, {active: this.state.active});
    return (
      <a target="_blank"
         className={classes}
         href={'http://themisui-docs.clio.com/' + this.props.label}
         onMouseEnter={this.showCustomElements.bind(this)}
         onMouseLeave={this.hideCustomElements.bind(this)}
      >{this.props.label}</a>
    )
  }

  // togglePinnedCustomElements(e) {
  //   this.setState({active: this.state.active ? false : true});
  //
  //   if (this.state.active) {
  //     this.showCustomElements(event);
  //   } else {
  //     this.hideCustomElements();
  //   }
  // }

  showCustomElements(event) {
    this.props.port.postMessage({
      action: 'show-custom-elements',
      filter: event.target.textContent,
      pinned: Array.from(document.querySelectorAll('.active')).map(e => e.textContent)
    });
  }

  hideCustomElements(event) {
    this.props.port.postMessage({
      action: 'hide-custom-elements',
      pinned: Array.from(document.querySelectorAll('.active')).map(e => e.textContent)
    });
  }
}

export default ComponentItem;
