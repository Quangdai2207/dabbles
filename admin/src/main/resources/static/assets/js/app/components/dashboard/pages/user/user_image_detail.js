import {htmlPath} from "../../../../../pagesPath/paths.js";
import imageService from "../../../../services/image/imageService.js";
import {formatSize} from "../../../../../utils/formatPattern.js";

export function USER_IMAGE_DETAIL(authentication, identity) {
    const page = htmlPath.dashboard.feature.user.user_image_details;

    const root = $("#root");

    $.get(page)
        .done(html => {
            root.append(html);
            const btnCloseImagePopup = $("#btn-image-details-popup");
            const btnDelete = $("#user-image-details-delete");
            btnCloseImagePopup.on("click", function () {
                $("#user-image-detail-popup").remove();
            });
            btnDelete.on("click", function () {
                deleteImage(authentication, identity)
            });
            initImageDetailTabs();
            imageDetail(authentication, identity)
        })
        .fail(html => {
            console.error("Can not found image detail html.")
        })
}

function deleteImage(authentication, identity) {
    imageService.deleteImageById(authentication, identity)
        .then(async (response) => {
            if (!response || !response.ok) {
                console.error("Delete image has an error, recheck.");
                return;
            }
            const {isSuccess} = await response.json();
            if (isSuccess) window.location.reload();
        })
        .catch(async e => console.error("Something went wrong while process delete image >>>", e))
}

function initImageDetailTabs() {
    $("#image-detail-tabs")
        .off("click.tab")
        .on("click.tab", ".tab-btn", function () {
            const tab = $(this).data("tab");

            $("#image-detail-tabs .tab-btn")
                .removeClass("bg-gray-800 text-white")
                .addClass("bg-gray-900 text-gray-400");

            $(this)
                .addClass("bg-gray-800 text-white")
                .removeClass("bg-gray-900 text-gray-400");

            $("[data-tab-content]").addClass("hidden");
            $(`[data-tab-content="${tab}"]`).removeClass("hidden");
        });
}

function imageDetail(authentication, identity) {
    imageService.getImageById(authentication, identity)
        .then(async (response) => {
            const {data} = await response.json();
            await renderImageData(data);
        })
        .catch(async (e) => {
            console.error("Something went wrong while fetch data >>> ", e);
        })
}

async function renderImageData(data) {
    const {
        id, creator, width, height, categories, createdDate, price, commentCount,
        filesize, imageUrls, likeCount, public: isPublic, description
    } = data;

    const image = imageUrls?.original
        ? imageUrls.original
        : 'https://demofree.sirv.com/nope-not-here.jpg'

    const {avatar, name} = creator
    const avatarUrl =
        avatar == null || avatar === ""
            ? "https://placehold.co/160"
            : /^https?:\/\//.test(avatar)
                ? avatar
                : `http://27.78.77.132:3366/${avatar}`;

    //** Show Image content within Left-frame
    const imageFrame = $("#user-image-detail-preview");
    if (!imageFrame) return;

    imageFrame.prop("src", image);

    //** Set Frame Image infos
    const frameHeader = $("#user-details-image-header");
    await setHeaderFrameImage(frameHeader, description, id, isPublic)
    await setInfoRightFrame(avatarUrl, width, height, likeCount,
        filesize, createdDate, description, name, categories,
        price, commentCount
    )
    await setInfoRightFrameSize(imageFrame, imageUrls)
}

async function setInfoRightFrame(
    avatar, width, height, like, size, createdDate, desc, name, categories,
    price, comment
) {
    const createdDateSplit = new Date(createdDate.replace(' ', 'T') + 'Z').toLocaleString().split(" ");
    const time = createdDateSplit[0];
    const date = createdDateSplit[1];
    //** Tab info
    const tabInfoAvatar = $("#user-details-right-frame-image-detail-avatar")
    const tabInfoCreatedTime = $("#user-details-right-frame-image-detail-created-time")
    const tabInfoCreatedDate = $("#user-details-right-frame-image-detail-created-date")
    const tabInfoDesc = $("#user-details-right-frame-image-detail-desc")
    const tabInfoSize = $("#user-details-right-frame-image-detail-size")
    const tabInfoWidth = $("#user-details-right-frame-image-detail-width")
    const tabInfoLke = $("#user-details-right-frame-image-detail-like")
    const tabInfoName = $("#user-details-right-frame-image-detail-name")
    const tabInfoCategories = $("#user-details-right-frame-image-detail-categories")
    const tabInfoPrice = $("#user-details-right-frame-image-detail-price")
    const tabInfoComment = $("#user-details-right-frame-image-detail-comment")
    const tabInfoCreatorStatus = $("#user-details-right-frame-image-detail-creator-status")

    tabInfoCreatorStatus.text("Active");
    tabInfoAvatar.prop("src", avatar);
    tabInfoCreatedTime.text(time);
    tabInfoCreatedDate.text(date);
    tabInfoWidth.text(`${width} x ${height}`);
    tabInfoSize.text(formatSize(size));
    tabInfoLke.text(like);
    tabInfoDesc.text(desc);
    tabInfoName.text(name);
    tabInfoPrice.text(`$ ${price}`)
    tabInfoComment.text(comment);
    Array.isArray(categories) && categories.forEach(item => {
        tabInfoCategories.append(`
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mx-1
                        bg-gray-800 border border-gray-700 text-sm 
                        text-gray-200 hover:bg-gray-700 transition">
                <span class="w-2 h-2 rounded-full bg-indigo-400"></span>
                <span class="font-semibold text-[10px]">
                    ${item.name}
                </span>
            </div>
        `);
    });
}

async function setInfoRightFrameSize(imageFrame, sizes) {

    if (!$("#user-image-details-size")) return;
    const btnWidth = {
        w236: $("#user-details-right-frame-image-detail-w1"),
        w474: $("#user-details-right-frame-image-detail-w2"),
        w736: $("#user-details-right-frame-image-detail-w3"),
        w1080: $("#user-details-right-frame-image-detail-w4"),
        original: $("#user-details-right-frame-image-detail-w5"),
        newTab: $("#user-details-right-frame-image-detail-new-tab")
    }

    for (let key in btnWidth) {
        btnWidth[key].on("click", function () {
            for (let k in btnWidth) {
                btnWidth[k]
                    .removeClass("bg-gray-900")
                    .addClass("bg-gray-800");
            }

            btnWidth[key]
                .removeClass("bg-gray-800")
                .addClass("bg-gray-900");

            if (key === "newTab") {
                window.open(sizes.original, "_blank");
                return;
            }

            if (key === "w1080") {
                imageFrame.prop(
                    "src",
                    sizes.original
                );
                return;
            }

            imageFrame.prop(
                "src",
                sizes[key]
                    ? sizes[key]
                    : "https://demofree.sirv.com/nope-not-here.jpg"
            );
        });
        btnWidth[key]
            .removeClass("bg-gray-900")
            .addClass("bg-gray-800");
    }
}

async function setHeaderFrameImage(frameHeader, title, id, isPublic) {
    if (!frameHeader) return;
    const imageTile = $("#user-image-details-title");
    const imageId = $("#user-image-details-id");
    const imagePublic = $("#user-image-details-isPublic");
    imageTile.text(title)
    imageId.text("ID: " + id)

    if (isPublic) imagePublic.addClass("px-4 py-1.5 text-xs rounded-full bg-green-900/40 text-green-400 border-green-400 border").text("Public")
    else imagePublic.addClass("px-4 py-1.5 text-xs rounded-full bg-gray-900/40 text-gray-400 border-gray-400 border").text("Private")
}

