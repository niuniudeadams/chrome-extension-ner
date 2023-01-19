import { getActiveTabURL } from "./utils.js";

document.addEventListener("DOMContentLoaded", async () => {

    const container = document.getElementsByClassName("container")[0];
    var html = '<div class="title">Press the Button to highlight the entity in this page</div>';
    html+='<button id="main_button" type="button" >HIGHLIGHT!</button>'
    container.innerHTML = html;
    const button = document.getElementById("main_button");
    button.addEventListener("click",highlight);


});

const highlight = async()=> {

    const activeTab = await getActiveTabURL();

    chrome.tabs.sendMessage(activeTab.id, {
        type: "NEW",
    });
};




