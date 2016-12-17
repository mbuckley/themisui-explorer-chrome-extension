function showCustomElements(event) {
  port.postMessage({ action: 'show-custom-elements',
                     filter: event.target.textContent,
                     pinned: Array.from(document.querySelectorAll('.pin')).map(e => e.textContent)
                   });
}

function hideCustomElements(event) {
  port.postMessage({ action: 'hide-custom-elements',
                     pinned: Array.from(document.querySelectorAll('.pin')).map(e => e.textContent)
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

function parseLinkHeader(header) {
  if (!header) {
    return;
  }
  let parts = header.split(',');
  let links = {};
  for (i=0; i < parts.length; i++) {
    let section = parts[i].split(';');
    let url = section[0].replace(/<|>/g, '').trim();
    let name = section[1].replace(/rel="(.*)"/, '$1').trim();
    links[name] = url;
  }
  return links;
}

function probeThemisUIElements(elements) {
  elements.forEach(function(element) {
    element.querySelector('a').href = 'http://themisui-docs.clio.com/' + element.textContent;
  });
}

let port;

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  port = chrome.tabs.connect(tabs[0].id);
  // Send a message to themisui-explorer.js to get all custom elements.
  port.postMessage({ action: 'get-custom-elements' });

  port.onMessage.addListener(function(response) {

    let existingElements = document.querySelectorAll('.el');
    let addSeparator = (existingElements.length !== 0);

    let containerEle = document.getElementById("components-container");

    response.customElements.forEach(function(el) {
      // if (addSeparator) {
      //   document.body.appendChild(document.createElement('hr'));
      //   addSeparator = false;
      // }
      // let elementListItemEl = document.createElement('li');
      // elementListItemEl.classList.add('mdl-list__item');
      //
      // let elementListItemInnerEl = document.createElement('span');
      // elementListItemInnerEl.classList.add('mdl-list__item-primary-content');

      let anchor = document.createElement('a');
      anchor.target= '_blank';
      anchor.textContent = el;
      anchor.classList.add('collection-item');
      // elementListItemInnerEl.appendChild(anchor);

      anchor.addEventListener('mouseenter', showCustomElements);
      anchor.addEventListener('click', togglePinnedCustomElements);
      anchor.addEventListener('mouseleave', hideCustomElements);

      containerEle.appendChild(anchor);
    });

    let elements = document.querySelectorAll('.mdl-list__item');
    // probeCustomElements(elements);
    // probeGooglePolymerElements(elements);
    probeThemisUIElements(elements);
  });
});

window.addEventListener('unload', function() {
  port.postMessage({ action: 'hide-custom-elements', pinned: [] });
});
