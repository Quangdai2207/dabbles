import {htmlPath} from "../../../../pagesPath/paths.js";

export default function SERVER_STATUS(path, mainContent) {
    const page = htmlPath.dashboard.feature.dashboard_server_status;
    console.log("mainContent: ", mainContent);
    $.get(page).done(html => {
        mainContent.empty().html(html);
    })
        .fail(html => {
            console.error("Can not find html main dashboard ", html);
            mainContent.empty().html("<div>Can not find html main dashboard<div>");
        })

    document.title = "Admin - Server status";
    history.pushState({}, "", path)
}