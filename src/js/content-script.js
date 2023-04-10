import { getProblemDetail, isSaved } from "./web-reader.js";
import { saveProblem } from "./list-operation.js";
import { toggleButtonColor } from "./button-style.js";

export function main() {
    //  問題ページにその問題を記録するための保存ボタンを追加する
    const target = document.querySelector("#contest-nav-tabs ul");
    const btnHtml =
        `<li id="save-btn"><a href="javascript:void(0)">
            <span class="glyphicon glyphicon-save color-not-ok" aria-hidden="true"></span>
        </a></li>`;
    target.insertAdjacentHTML("beforeend", btnHtml);

    const saveBtn = document.getElementById("save-btn");
    initializeSaveButton();
    // 保存ボタンが押されたときに保存する
    saveBtn.addEventListener("click", async () => {
        const [contest, url, problem] = getProblemDetail();
        await saveProblem(contest, url, problem);
        toggleButtonColor();
    });

    async function initializeSaveButton() {
        if (await isSaved()) {
            toggleButtonColor();
        }
    }
}
