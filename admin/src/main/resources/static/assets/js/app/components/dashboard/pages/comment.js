import {htmlPath} from "../../../../pagesPath/paths.js";

export default function COMMENTS(path, mainContent) {
    const page = htmlPath.dashboard.feature.dashboard_comment;

    $.get(page).done(html => {
        mainContent.empty().html(html);
    })
        .fail(html => {
            console.error("Can not find html main dashboard ", html);
            mainContent.empty().html("<div>Can not find html main dashboard<div>");
        })

    document.title = "Admin - Comments Management";
    history.pushState({}, "", path)
}