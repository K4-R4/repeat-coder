window.addEventListener("DOMContentLoaded", async () => {
    // chrome storageからデータを取得してテーブルを生成
    const target = document.querySelector("tbody");
    const removeBtn =
    `<button class="btn btn-outline-danger btn-sm">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
        </svg>
    </button>`;
    const items = await chrome.storage.sync.get();
    for (let [contest, problem] of Object.entries(items)) {
        for(let [url, detail] of Object.entries(problem)) {
            const html =
                `<tr>
                    <td class="pl-3 align-middle" data-contest="${contest}"><a href="${url}">${detail["title"]}</a></td>
                    <td class="pl-3 align-middle">${detail["savedAt"]}</td>
                    <td class="text-center align-middle">${removeBtn}</td>
                </tr>`

            target.insertAdjacentHTML("beforeend", html);
        }
    }

    // テーブルをソート
    const dataTable = new DataTable("#problem-table", {
        fixedHeight: true,
        labels: {
            placeholder: "Search",
            perPage: "{select}",
            noRows: "No entries to found",
        },
        layout: {
            top: "{select}{search}",
            bottom: "{pager}"
        },
        columns: [
            {select: 2, sortable: false}
        ]
    });
});


// ボタンによって項目を削除
const tbl = document.querySelector("table");
tbl.addEventListener("click", async (event) => {
    const button = event.target.closest("button");
    if(!button) return;

    const tr = button.closest("tr");
    const contest = tr.cells[0].getAttribute("data-contest");
    const url = tr.cells[0].firstElementChild.href

    const item = await chrome.storage.sync.get(contest);
    const problemsInContest = Object.keys(item[contest]).length;
    if(problemsInContest <= 1) {
        // コンテストが削除対象の問題だけ含んでいるならコンテスト自体を削除
        await chrome.storage.sync.remove(contest);
    } else {
        // 問題を削除
        delete item[contest][url];
        await chrome.storage.sync.set(item);
    }

    const rowIndex = tr.rowIndex;
    tbl.deleteRow(rowIndex);
})
