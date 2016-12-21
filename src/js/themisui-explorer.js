'use strict';
//TODO: Create element style utility that takes obj and sets up inline styles

let originalOutline;
let originalBackgroundColor;
const attributeBlacklist = ['id', 'class', 'style'];

//TODO: make the element selector a config value so this
//can work with differnt prefixes...

document.addEventListener('DOMContentLoaded', function onDomChange() {
  let results = document.evaluate( "count(//*[starts-with(name(),'th-')])",
                document, null, XPathResult.ANY_TYPE, null );

  if(results.numberValue > 0) {
    showPageAction();
  }
});

function showPageAction() {
  chrome.runtime.sendMessage({ action: 'show-page-action' });
}

function createAttributeSeperator() {
  let seperator = document.createElement('span');
  seperator.style.setProperty('margin', '0 5px');
  seperator.style.setProperty('color', '#bdc3c7');
  seperator.textContent = '|';
  return seperator;
}

function createAttributeName(name) {
  let attributeName = document.createElement('span');
  attributeName.style.setProperty('color', 'rgb(238, 120, 230)');
  attributeName.style.setProperty('font-weight', 'bold');
  attributeName.textContent = name + '=';
  return attributeName;v
}

function createAttributeValue(value) {
  let attributeValue = document.createElement('span');
  attributeValue.style.setProperty('color', 'rgb(142, 211, 251)');
  attributeValue.textContent = value;
  return attributeValue;
}

/**
 * Creates a tooltip element and returns
 */
function createTooltip(tooltipId, element) {
  let rect = element.getBoundingClientRect();
  let elementPadding = 20;
  let arrowHeight = 20;
  let styles = {
    'position': 'fixed',
    'top': (rect.top - elementPadding - arrowHeight) + 'px',
    'left': rect.left + 'px',
    'border': '1px solid #bdc3c7',
    'border-radius': '4px',
    'background-color': 'rgba(51, 55, 64, 1)',
    'font-family': 'Georgia',
    'color': '#ecf0f1',
    'height': '20px',
    'padding': '4px',
    'white-space': 'nowrap',
    'z-index': '50000'
  };

  let arrowStyles = {
    'position': 'absolute',
    'bottom': '-8px',
    'left': '8px',
    'width': '0px',
    'height': '0px',
    'border-left': '8px solid transparent',
    'border-right': '8px solid transparent',
    'border-top': '8px solid transparent',
  };

  let tooltip = document.createElement('div');
  tooltip.id = tooltipId;
  Object.keys(styles).forEach(function(styleKey) {
    tooltip.style.setProperty(styleKey, styles[styleKey]);
  });

  let tooltipArrow = document.createElement('span');
  Object.keys(arrowStyles).forEach(function(styleKey) {
    tooltipArrow.style.setProperty(styleKey, tooltipArrow[styleKey]);
  });

  let attrCount = 0;
  //Add the element attributes to the tooltip content
  Array.prototype.slice.call(element.attributes).forEach(function(item) {
    if(attributeBlacklist.indexOf(item.name) === -1) {

      if(attrCount > 0) {
        tooltip.appendChild(createAttributeSeperator());
      }

      tooltip.appendChild(createAttributeName(item.name));
      tooltip.appendChild(createAttributeValue(item.value));
      attrCount++;
   }

  });
  tooltip.appendChild(tooltipArrow);
  return (attrCount > 0) ? tooltip : null;
}

chrome.runtime.onConnect.addListener(function(port) {
 var customElements = [];
 port.onMessage.addListener(function(msg) {

   switch(msg.action) {

     case 'get-custom-elements':
       let result = document.evaluate( "//*[starts-with(name(),'th-')]",
                    document, null, XPathResult.ANY_TYPE, null );

       let nodes = [];
       let anode = null;

       while( (anode = result.iterateNext()) ){
          nodes.push( anode.nodeName );
       }

       nodes.forEach(function(node) {
         customElements.push(document.getElementsByTagName(node)[0]);
       });

       if (!customElements || customElements.length === 0) {
         return;
       }
       // Save original styles for each custom elements.
       originalOutline = [];
       originalBackgroundColor = [];
       customElements.forEach(function(el, i) {
         originalOutline[i] = el.style.outline;
         originalBackgroundColor[i] = el.style.backgroundColor;
       });
       // Send unique sorted custom elements localName to popup.js.
       var customElementsNames = customElements.map(function(el) {
         return el.localName;
       }).sort().filter(function(el,i,a) {
         return i === a.indexOf(el);
       });

       port.postMessage({ customElements: customElementsNames });
       break;

     case 'show-custom-elements':
       customElements.filter(function(el) {
         return el.localName === msg.filter;
       }).forEach(function(element) {
         element.style.setProperty('outline', '1px solid #95a5a6');
         element.style.setProperty('background-color', 'rgba(52, 152, 219, 0.5)');
         let tooltipId = element.localName + '-themisui-explorer-tooltip';

         let tooltip = document.getElementById(tooltipId);
         if(tooltip) {
           tooltip.style.setProperty('display', 'block');
         } else {
           tooltip = createTooltip(tooltipId, element);
           if(tooltip) {
             element.appendChild(tooltip);
           }
         }
       });
       break;

     case 'hide-custom-elements':
       customElements.forEach(function(element, i) {
         if (msg.pinned.indexOf(element.localName) === -1) {
           element.style.setProperty('outline', originalOutline[i]);
           element.style.setProperty('background-color', originalBackgroundColor[i]);
           let tooltip = document.getElementById(element.localName + '-themisui-explorer-tooltip');
           if(tooltip) {
             tooltip.style.setProperty('display', 'none');
           }
         }
       });
       break;
   }
 });
});
