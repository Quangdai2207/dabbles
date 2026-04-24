
import {htmlPath} from "../../../../pagesPath/paths.js";

export default function ACTIVITY_LOGS(path, mainContent) {
    const page = htmlPath.dashboard.feature.dashboard_activity;

    $.get(page).done(html => {
        mainContent.empty().html(html);
    })
        .fail(html => {
            console.error("Can not find html main dashboard ", html);
            mainContent.empty().html("<div>Can not find html main dashboard<div>");
        })

    document.title = "Admin - Activity logs";
    history.pushState({}, "", path)
}