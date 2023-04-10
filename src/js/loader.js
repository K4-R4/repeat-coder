(async () => {
    const src = await chrome.runtime.getURL("./src/js/content_script.js");
    const contentMain = await import(src);
    contentMain.main();
})()
