
import {htmlPath} from "../../../../pagesPath/paths.js";

export default function CONVERSATION(path, mainContent) {
    const page = htmlPath.dashboard.feature.dashboard_conversation;

    $.get(page).done(html => {
        mainContent.empty().html(html);
    })
        .fail(html => {
            console.error("Can not find html main dashboard ", html);
            mainContent.empty().html("<div>Can not find html main dashboard<div>");
        })

    document.title = "Admin - Conversation Management";
    history.pushState({}, "", path)
}