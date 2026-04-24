import {htmlPath} from "../../../../../pagesPath/paths.js";
import {getAuthentication} from "../../../../../utils/Token.js";
import userService from "../../../../services/user/userService.js";
import {renderDataInfo} from "./user_info.js";
import USER_IMAGE_UPLOAD from "./user_image_upload.js";
import USER_IMAGE_DOWNLOAD from "./image_download/user_image_download.js";
import imageService from "../../../../services/image/imageService.js";
import {formatSize, timeAgo} from "../../../../../utils/formatPattern.js";
import {userImageContext} from "../../../../hooks/context/userImageContext.js";

export async function USER_IMAGE(path, mainContent, identity) {
    const pageUserPayment = htmlPath.dashboard.feature.user.user_image;
    const authentication = getAuthentication();

    if (!mainContent) return;

    const response = await userService.getDetails(authentication, identity);
    const {data} = await response.json();

    renderDataInfo(data)
    $.get(pageUserPayment)
        .done(html => {
            mainContent.empty().html(html)
            const sectionImage = $("#user-details-image");

            if (!sectionImage) return;

            const header = $("#user-details-image-header");
            showInfoHeader(authentication, identity);

            const containerId = $("#user-details-images-container");

            USER_IMAGE_UPLOAD(authentication, containerId, identity);


            if (!header) return;
            const btnUpload = $("#user-details-btn-upload");
            const btnDownload = $("#user-details-btn-download");
            const btnReload = $("#user-details-btn-reload");

            btnUpload.on("click", function () {
                USER_IMAGE_UPLOAD(authentication, containerId, identity);
            });

            btnDownload.on("click", function () {
                USER_IMAGE_DOWNLOAD(authentication, containerId, identity)
            });

            btnReload.on("click", function () {
                showInfoHeader(authentication, identity);
            })

            document.title = "Admin - User Details Images";
        })
        .fail(html => {
            console.error("Cannot load user payment page >>>", e);
            mainContent
                .empty()
                .html("<div class='text-red-400'>Cannot load user payment page</div>");
        })
}

//** Show info header at the user details images
export function showInfoHeader(authentication, identity) {
    imageService.getImageByUser(authentication, identity)
        .then(async (response) => {
            if (!response.ok) {
                console.error("Can not found data Or occurred error");
                return;
            }

            const {data} = await response.json();
            await userImageContext.setData(data, authentication, identity);
        })
        .catch(async (e) => {
            console.error("Something went wrong while fetch data >>> ", e);
        })
}

export function renderStatsUserImage(
    uploadTotal, downloadTotal, publicTotal, privateTotal,
    sizeTotal, latestUpload, blackListTotal, blacklistSizeTotal
) {
    $("#user-details-upload-image-total-size").text(`${sizeTotal}`)
    $("#user-details-public-image-total").text(publicTotal);
    $("#user-details-private-image-total").text(privateTotal);
    $("#user-details-lastest-upload-image").text(latestUpload)
    $("#user-details-upload-image-delete-size-total").text(blacklistSizeTotal);

    $("#user-details-upload-image-total").html(`
      <span class="inline-flex items-baseline gap-2">
        <span class="text-base font-semibold">${uploadTotal}</span>
        <span class="text-xs text-gray-400 font-semibold">image(s)</span>
      </span>
    `);

    $("#user-details-download-image-total").html(`
      <span class="inline-flex items-baseline gap-2">
        <span class="text-base font-semibold">${downloadTotal}</span>
        <span class="text-xs text-gray-400 font-semibold">image(s)</span>
      </span>
    `);

    $("#user-details-upload-image-delete").html(`
      <span class="inline-flex items-baseline gap-2">
        <span class="text-base font-semibold">${blackListTotal}</span>
        <span class="text-xs text-gray-400 font-semibold">image(s)</span>
      </span>
    `);
}






