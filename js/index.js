window.addEventListener("DOMContentLoaded", async () => {
    // chrome storageからデータを取得してテーブルを生成
    const target = document.querySelector("tbody");
    const removeBtn =
    '<button class="btn btn-outline-danger btn-sm">' +
        '<i class="fa-solid fa-trash-can fa-fw"></i>' +
    '</button>';
    const items = await chrome.storage.sync.get();
    for (let [contest, problem] of Object.entries(items)) {
        for(let [url, detail] of Object.entries(problem)) {
            const html =
                '<tr>' +
                    '<td class="text-center align-middle">' + contest + '</td>' +
                    '<td class="pl-4 align-middle"><a href="' + url + '">' + detail["title"] + '</a></td>' +
                    '<td class="text-center align-middle">' + detail["savedAt"] + '</td>' +
                    '<td class="text-center align-middle">' + removeBtn + '</td>' +
                '</tr>'

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
            top: "{select}{pager}",
            bottom: ""
        },
        columns: [
            {select: 3, sortable: false}
        ]
    });
});


// ボタンによって項目を削除
const tbl = document.querySelector("table");
tbl.addEventListener("click", async (event) => {
    const button = event.target.closest('button');
    if(!button) return;

    const tr = button.closest("tr");
    const contest = tr.cells[0].textContent;
    const url = tr.cells[1].firstElementChild.href

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
