import {htmlPath} from "../../../../pagesPath/paths.js";

export default function MAIN_PORTAL(path, mainContent) {
    const page = htmlPath.portal.layout.mainPage;

    $.get(page).done(html => {
        mainContent.empty().html(html);
    })
        .fail(html => {
            console.error("Can not find html main dashboard ", html);
            mainContent.empty().html("<div>Can not find html main dashboard<div>");
        })

    document.title = "Admin - Portal Overview";
}