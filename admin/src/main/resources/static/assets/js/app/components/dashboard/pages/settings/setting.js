import {htmlPath} from "../../../../../pagesPath/paths.js";

export default function SETTING(path, mainContent) {
    const page = htmlPath.dashboard.feature.settings.main_setting;
    if (!mainContent) return;

    $.get(page).done(html => {
        mainContent.empty().html(html);
    })
}