import imageService from "../../../../services/image/imageService.js";
import {formatSize} from "../../../../../utils/formatPattern.js";
import {hideProcessing, modalProcessing, updateProcessing} from "../image/image_create.js";

export default function USER_IMAGE_CATEGORY(authentication, identity, isBlacklist) {
    const uploadContent = $("#user-details-card-image");

    if (!uploadContent.length) return;
    $("#user-detail-image-upload-filter-latest")
        .prop("disabled", true)

    $("#user-detail-image-upload-filter-visible")
        .prop("disabled", true);

    uploadContent.empty();

    handleImagesData(authentication, identity, isBlacklist, uploadContent)
}

function renderImageByCategory(authentication, identity, container, data) {
    // Group by category
    const map = {};

    data.forEach(item => {
        //** Get Properties image
        const {
            id, creator, description, width, height,
            categories = [],
            filesize, imageUrls,
            likeCount,
            createdDate
        } = item;
        //** Check Category list
        if (!categories || categories.length === 0) return;
        const isPublic = !!item.public;

        categories.forEach(c => {
            const name = c.name || "Others";

            if (!map[name]) map[name] = [];

            map[name].push({
                id, creator, description, width, height,
                filesize, imageUrls,
                likeCount, isPublic, createdDate
            });
        });
    });

    // render từng category
    Object.keys(map).forEach(categoryName => {
        const list = map[categoryName];
        const count = list.length;

        //** Create Virtual DOM section container category wrapper
        const section = $(`
                <section class="section-category-image space-y-3 mt-4" data-category="${categoryName}">
                
                    <button class="category-header w-full flex items-center justify-between
                        px-3 py-2 bg-gray-800/70 border border-gray-700 rounded-lg
                        hover:bg-gray-800 transition cursor-pointer">
                
                        <div class="flex items-center gap-2">
                            <svg class="arrow w-4 h-4 text-gray-300 transform transition-transform duration-200"
                                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                       d="M9 5l7 7-7 7"/>
                            </svg>
                
                            <span class="text-white font-semibold text-sm">
                                ${categoryName}
                            </span>
                        </div>
                
                        <span class="px-2 py-[2px] text-[11px] rounded bg-gray-700 text-gray-200">
                            ${count} images
                        </span>
                    </button>
                    <div class="relative">
                        <div class="category-grid
                            grid grid-flow-col auto-cols-[240px] gap-6
                            overflow-x-auto pb-2
                            [&::-webkit-scrollbar]:hidden
                            [-ms-overflow-style:none]
                            [scrollbar-width:none]
                        "></div>
                    </div>
                </section>`);

        const grid = section.find(".category-grid");
        const arrow = section.find(".arrow");
        const header = section.find(".category-header");

        header.on("click", function () {
            grid.toggleClass("hidden");
            arrow.toggleClass("rotate-90");
        });
        // ** render card image within collection Category
        list.forEach(img => {
            const {
                id, creator, description, width, height,
                filesize, imageUrls = {},
                likeCount = 0, isPublic
            } = img;

            const image = imageUrls?.original
                ? imageUrls.original
                : `https://demofree.sirv.com/nope-not-here.jpg`;

            const avatar = creator?.avatar
                ? creator.avatar
                : `https://demofree.sirv.com/nope-not-here.jpg`;

            const card = $(`
                <div class="user-detail-upload-image-card
                    bg-gray-900 border border-gray-800 rounded-xl
                    overflow-hidden shadow
                    w-[240px] min-w-[240px] max-w-[240px]
                    justify-self-center
                    group"
                    data-like="${likeCount}"
                    data-uploaded="${img.createdDate}"
                    data-size="${filesize}"
                >
                    <div class="relative">
                        <img
                            src="${image}"
                            onerror="this.src='https://demofree.sirv.com/nope-not-here.jpg'"
                            alt="image.com"
                            class="w-full h-40 object-cover"
                        />

                        <span class="
                            absolute top-2 left-2
                            px-2 py-[2px] text-[10px] rounded
                            ${isPublic ? 'bg-green-600' : 'bg-gray-600'}
                            text-white">
                            ${isPublic ? 'Public' : 'Private'}
                        </span>

                        <div class="
                            absolute inset-0 bg-black/50
                            flex items-center justify-center gap-2
                            opacity-0 group-hover:opacity-100
                            transition">

                            <button
                                class="px-2 py-1 text-[10px] bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
                                onclick="viewImage('${authentication}', '${id}')">
                                View
                            </button>

                            <button
                                class="relative px-2 py-1 text-[10px] bg-gray-700 hover:bg-gray-800 rounded-lg cursor-pointer"
                                onclick="copyLink('${image}', this)">
                                Copy link
                                <span class="tooltip hidden absolute -top-8 left-1/2 -translate-x-1/2
                                    bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                    Copied
                                </span>
                            </button>

                            <button
                                class="btn-delete-card-image px-2 py-1 text-[10px] bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer"
                                data-id="${id}">
                                Del
                            </button>
                        </div>
                    </div>

                    <div class="p-3 space-y-1">

                        <div class="flex items-center justify-between">
                            <div class="flex gap-2 min-w-0">
                                <img
                                    src="${avatar}"
                                    onerror="this.src='https://demofree.sirv.com/nope-not-here.jpg'"
                                    class="w-5 h-5 rounded-full object-cover shrink-0" />
                                <span class="text-xs text-gray-400 truncate">
                                    ${creator.name}
                                </span>
                            </div>

                            <div class="text-[10px] text-gray-400 shrink-0">
                                ❤️ ${likeCount}
                            </div>
                        </div>

                        <p class="text-sm font-medium text-white truncate">
                            ${description}
                        </p>

                        <p class="text-[10px] text-gray-500">
                            <span class="text-gray-400 font-semibold">
                                <span class="text-[8px]">➤</span> Size:
                            </span>
                            ${width}×${height} • ${formatSize(Number(filesize))}
                        </p>
                    </div>
                </div>
            `);

            grid.append(card);
        });

        container.append(section);
    });
}

function handleImagesData(authentication, identity, isBlacklist, container) {
    container.append(modalProcessing("Loading your categories…", "loading"));
    imageService.getImageByUser(authentication, identity, isBlacklist)
        .then(async (response) => {
            if (!response?.ok) {
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
                updateProcessing( "Loading failed.", "error");
                setTimeout(() => hideProcessing(), 1500);
                return;
            }

            if (isSuccess && !Array.isArray(data)) {
                updateProcessing( "Without your category", "error");
                container.empty().append(withoutCategory())
                setTimeout(() => {
                    hideProcessing()
                }, 1500);
                return;
            }

            if (isSuccess && data.length > 0) {
                updateProcessing("Loaded images successfully!", "success");
                container.empty();
                await renderImageByCategory(authentication, identity, container, data)
                setTimeout(() => {
                    hideProcessing();
                }, 1200);
            }

        })
        .catch(e => {
            console.error("Something went wrong while fetch data >>> ", e)
        })
}

function withoutCategory() {
    return `
        <div class="absolute inset-0 flex items-center justify-center mt-10">
            <p class="text-center text-gray-500 font-semibold italic text-xl">
                Without any category
            </p>
        </div>`;
}

function searchCategoryName() {
    const searchInput = $("#user-detail-image-upload-search-input");

    searchInput.on("input", function () {
        const keyword = $(this).val().toLowerCase().trim();

        $(".section-category-image").each(function () {

            const cateName = ($(this).data("category") || "")
                .toString()
                .toLowerCase();

            const matched = cateName.includes(keyword);
            $(this).toggle(matched);
        });
    });
}
