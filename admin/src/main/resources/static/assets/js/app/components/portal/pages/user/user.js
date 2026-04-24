import {htmlPath} from "../../../../../pagesPath/paths.js";


export default function PAGE_USER(path, mainContent) {
    const page = htmlPath.portal.feature.user.user;

    $.get(page).done(html => {
        mainContent.empty().html(html);
    })
        .fail(html => {
            console.error("Can not find html main dashboard ", html);
            mainContent.empty().html("<div>Can not find html main dashboard<div>");
        })

    document.title = "Admin - Dashboard Overview";
}