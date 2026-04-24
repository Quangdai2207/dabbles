import {htmlPath} from "../../../../pagesPath/paths.js";

export default function BOARD(path, mainContent) {
    const page = htmlPath.dashboard.feature.dashboard_board;

    $.get(page).done(html => {
        mainContent.empty().html(html);
    })
        .fail(html => {
            console.error("Can not find html main dashboard ", html);
            mainContent.empty().html("<div>Can not find html main dashboard<div>");
        })

    document.title = "Admin - Board management";
    history.pushState({}, "", path)
}