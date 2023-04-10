import { deleteProblem } from "./list-operation.js";
import { getAttributeFromNode, setAttributeToNode } from "./util.js";
import { generateTableRows } from "./table-generator.js";

window.addEventListener("DOMContentLoaded", async () => {
    // chrome storageからデータを取得してテーブルの各行を生成
    const target = document.querySelector("tbody");
    const rows = await generateTableRows();
    target.insertAdjacentHTML("beforeend", rows);


    const dataTable = new DataTable("#problem-table", {
        perPage: 10,
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
            // ３列目は削除ボタンなのでソートしない
            { select: 3, sortable: false }
        ]
    });


    // テーブルのnoteセルに入力があった際、chrome storageの情報を逐一更新する
    const notes = document.querySelectorAll(".note");
    notes.forEach(note => {
        note.addEventListener("input", async () => {
            const tr = note.closest("tr");
            const [contest, url] = getAttributeFromNode(tr, ["data-contest", "data-url"]);
            const content = note.innerHTML;

            const item = await chrome.storage.sync.get(contest);
            item[contest][url]["note"] = content;
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
        const [contest, url, title] = getAttributeFromNode(btn, ["data-contest", "data-url", "data-title"]);

        // ボタンと同じ行から取得したcontest, url, title, rowIndexの情報をモーダルの削除ボタンにセットする
        setAttributeToNode(confirmationBtn, [["data-row-index", rowIndex], ["data-contest", contest], ["data-url", url]]);
        modalBody.innerHTML = `Are you sure you want to delete "${title}"?`;
    })


    // 削除確認モーダルで、確認のボタンが押されたときに項目を削除
    confirmationBtn.addEventListener("click", async () => {
        const [rowIndex, contest, url] = getAttributeFromNode(confirmationBtn, ["data-row-index", "data-contest", "data-url"]);

        // chrome storageから削除
        deleteProblem(contest, url);

        // テーブルから削除
        dataTable.rows().remove(rowIndex - 1);
    });
});
