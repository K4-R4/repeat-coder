// 保存ボタンのアイコンと色を、問題が保存済みか否かによって切り替える
function toggleButtonColor() {
    const saveBtn = document.getElementById("save-btn");
    const icon = saveBtn.querySelector("span");
    icon.classList.toggle("glyphicon-save");
    icon.classList.toggle("glyphicon-saved");
    icon.classList.toggle("color-ok");
    icon.classList.toggle("color-not-ok");
}

export { toggleButtonColor };
