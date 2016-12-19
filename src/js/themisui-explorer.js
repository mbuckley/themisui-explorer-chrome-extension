'use strict';

var originalOutline;
var originalBackgroundColor;

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
         //TODO: Replace with render of components/Tooltip.jsx
         let tooltip = document.getElementById(element.localName + '-themisui-explorer-tooltip');
         if(tooltip) {
           tooltip.style.setProperty('display', 'block');
         } else {
           tooltip = document.createElement('div');
           tooltip.id = element.localName + '-themisui-explorer-tooltip';
           tooltip.style.setProperty('position', 'fixed');
           var rect = element.getBoundingClientRect();
           // top - padding - tooltipArrowHeight
           tooltip.style.setProperty('top', (rect.top - 20 - 20) + "px");
           tooltip.style.setProperty('left', rect.left + "px");
           tooltip.style.setProperty('border', '1px solid #bdc3c7');
           tooltip.style.setProperty('border-radius', '4px');
           tooltip.style.setProperty('background-color', 'rgba(51, 55, 64, 1)');
           tooltip.style.setProperty('font-family', 'Georgia');
           tooltip.style.setProperty('color', '#ecf0f1');
           tooltip.style.setProperty('height', '20px');
           tooltip.style.setProperty('padding', '4px');
           tooltip.style.setProperty('white-space', 'nowrap');
           tooltip.style.setProperty('z-index', '50000');

           let tooltipArrow = document.createElement('span');
            tooltipArrow.style.setProperty('position', 'absolute');
            tooltipArrow.style.setProperty('bottom', '-8px');
            tooltipArrow.style.setProperty('left', '8px');
            tooltipArrow.style.setProperty('width', '0px');
            tooltipArrow.style.setProperty('height', '0px');
            tooltipArrow.style.setProperty('border-left', '8px solid transparent');
            tooltipArrow.style.setProperty('border-right', '8px solid transparent');
            tooltipArrow.style.setProperty('border-top', '8px solid rgba(51, 55, 64, 1)');
            tooltip.appendChild(tooltipArrow);


           let attributeBlacklist = ['id', 'class', 'style'];

           let attrCount = 0;
           Array.prototype.slice.call(element.attributes).forEach(function(item) {
             if(attributeBlacklist.indexOf(item.name) === -1) {

               if(attrCount > 0) {
                 let seperator = document.createElement('span');
                 seperator.style.setProperty('margin', '0 5px');
                 seperator.style.setProperty('color', '#bdc3c7');
                 seperator.textContent = '|';
                 tooltip.appendChild(seperator);
               }

              let attributeName = document.createElement('span');
              attributeName.style.setProperty('color', 'rgb(238, 120, 230)');
              attributeName.style.setProperty('font-weight', 'bold');
              attributeName.textContent = item.name + '=';

              let attributeValue = document.createElement('span');
              attributeValue.style.setProperty('color', 'rgb(142, 211, 251)');
              attributeValue.textContent = item.value;


              tooltip.appendChild(attributeName);
              tooltip.appendChild(attributeValue);
              attrCount++;
            }

          });
          tooltip.appendChild(tooltipArrow);
          element.appendChild(tooltip);
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
