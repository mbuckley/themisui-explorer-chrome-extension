import styles from '../../styles/component-item.scss';

import React from 'react';
import {render} from 'react-dom';

// anchor.addEventListener('mouseenter', showCustomElements);
// anchor.addEventListener('click', togglePinnedCustomElements);
// anchor.addEventListener('mouseleave', hideCustomElements);
class ComponentItem extends React.Component {
  render () {

    return (
      <a target="_blank" className={styles.componentItem}>{this.props.label}</a>
    )
  }
}

export default ComponentItem;
