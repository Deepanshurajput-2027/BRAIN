document.addEventListener('DOMContentLoaded', async () => {
  const saveBtn = document.getElementById('save-btn');
  const pageTitle = document.getElementById('page-title');
  const pageUrl = document.getElementById('page-url');
  const statusContainer = document.getElementById('status-container');
  const loadingState = document.getElementById('loading-state');
  const successState = document.getElementById('success-state');

  // 1. Get current tab info
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab) {
    pageTitle.textContent = tab.title;
    pageUrl.textContent = tab.url;
  }

  // 2. Save logic
  saveBtn.addEventListener('click', async () => {
    saveBtn.classList.add('hidden');
    statusContainer.classList.remove('hidden');
    
    try {
      // 3. Send message to background script to perform the API call
      // Background script has access to cookies/JWT
      const response = await chrome.runtime.sendMessage({
        action: 'ADD_CONTENT',
        payload: {
          link: tab.url,
          tags: ['captured']
        }
      });

      if (response.success) {
        loadingState.classList.add('hidden');
        successState.classList.remove('hidden');
        setTimeout(() => window.close(), 1500);
      } else {
        throw new Error(response.error || 'Failed to save');
      }
    } catch (error) {
      alert('Error: ' + error.message);
      saveBtn.classList.remove('hidden');
      statusContainer.classList.add('hidden');
    }
  });
});
