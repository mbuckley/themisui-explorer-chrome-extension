import styles from '../../styles/popup.scss';
import React from 'react';
import {render} from 'react-dom';
import ComponentItem from './ComponentItem';
// import {initializePopup} from '../popup.js'

//TODO: Render each ComponentItem into the components-container below
//TODO: Replace class="collection" with style from "styles" import

function showCustomElements(event) {
  port.postMessage({ action: 'show-custom-elements',
                     filter: event.target.textContent,
                     pinned: Array.from(document.querySelectorAll('.active')).map(e => e.textContent)
                   });
}

function hideCustomElements(event) {
  port.postMessage({ action: 'hide-custom-elements',
                     pinned: Array.from(document.querySelectorAll('.active')).map(e => e.textContent)
                   });
}

function togglePinnedCustomElements(event) {
  this.classList.toggle('active');
  if (this.classList.contains('active')) {
    showCustomElements(event);
  } else {
    hideCustomElements();
  }
}

//TODO: Move into components/ComponentItem.jsx
function probeThemisUIElements(elements) {
  elements.forEach(function(element) {
    element.querySelector('a').href = 'http://themisui-docs.clio.com/' + element.textContent;
  });
}

//FIXME: Find out why this isn't firing...inside of export?
function initializePopup() {
  let port;

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    port = chrome.tabs.connect(tabs[0].id);
    // Send a message to themisui-explorer.js to get all custom elements..
    port.postMessage({ action: 'get-custom-elements' });

    port.onMessage.addListener(function(response) {
      render(<Popup customElements={response.customElements} />, document.getElementById('popup'));


      // let existingElements = document.querySelectorAll('.el');
      // let addSeparator = (existingElements.length !== 0);
      //
      // //TODO: Move into components/Popup.jsx
      // let containerEle = document.getElementById("components-container");
      //
      // response.customElements.forEach(function(el) {
      //   //TODO: call render of popup here...
      //
      //   let anchor = document.createElement('a');
      //   anchor.target= '_blank';
      //   anchor.textContent = el;
      //   anchor.classList.add('collection-item');
      //   // elementListItemInnerEl.appendChild(anchor);
      //
      //   anchor.addEventListener('mouseenter', showCustomElements);
      //   anchor.addEventListener('click', togglePinnedCustomElements);
      //   anchor.addEventListener('mouseleave', hideCustomElements);
      //
      //   containerEle.appendChild(anchor);
      // });

      // let elements = document.querySelectorAll('.mdl-list__item');ß
      // probeThemisUIElements(elements);
    });
  });

  window.addEventListener('unload', function() {
    port.postMessage({ action: 'hide-custom-elements', pinned: [] });
  });
}

class Popup extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <div className="component-list">
        {
          this.props.customElements.map((componentName, index) => {
            return <ComponentItem key={index} label={componentName} />
          })
        }
      </div>
    )
  }
}

initializePopup();
