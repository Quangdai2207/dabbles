import {htmlPath} from "../../pagesPath/paths.js";

export default function ACCESS_DENIED(path, mainContent) {
    const page = htmlPath.access_denied;

    $.get(page).done(html => mainContent.empty().html(html))
    history.pushState({}, "", path);

    document.title = "403 - Access Denied Permission"
    if (window.history.length <= 1) history.replaceState(null, "", path);
    else history.pushState(null, "", path)
}