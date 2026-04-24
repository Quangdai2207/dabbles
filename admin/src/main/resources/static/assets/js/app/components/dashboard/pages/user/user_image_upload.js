import {htmlPath} from "../../../../../pagesPath/paths.js";
import imageService from "../../../../services/image/imageService.js";
import {USER_IMAGE_DETAIL} from "./user_image_detail.js";
import {formatSize} from "../../../../../utils/formatPattern.js";
import USER_IMAGE_CATEGORY from "./user_image_category.js";
import {hideProcessing, modalProcessing, updateProcessing} from "../image/image_create.js";

export default async function USER_IMAGE_UPLOAD(authentication, container, identity) {
    const userImageUpload = htmlPath.dashboard.feature.user.user_image_upload;
    if (!container) return;

    await $.get(userImageUpload)
        .done(html => {
            container.empty().html(html)

            const uploadContent = $("#user-details-card-image");
            if (!uploadContent) return;

            const btnAllImages = $("#user-details-upload-btn-all-images");
            const btnBlacklist = $("#user-details-upload-btn-blacklist");
            const btnReloadContainer = $("#user-details-upload-btn-reload-images");
            const btnReloadCategories = $("#user-details-upload-btn-category-view");

            //** Flag switch render when click Reload image cards for All-images Or Blacklist
            let isSelectedBlackList = false;

            renderImages(authentication, uploadContent, identity, isSelectedBlackList);
            deleteImage(authentication, uploadContent, identity, isSelectedBlackList);
            searchKeyword(isSelectedBlackList);
            sortByVisible(isSelectedBlackList);
            sortByLatest(isSelectedBlackList);
            $("#user-detail-image-upload-filter-visible").prop("disabled", false);
            $("#user-detail-image-upload-filter-latest").prop("disabled", false)

            btnAllImages.on("click", function () {
                $("#user-detail-image-upload-search-input").val("");
                $("#user-detail-image-upload-filter-visible").prop("disabled", false);
                $("#user-detail-image-upload-filter-latest").prop("disabled", false)
                $("#user-details-uploaded-path-switch").text("all-image")
                isSelectedBlackList = false;
                renderImages(authentication, uploadContent, identity, isSelectedBlackList);
                deleteImage(authentication, uploadContent, identity, isSelectedBlackList);
                searchKeyword(isSelectedBlackList);
                sortByVisible(isSelectedBlackList);
                sortByLatest(isSelectedBlackList);
            })

            btnBlacklist.on("click", function () {
                $("#user-detail-image-upload-search-input").val("");
                $("#user-detail-image-upload-filter-visible").prop("disabled", true).val("");
                $("#user-detail-image-upload-filter-latest").prop("disabled", false)
                $("#user-details-uploaded-path-switch").text("black-list");
                isSelectedBlackList = true;
                renderImages(authentication, uploadContent, identity, isSelectedBlackList);
                searchKeyword(isSelectedBlackList);
                sortByVisible(isSelectedBlackList);
                sortByLatest(isSelectedBlackList);
            });
            btnReloadContainer.on("click", function () {
                $("#user-detail-image-upload-search-input").val("");
                if (isSelectedBlackList) renderImages(authentication, uploadContent, identity, isSelectedBlackList);
                else renderImages(authentication, uploadContent, identity)
            });

            btnReloadCategories.on("click", function () {
                $("#user-detail-image-upload-search-input").val("");
                $("#user-details-uploaded-path-switch").text("categories")
                USER_IMAGE_CATEGORY(authentication, identity);
            });
        })
        .fail(html => {
            console.error("Cannot load user image upload page >>>", e);
            container
                .empty()
                .html("<div class='text-red-400'>Cannot load user upload image page</div>");
        })
}

//** DOM render if without or image is not yet
function withoutImage(isBlacklist) {
    return `
        <div class="absolute inset-0 flex items-center justify-center mt-10">
            <p class="text-center text-gray-500 font-semibold italic text-xl">
                ${isBlacklist ? "Not yet image within blacklist" : "User not yet image"}
            </p>
        </div>`;
}

