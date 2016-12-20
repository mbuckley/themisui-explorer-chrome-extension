import React from 'react';
import {render} from 'react-dom';
import ComponentList from './ComponentList';

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
      <ComponentList customElements={this.props.customElements} port={this.state.port} />
    )
  }
}

initialize();
