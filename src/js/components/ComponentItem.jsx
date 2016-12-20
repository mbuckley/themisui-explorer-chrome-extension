import styles from '../../styles/component-item.scss';

import React from 'react';
import classnames from 'classnames';
import {render} from 'react-dom';

class ComponentItem extends React.Component {
  constructor(props) {
    super(props);
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
