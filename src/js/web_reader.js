function getProblemDetail() {
    const url = location.href;
    const contest = getContestName();
    const title = document.title;
    const note = "";
    const savedAt = getFormattedTime();

    return [contest, url, { title: title, note: note, savedAt: savedAt }];
}

function getContestName() {
    const url = location.href;
    const contestPtn = /contests\/(.*?)\//;
    return url.match(contestPtn)[1];
}

function getFormattedTime() {
    const today = new Date();
    return today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate();
}

// ページの問題がすでに保存されているか否かを判定
async function isSaved(contest, url) {
    const item = await chrome.storage.sync.get(contest);

    return item[contest] && item[contest][url];
}

export { getProblemDetail, isSaved };
