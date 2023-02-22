/*  コンテストの個別の問題ページや解説ページを開いているとき、
その問題を記録するための保存ボタンを追加する */
const target = document.querySelector("#contest-nav-tabs ul");
// 挿入する要素
const html =
    `<li id="save-btn"><a href="javascript:void(0)">
        <span class="glyphicon glyphicon-bookmark" aria-hidden="true"></span>保存
    </a></li>`;
target.insertAdjacentHTML("beforeend", html);


/* 保存タブが押されたときstorage.syncに保存する
{
    {contest}: {
        {url}: {
            title: {title},
            savedAt: {savedAt}
        }
    }
} */
const sabeBtn = document.getElementById("save-btn");
// chrome.storage.sync.clear();
sabeBtn.addEventListener("click", async () => {
    const detail = getProblemDetail();
    const problem = {
        title: detail["title"],
        savedAt: detail["savedAt"]
    }

    // コンテスト単位で問題を保存
    const item = await chrome.storage.sync.get(detail["contest"]);
    if(item[detail["contest"]] == null) {
        // 1.コンテスト自体が保存されていない場合は新たに作成
        chrome.storage.sync.set({[detail["contest"]]: {[detail["url"]]: problem}});
    } else {
        // 2.コンテストがすでに保存されているなら追記
        item[detail["contest"]][detail["url"]] = problem;
        await chrome.storage.sync.set(item);
    }
});


function getProblemDetail() {
    const url = location.href;
    const contestPtn = /contests\/(.*?)\//;
    const contest = url.match(contestPtn)[1];
    const title = document.title;
    const today = new Date();
    const savedAt = today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate();

    return {url: url, contest: contest, title: title, savedAt: savedAt};
}

// todo 保存タブを押したあとのビジュアル変化
// todo 問題のランダムな提示