//** Fetch images to render
function renderImages(authentication, container, identity, isBlacklist) {
    container.append(modalProcessing("Loading your image…", "loading"));
    imageService.getImageByUser(authentication, identity, isBlacklist)
        .then(async (response) => {
            if (!response.ok) {
                updateProcessing("Loading failed. Please try again.", "error");
                setTimeout(() => hideProcessing(), 1500);
                return;
            }

            if (response.status === 401) {
                location.href = "/auth/login"
                return;
            }

            const {isSuccess, data} = await response.json();

            if (!isSuccess) {
                updateProcessing("Loading failed.", "error");
                setTimeout(() => hideProcessing(), 1500);
                return;
            }

            if (isSuccess && !Array.isArray(data)) {
                container.empty().html(withoutImage(isBlacklist))
                return;
            }

            if (isSuccess && data.length > 0) {
                updateProcessing("Loaded images successfully!", "success");
                container.empty();
                renderUserImages(authentication, data, isBlacklist);
                setTimeout(() => {
                    hideProcessing();
                    initImageViewportScroll();
                }, 1200);
            }
        })
        .catch(e => {
            console.error("Something went wrong while fetch data >>> ", e)
        })
}

//** Render image list with condition isBlacklist when click button all-images/ blacklist
function renderUserImages(authentication, data, isBlacklist) {
    const uploadContent = $("#user-details-card-image");
    if (!uploadContent) return;

    data.forEach(item => {
        if (!isBlacklist) uploadContent.append(renderAllImages(authentication, item));
        else uploadContent.append(renderBlacklist(authentication, item))
    })
}

//** DOM for all imgaes:
function renderAllImages(authentication, data) {
    const {
        id, creator, description, width, height,
        categories, filesize, imageUrls, likeCount,
        public: isPublic, createdDate
    } = data;

    const category = Array.isArray(categories) && categories.length > 0
        ? categories.map(c => c.name).join(" | ")
        : "N/a";

    const image = imageUrls?.original
        ? imageUrls.original
        : `https://demofree.sirv.com/nope-not-here.jpg`;

    const avatar = creator?.avatar
        ? creator.avatar
        : `https://demofree.sirv.com/nope-not-here.jpg`;

    return `
        <div
            data-like="${Number(likeCount) || 0}"
            data-uploaded="${new Date(createdDate).getTime()}"
            data-size="${Number(filesize) || 0}"
            class="user-detail-upload-image-card mt-4 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow w-[240px]
                min-w-[240px] max-w-[240px] justify-self-center group">
            <div class="relative">
                <img
                    src="${image}"
                    onerror="this.src='https://demofree.sirv.com/nope-not-here.jpg'"
                    alt="image.com"
                    class="w-full h-40 object-cover"
                />
                <span class="absolute top-2 left-2 px-2 py-[2px] text-[10px] rounded ${isPublic ? 'bg-green-600' : 'bg-gray-600'} text-white">
                    ${isPublic ? 'Public' : 'Private'}
                </span>

                <div class="absolute inset-0 bg-black/50 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button class=" px-2 py-1  text-[10px]  bg-blue-600 hover:bg-blue-700 rounded-lg  cursor-pointer"
                        onclick="viewImage('${authentication}', '${id}')">
                        View
                    </button>
                    <button class="relative px-2 py-1 text-[10px]  bg-gray-700 hover:bg-gray-800 rounded-lg cursor-pointer"
                        onclick="copyLink('http://localhost:3366/${imageUrls.original}', this)">
                        Copy link
                        <span class="tooltip hidden absolute -top-8 left-1/2  -translate-x-1/2 bg-gray-900 text-white
                                text-xs px-2 py-1 rounded whitespace-nowrap">
                            Copied
                        </span>
                    </button>
                    <button class="btn-delete-card-image px-2 py-1 text-[10px] bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer" data-id="${id}">
                        Del
                    </button>
                </div>
            </div>

            <!-- META -->
            <div class="p-3 space-y-1">
                <!-- CREATOR + LIKE -->
                <div class="flex items-center justify-between">
                    <div class="flex gap-2 min-w-0">
                        <img
                            src="${avatar}"
                            class="w-5 h-5 rounded-full object-cover shrink-0"
                        />

                        <span class="text-xs text-gray-400 truncate">
                            ${creator.name}
                        </span>
                    </div>

                    <div class="text-[10px] text-gray-400 shrink-0">
                        ❤️ ${likeCount}
                    </div>
                </div>

                <!-- TITLE -->
                <p class="text-sm font-medium text-white truncate">
                    ${description}
                </p>

                <!-- INFO -->
                <p class="text-[10px] text-gray-500">
                    <span class="text-gray-400 font-semibold">
                        <span class="text-[8px]">➤</span>
                        Uploaded:
                    </span>
                    ${new Date(createdDate).toLocaleString()}
                </p>
                
                <p class="text-[10px] text-gray-500">
                    <span class="text-gray-400 font-semibold">
                        <span class="text-[8px]">➤</span>
                        Size:
                    </span>
                    ${width}×${height} • ${formatSize(filesize)}
                </p>
            </div>
        </div>
    `;
}


