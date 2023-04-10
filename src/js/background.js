chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({ "url": "./src/html/index.html" });
});
