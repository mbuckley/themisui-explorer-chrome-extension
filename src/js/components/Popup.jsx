import styles from '../../styles/popup.scss';
import React from 'react';
import {render} from 'react-dom';
import ComponentItem from './ComponentItem';

let port;

/**
 * Initialize first grabs the current tab and connects to the port
 * and renders when the addListener comes back.
 */
function initialize() {

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    port = chrome.tabs.connect(tabs[0].id);
    // Send a message to themisui-explorer.js to get all custom elements..
    port.postMessage({ action: 'get-custom-elements' });

    port.onMessage.addListener(function(response) {
      render(<Popup customElements={response.customElements} />, document.getElementById('popup'));
    });
  });

  window.addEventListener('unload', function() {
    port.postMessage({ action: 'hide-custom-elements', pinned: [] });
  });
}

class Popup extends React.Component {
  constructor(props) {
    super(props);
    this.state = { port: port };
  }

  render () {
    return (
      <div className="component-list">
        {
          this.props.customElements.map((componentName, index) => {
            return <ComponentItem key={index} label={componentName} port={this.state.port} />
          })
        }
      </div>
    )
  }
}

initialize();