//** DOM for blacklist
function renderBlacklist(authentication, data) {
    const {id, creator, description, width, height, filesize, imageUrls, likeCount, createdDate} = data;

    const image = imageUrls?.original
        ? imageUrls.original
        : `https://demofree.sirv.com/nope-not-here.jpg`;

    const avatar = creator?.avatar
        ? creator.avatar
        : `https://demofree.sirv.com/nope-not-here.jpg`;

    return `
        <div
            data-like="${Number(likeCount) || 0}"
            data-uploaded="${new Date(createdDate).getTime()}"
            data-size="${Number(filesize) || 0}"
            class="user-detail-upload-image-card mt-4 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow min-w-[240px] max-w-[240px] w-full
                justify-self-center
                group">
            <div class="relative">
                <img
                    src="${image}"
                    onerror="this.src='https://demofree.sirv.com/nope-not-here.jpg'"
                    alt="${description}"
                    class="w-full h-40 object-cover"
                />

                <div
                    class="absolute inset-0 bg-black/50 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button class="relative px-2 py-1 text-[10px] bg-gray-700 hover:bg-gray-800 cursor-pointer rounded-lg"
                        onclick="copyLink('${image}', this)">
                        Copy link
                        <span class="tooltip hidden absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                            Copied
                        </span>
                    </button>
                </div>
            </div>

            <div class="p-3 space-y-1">
                <div class="flex items-center justify-between">
                    <div class="flex gap-2 min-w-0">
                        <img src="${avatar}" class="w-5 h-5 rounded-full object-cover shrink-0" />
                        <span class="text-xs text-gray-400 truncate">
                            ${creator.name}
                        </span>
                    </div>

                    <div
                        class="flex text-[10px] text-gray-400"
                        data-like="${likeCount}">
                        ❤️ ${likeCount}
                    </div>
                </div>

                <p class="text-sm font-medium text-white truncate">
                    ${description}
                </p>

                <p class="text-[10px] text-gray-500">
                    <span class="text-gray-400 font-semibold">
                        <span class="text-[8px]">➤</span>
                        Uploaded:
                    </span>
                    ${new Date(createdDate).toLocaleString()}
                </p>

                <p class="text-[10px] text-gray-500">
                    <span class="text-gray-400 font-semibold">
                        <span class="text-[8px]">➤</span>
                        Category:
                    </span>
                    N/a
                </p>

                <p class="text-[10px] text-gray-500">
                    <span class="text-gray-400 font-semibold">
                        <span class="text-[8px]">➤</span>
                        Size:
                    </span>
                    ${width}×${height} • ${formatSize(filesize)}
                </p>
            </div>
        </div>
    `;
}

