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
         element.style.setProperty('outline', '2px dashed #e74c3c');
         element.style.setProperty('background-color', '#ecf0f1');
       });
       break;

     case 'hide-custom-elements':
       customElements.forEach(function(element, i) {
         if (msg.pinned.indexOf(element.localName) === -1) {
           element.style.setProperty('outline', originalOutline[i]);
           element.style.setProperty('background-color', originalBackgroundColor[i]);
         }
       });
       break;
   }
 });
});
