'use strict';

// Show page action icon when document DOMContentLoaded event is received.
chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action === 'show-page-action') {
   chrome.pageAction.show(sender.tab.id);
  }
});
