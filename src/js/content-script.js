//  コンテストの個別の問題ページや解説ページを開いているとき、その問題を記録するための保存ボタンを追加する
const target = document.querySelector("#contest-nav-tabs ul");
const btnHtml =
    `<li id="save-btn"><a href="javascript:void(0)">
        <span class="glyphicon glyphicon-save color-not-ok" aria-hidden="true"></span>保存
    </a></li>`;
target.insertAdjacentHTML("beforeend", btnHtml);


// 問題の保存状態から保存ボタンのアイコンと色を設定する
const saveBtn = document.getElementById("save-btn");
setInitialSaveButton();


/* 保存タブが押されたときchrome storageに保存する
{
    {contest}: {
        {url}: {
            title: {title},
            note: {note},
            savedAt: {savedAt}
        }
    }
} */
saveBtn.addEventListener("click", async () => {
    const [contest, url, problem] = getProblemDetail();
    await saveProblem(contest, url, problem);
    toggleButtonColor();
});


function getProblemDetail() {
    const url = location.href;
    const contest = getContestName();
    const title = document.title;
    const note = "";
    const savedAt = getFormattedTime();

    return [contest, url, {title: title, note: note, savedAt: savedAt}];
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
async function isSaved() {
    const [contest, url, _] = getProblemDetail();
    const item = await chrome.storage.sync.get(contest);

    return item[contest] && item[contest][url];
}


// 保存ボタンのアイコンと色を、問題が保存済みか否かによって切り替える
function toggleButtonColor() {
    const saveBtn = document.getElementById("save-btn");
    const icon = saveBtn.querySelector("span");
    icon.classList.toggle("glyphicon-save");
    icon.classList.toggle("glyphicon-saved");
    icon.classList.toggle("color-ok");
    icon.classList.toggle("color-not-ok");
}


async function setInitialSaveButton() {
    if(await isSaved()) {
        toggleButtonColor();
    }
}


async function saveProblem(contest, url, problem) {
    const item = await chrome.storage.sync.get(contest);
    if(item[contest] == null) {
        // 1.コンテスト自体が保存されていない場合は新たに項目を作成
        chrome.storage.sync.set({ [contest]: { [url]: problem } });
    }else if(item[contest][url] == null) {
        // 2.コンテストがすでに保存されているなら項目に追記
        item[contest][url] = problem;
        await chrome.storage.sync.set(item);
    }else {
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