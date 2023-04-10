/*
{
    {contest}: {
        {url}: {
            title: {title},
            note: {note},
            savedAt: {savedAt}
        }
    }
}
*/

async function saveProblem(contest, url, problem) {
    const item = await chrome.storage.sync.get(contest);
    if (item[contest] == null) {
        // 1.コンテスト自体が保存されていない場合は新たに項目を作成
        chrome.storage.sync.set({ [contest]: { [url]: problem } });
    } else if (item[contest][url] == null) {
        // 2.コンテストがすでに保存されているなら項目に追記
        item[contest][url] = problem;
        await chrome.storage.sync.set(item);
    } else {
        // 3.すでに問題が保存されているならそれを削除する
        deleteProblem(contest, url);
    }
}

async function deleteProblem(contest, url) {
    const item = await chrome.storage.sync.get(contest);
    const problemsInContest = Object.keys(item[contest]).length;
    if (problemsInContest <= 1) {
        // コンテストが削除対象の問題だけ含んでいるならコンテスト自体を削除
        await chrome.storage.sync.remove(contest);
    } else {
        // そうでないなら対象の問題のみを削除
        delete item[contest][url];
        await chrome.storage.sync.set(item);
    }
}

export { saveProblem, deleteProblem };
