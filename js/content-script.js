"use sttrict"


/*****  コンテストの個別の問題ページや解説ページを開いているとき、
その問題を記録するための保存タブを追加する *****/
// 挿入先の親要素
const parent = document.getElementById("contest-nav-tabs").querySelector(".nav.nav-tabs");
// 挿入の基準
const target = parent.querySelector(".pull-right");
// 挿入する要素
const html =
    '<li id="save-tab"><a href="javascript:void(0)">' +
        '<span class="glyphicon glyphicon-bookmark" aria-hidden="true"></span>保存' +
    '</a></li>';
target.insertAdjacentHTML("beforebegin", html);


/***** 保存タブが押されたときstorage.syncに保存する *****/
// chrome.storage.sync.clear();
const saveTab = document.getElementById("save-tab");
saveTab.addEventListener("click", async () => {
    const pageInfo = getPageInfo();
    const problem = {
        title: pageInfo["title"],
        savedAt: pageInfo["savedAt"]
    }

    // コンテスト単位で問題を保存
    const item = await chrome.storage.sync.get(pageInfo["contest"]);
    if(typeof item[pageInfo["contest"]] === "undefined") {
        // 1.コンテスト自体が保存されていない場合は新たに作成
        chrome.storage.sync.set({[pageInfo["contest"]]: {[pageInfo["url"]]: problem}});
    } else {
        // 2.コンテストがすでに保存されているなら追記
        item[pageInfo["contest"]][pageInfo["url"]] = problem;
        await chrome.storage.sync.set(item);
    }
});

function getPageInfo() {
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