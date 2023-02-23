/*  コンテストの個別の問題ページや解説ページを開いているとき、
その問題を記録するための保存ボタンを追加する */
const target = document.querySelector("#contest-nav-tabs ul");
// 挿入する要素
const html =
    `<li id="save-btn"><a href="javascript:void(0)">
        <span class="glyphicon glyphicon-save color-not-ok" aria-hidden="true"></span>保存
    </a></li>`;
target.insertAdjacentHTML("beforeend", html);


/* 保存タブが押されたときstorage.syncに保存する
{
    {contest}: {
        {url}: {
            title: {title},
            note: {note},
            savedAt: {savedAt}
        }
    }
} */
const saveBtn = document.getElementById("save-btn");
// chrome.storage.sync.clear();
saveBtn.addEventListener("click", async () => {
    const detail = getProblemDetail();
    const problem = {
        title: detail["title"],
        note: "",
        savedAt: detail["savedAt"]
    }

    // コンテスト単位で問題を保存
    const item = await chrome.storage.sync.get(detail["contest"]);
    if(item[detail["contest"]] == null) {
        // 1.コンテスト自体が保存されていない場合は新たに作成
        chrome.storage.sync.set({ [detail["contest"]]: { [detail["url"]]: problem } });
    }else if(item[detail["contest"]][detail["url"]] == null) {
        // 2.コンテストがすでに保存されているなら追記
        item[detail["contest"]][detail["url"]] = problem;
        await chrome.storage.sync.set(item);
    }else {
        // 3.すでに問題が保存されているならそれを削除する
        const problemsInContest = Object.keys(item[detail["contest"]]).length;
        if (problemsInContest <= 1) {
            // コンテストが削除対象の問題だけ含んでいるならコンテスト自体を削除
            await chrome.storage.sync.remove(detail["contest"]);
        } else {
            // 問題を削除
            delete item[detail["contest"]][detail["url"]];
            await chrome.storage.sync.set(item);
        }
    }

    toggleButtonColor();
});


init();


function getProblemDetail() {
    const url = location.href;
    const contestPtn = /contests\/(.*?)\//;
    const contest = url.match(contestPtn)[1];
    const title = document.title;
    const today = new Date();
    const savedAt = today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate();

    return { url: url, contest: contest, title: title, savedAt: savedAt };
}


// ページの問題がすでに保存されているか否かを判定
async function isSaved() {
    const detail = getProblemDetail();
    const item = await chrome.storage.sync.get(detail["contest"]);

    if(item[detail["contest"]] == null || item[detail["contest"]][detail["url"]] == null) return false;
    return true;
}

function toggleButtonColor() {
    const icon = saveBtn.querySelector("span");
    icon.classList.toggle("glyphicon-save");
    icon.classList.toggle("glyphicon-saved");
    icon.classList.toggle("color-ok");
    icon.classList.toggle("color-not-ok");
}

async function init() {
    // ページを読み込んだ時点で問題が保存されているなら保存ボタンを切り替え
    if(await isSaved()) {
        toggleButtonColor();
    }
}