//** Scroll image view port
function initImageViewportScroll() {
    const uploadContent = $("#user-details-card-image");
    const $btnLeft = $("#image-scroll-left");
    const $btnRight = $("#image-scroll-right");

    if (!uploadContent.length || !$btnLeft.length || !$btnRight.length) return;

    function getViewportWidth() {
        return uploadContent[0].clientWidth;
    }

    $btnRight.on("click", function () {
        uploadContent[0].scrollBy({
            left: getViewportWidth(), behavior: "smooth"
        });
    });

    $btnLeft.on("click", function () {
        uploadContent[0].scrollBy({
            left: -getViewportWidth(), behavior: "smooth"
        });
    });
}

//** Action Render page image detail
window.viewImage = async function viewImage(authentication, id) {
    USER_IMAGE_DETAIL(authentication, id);
}

//** Window onclick copy link
window.copyLink = async function copyLink(link) {
    navigator.clipboard.writeText(link)
        .then(() => {
            $(".tooltip").removeClass("hidden")
            setTimeout(() => {
                $(".tooltip").addClass("hidden")
            }, 1000)
        })
        .catch(err => {
            console.error("Copy failed:", err);
            alert("Cannot copy link");
        });
}


//** Delete image, uses for all-images tab
async function deleteImage(authentication, container, identity, isBlacklist) {
    $(document)
        .off("click", ".btn-delete-card-image")
        .on("click", ".btn-delete-card-image", function () {
            const imageId = $(this).data("id");

            imageService.deleteImageById(authentication, imageId)
                .then(async (response) => {
                    if (!response || !response.ok) {
                        console.error("Delete image has an error, recheck.");
                        return;
                    }
                    const {isSuccess} = await response.json();
                    if (isSuccess) {
                        $("#user-details-uploaded-path-alert").text(`[${imageId}] moved to Blacklist`)
                        renderImages(authentication, container, identity, isBlacklist)

                        setTimeout(() => {
                            $("#user-details-uploaded-path-alert").text("")
                        }, 1000)
                    }
                })
                .catch(async e => console.error("Something went wrong while process delete image >>>", e))
        });
}

//** Search Keyword for image
function searchKeyword(isBlacklist = false) {
    const searchInput = $("#user-detail-image-upload-search-input");
    searchInput.on("input", function () {
        let keyword = $(this).val().toLocaleLowerCase().trim();
        const containerWrapper = $("#user-details-card-image .user-detail-upload-image-card");
        containerWrapper.each(function () {
            const textContent = $(this).text().toLocaleLowerCase().trim();

            if (!isBlacklist && textContent.indexOf(keyword) > -1) $(this).show(); else if (isBlacklist && textContent.indexOf(keyword) > -1) $(this).show(); else $(this).hide();
        });
    })
}

//** Filter for Combobox Visible
function sortByVisible(isBlacklist = false) {
    const combobox = $("#user-detail-image-upload-filter-visible");
    combobox.on("change", function () {
        const value = $(this).val();
        const containerWrapper = $("#user-details-card-image .user-detail-upload-image-card");
        containerWrapper.each(function () {
            const textContent = $(this).text().toLocaleLowerCase().trim();

            if (!isBlacklist && textContent.indexOf(value) > -1) $(this).show(); else $(this).hide();
        });
    })
}

//** Filter option for combobox "Select OPtion"
function sortByLatest(isBlacklist = false) {
    const combobox = $("#user-detail-image-upload-filter-latest");

    combobox.on("change", function () {
        const value = $(this).val();

        const $container = $("#user-details-card-image");
        const cards = $container.find(".user-detail-upload-image-card").get();

        if (!isBlacklist && value !== "") {
            cards.sort(function (a, b) {
                const createdA = Number($(a).data("uploaded"));
                const createdB = Number($(b).data("uploaded"));
                const likesA = Number($(a).data("like"));
                const likesB = Number($(b).data("like"));
                const sizeA = Number($(a).data("size"));
                const sizeB = Number($(b).data("size"));

                switch (value) {
                    case "1": // Oldest
                        return createdA - createdB;
                    case "2": // Most liked
                        return likesB - likesA;
                    case "3": // Largest size
                        return sizeB - sizeA;
                    default:
                        return 0;
                }
            });
        }

        $.each(cards, function (_, card) {
            $container.append(card);
        });
    });
}




