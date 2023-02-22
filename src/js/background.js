'use strict'


chrome.runtime.onInstalled.addListener((reason) => {
    if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
      chrome.tabs.create({
        url: "./src/html/onboarding.html"
      });
    }
  });


chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.create({"url": "./src/html/index.html" });
  });