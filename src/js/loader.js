(async () => {
    const src = await chrome.runtime.getURL("./src/js/content-script.js");
    const contentMain = await import(src);
    contentMain.main();
})()
