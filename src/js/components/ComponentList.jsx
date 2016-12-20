import styles from '../../styles/component-list.scss';

import React from 'react';
import {render} from 'react-dom';
import ComponentItem from './ComponentItem';

class ComponentList extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <div className={styles.componentList}>
        {
          this.props.customElements.map((componentName, index) => {
            return <ComponentItem key={index} label={componentName} port={this.props.port} />
          })
        }
      </div>
    )
  }
}

export default ComponentList;
