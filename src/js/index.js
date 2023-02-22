window.addEventListener("DOMContentLoaded", async () => {
    // chrome storageからデータを取得してテーブルを生成
    const target = document.querySelector("tbody");

    const items = await chrome.storage.sync.get();
    for (let [contest, problem] of Object.entries(items)) {
        for (let [url, detail] of Object.entries(problem)) {
            const deleteBtn =
            `<button class="btn btn-outline-danger btn-sm"  data-bs-toggle="modal" data-bs-target="#confirmationModal" data-contest="${contest}" data-url="${url}" data-title="${detail["title"]}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg>
            </button>`;
            const html =
                `<tr data-contest="${contest}" data-url="${url}">
                    <td class="ellipsis pl-3 align-middle"><a href="${url}">${detail["title"]}</a></td>
                    <td class="note ellipsis pl-3" contenteditable="true">${detail["note"]}</td>
                    <td class="pl-3 ellipsis align-middle">${detail["savedAt"]}</td>
                    <td class="text-center align-middle">${deleteBtn}</td>
                </tr>`

            target.insertAdjacentHTML("beforeend", html);
        }
    }

    // テーブルをソート
    const dataTable = new DataTable("#problem-table", {
        perPage: 25,
        fixedHeight: true,
        labels: {
            placeholder: "Search",
            perPage: "{select}",
            noRows: "No entries to found",
        },
        layout: {
            top: "{pager}{search}",
            bottom: ""
        },
        columns: [
            { select: 3, sortable: false }
        ]
    });

    // noteの内容を保存
    const notes = document.querySelectorAll(".note");
    notes.forEach(note => {
        note.addEventListener("input", async () => {
            const tr = note.closest("tr");
            const contest = tr.getAttribute("data-contest");
            const url = tr.getAttribute("data-url");
            const content = note.innerHTML;

            let item = await chrome.storage.sync.get(contest);
            item[contest][url]["note"] = content;
            // console.log(item[contest][url]);
            await chrome.storage.sync.set(item);
        });
    });

    // 削除の確認モーダル
    const confirmationBtn = document.getElementById("confirmationBtn")
    const confirmationModal = document.getElementById('confirmationModal');
    confirmationModal.addEventListener('show.bs.modal', (event) => {
        const btn = event.relatedTarget;
        const tr = btn.closest("tr");
        const modalBody = confirmationModal.querySelector('.modal-body h6');

        const rowIndex = tr.rowIndex;
        const contest = btn.getAttribute("data-contest");
        const url = btn.getAttribute("data-url");
        const title = btn.getAttribute("data-title");

        confirmationBtn.setAttribute("data-row-index", rowIndex);
        confirmationBtn.setAttribute("data-contest", contest);
        confirmationBtn.setAttribute("data-url", url);
        modalBody.innerHTML = `Are you sure you want to delete "${title}"?`;
    })

    // ボタンによって項目を削除
    confirmationBtn.addEventListener("click", async () => {
        const rowIndex = confirmationBtn.getAttribute("data-row-index");
        const contest = confirmationBtn.getAttribute("data-contest");
        const url = confirmationBtn.getAttribute("data-url");

        const item = await chrome.storage.sync.get(contest);
        const problemsInContest = Object.keys(item[contest]).length;
        if (problemsInContest <= 1) {
            // コンテストが削除対象の問題だけ含んでいるならコンテスト自体を削除
            await chrome.storage.sync.remove(contest);
        } else {
            // 問題を削除
            delete item[contest][url];
            await chrome.storage.sync.set(item);
        }

        dataTable.rows().remove(rowIndex - 1);
    });
});