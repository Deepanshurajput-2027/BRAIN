const API_BASE_URL = 'http://localhost:3000/api/v1';

// 1. Create Context Menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'saveToBrain',
    title: 'Save to Brain',
    contexts: ['page', 'link', 'selection']
  });
});

// 2. Handle Context Menu Clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'saveToBrain') {
    if (info.selectionText) {
      // It's a highlight/selection - get more data from content script
      chrome.tabs.sendMessage(tab.id, { action: 'GET_SELECTION_DATA' }, (response) => {
        if (response) {
          addHighlightToBrain(response);
        } else {
          // Fallback if content script fails
          addContentToBrain(info.pageUrl || tab.url, ['extension', 'selection']);
        }
      });
    } else {
      const url = info.linkUrl || info.pageUrl || tab.url;
      addContentToBrain(url);
    }
  }
});

/**
 * addHighlightToBrain
 * Higher-level wrapper for saving highlights
 */
async function addHighlightToBrain(data) {
   return addContentToBrain(data.url, ['highlight'], {
     title: `Highlight: ${data.title}`,
     text: data.text,
     metadata: { selector: data.selector, isHighlight: true }
   });
}

// 3. Main Communication Logic
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'ADD_CONTENT') {
    addContentToBrain(request.payload.link, request.payload.tags)
      .then(data => sendResponse({ success: true, data }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; 
  }

  if (request.action === 'FETCH_HIGHLIGHTS') {
    fetchHighlights(request.payload.url)
      .then(data => sendResponse({ success: true, data }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
});

/**
 * fetchHighlights
 */
async function fetchHighlights(url) {
  const response = await fetch(`${API_BASE_URL}/content/highlights?url=${encodeURIComponent(url)}`, {
    credentials: 'include'
  });
  const result = await response.json();
  return result.data;
}

/**
 * addContentToBrain
 * Performs authenticated API call using session cookie
 */
async function addContentToBrain(link, tags = ['extension'], extra = {}) {
  try {
    const payload = { 
      link, 
      tags,
      title: extra.title,
      text: extra.text,
      metadata: extra.metadata
    };

    const response = await fetch(`${API_BASE_URL}/content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Server error');
    }

    // Show notification on success
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'Knowledge Captured!',
      message: `Successfully saved: ${link}`
    });

    return result.data;
  } catch (error) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'Capture Failed',
      message: error.message
    });
    throw error;
  }
}
