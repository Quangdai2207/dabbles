import {htmlPath} from "../../../../../../pagesPath/paths.js";

export default async function USER_IMAGE_DOWNLOAD(authentication, container, identity) {
    const page = htmlPath.dashboard.feature.user.user_image_download;
    if (!container) return;

    $.get(page)
        .done(html => {
            container.empty().html(html);
        })
        .fail(html => {
            console.error("Cannot load user download image upload page >>>", e);
            container
                .empty()
                .html("<div class='text-red-400'>Cannot load user download image page</div>");
        })
}