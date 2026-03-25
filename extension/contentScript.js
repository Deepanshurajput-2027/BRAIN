// contentScript.js
console.log('BRAIN: Content script loaded');

// 1. Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'GET_SELECTION_DATA') {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const text = selection.toString();
      const selector = getSelectorForElement(range.startContainer.parentElement);
      
      sendResponse({ 
        text, 
        selector, 
        url: window.location.href,
        title: document.title
      });
    } else {
      sendResponse(null);
    }
  }
});

/**
 * Generates a unique CSS selector for an element
 */
function getSelectorForElement(el) {
  if (!(el instanceof Element)) return '';
  const path = [];
  while (el.nodeType === Node.ELEMENT_NODE) {
    let selector = el.nodeName.toLowerCase();
    if (el.id) {
      selector += '#' + el.id;
      path.unshift(selector);
      break;
    } else {
      let sib = el, nth = 1;
      while (sib = sib.previousElementSibling) {
        if (sib.nodeName.toLowerCase() == selector) nth++;
      }
      if (nth != 1) selector += ":nth-of-type("+nth+")";
    }
    path.unshift(selector);
    el = el.parentNode;
  }
  return path.join(' > ');
}

// 2. Persistent Highlight Injection
const fetchAndApplyHighlights = async () => {
  try {
    // Send message to background to fetch highlights (since content script can't access cookies directly across origins easily)
    chrome.runtime.sendMessage({ 
      action: 'FETCH_HIGHLIGHTS', 
      payload: { url: window.location.href } 
    }, (response) => {
      if (response && response.success && response.data) {
        response.data.forEach(highlight => {
          applyHighlight(highlight.metadata.selector, highlight.content);
        });
      }
    });
  } catch (err) {
    console.error('BRAIN: Failed to load highlights:', err);
  }
};

function applyHighlight(selector, text) {
  try {
    const el = document.querySelector(selector);
    if (!el) return;

    const innerHTML = el.innerHTML;
    const index = innerHTML.indexOf(text);
    
    if (index >= 0) {
      const highlightedHTML = innerHTML.replace(
        text, 
        `<span style="background-color: #fef08a; border-bottom: 2px solid #facc15; cursor: pointer;" title="Saved to BRAIN">${text}</span>`
      );
      el.innerHTML = highlightedHTML;
    }
  } catch (err) {
    console.warn('BRAIN: Could not apply highlight to', selector);
  }
}

// Run on load
if (document.readyState === 'complete') {
  fetchAndApplyHighlights();
} else {
  window.addEventListener('load', fetchAndApplyHighlights);
}
