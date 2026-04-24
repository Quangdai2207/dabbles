import {htmlPath} from "../../../../../../pagesPath/paths.js";
import imageService from "../../../../../services/image/imageService.js";
import {formatSize} from "../../../../../../utils/formatPattern.js";

export default async function PREVIEW_IMAGE(authentication, cateId) {
    const page = htmlPath.dashboard.feature.category.preview_images;
    const root = $("#root");

    await $.get(page).done(html => {
        root.append(html)
        closeCategoryPreview();

        let currentPage = 0;
        let size = 40;
        let isLoading = false;
        let hasMore = true;

        $("#category-image-preview-btn-close").on("click", function () {
            $("#category-preview-images-frame").remove();
        })

        //** Default render when admin click preview category images
        getImagesByCategory(authentication, cateId, currentPage, size);
        $("#category-image-collapse")
            .removeClass("bg-orange-600 cursor-pointer hover:bg-orange-700")
            .addClass("bg-gray-500")
            .prop("disabled", true);
        $("#category-image-preview-list").off("scroll").on("scroll", async function () {
            if (isLoading || !hasMore) return;

            const scrollTop = this.scrollTop;
            const clientHeight = this.clientHeight;
            const scrollHeight = this.scrollHeight;

            // Gần chạm đáy (cách 50px)
            if (scrollTop + clientHeight >= scrollHeight - 50) {
                isLoading = true;
                $("#no-more-images-alert")
                    .removeClass("hidden")
                    .text("Loading...");

                $("#category-image-collapse")
                    .removeClass("bg-gray-500")
                    .addClass("bg-orange-600 cursor-pointer hover:bg-orange-700")
                    .prop("disabled", false);
                currentPage++;

                const result = await getImagesByCategory(
                    authentication,
                    cateId,
                    currentPage,
                    size
                );

                // Nếu BE trả về ít hơn size → hết ảnh
                if (!result || result.length < size) {
                    hasMore = false;
                    $("#no-more-images-alert")
                        .removeClass("hidden")
                        .text("No more images");
                } else {
                    $("#no-more-images-alert").addClass("hidden").text("");
                }

                isLoading = false;
            }
        });
        $("#category-image-collapse").off("click").on("click", async function () {
            if (currentPage === 0) return;

            const $frame = $("#category-image-preview-list");
            $frame.children().remove();
            $frame.scrollTop(0);
            currentPage = 0;
            $("#no-more-images-alert").addClass("hidden").text("");
            await getImagesByCategory(authentication, cateId, currentPage, size);
            $(this)
                .removeClass("bg-orange-600 cursor-pointer hover:bg-orange-700")
                .addClass("bg-gray-500")
                .prop("disabled", true);

            isLoading = false;
            hasMore = true;
        });
    })
        .fail(html => {
            console.error("Can not find html preview image html ", html);
            root.empty().html("<div>Can not find preview image html<div>");
        })
}

//** Close frame preview images
function closeCategoryPreview() {
    $(document).on("keydown", function (e) {
        if (e.key === "Escape") {
            $("#category-preview-images-frame").remove();
        }
    });
}

async function getImagesByCategory(authentication, cateId, page, size) {
    const response = await imageService.getImagesByCategoryPaginate(
        authentication,
        cateId,
        page,
        size
    )

    try {
        if (!response.ok || response.status === 401) {
            location.href = "/auth/login";
            return;
        }

        if (response.status >= 400 && response.status !== 401) {
            withoutImage();
            return;
        }

        const {isSuccess, data, message} = await response.json();
        if (!isSuccess) return;

        //** No more Images to load
        if (!Array.isArray(data) || data.length === 0) {
            $("#no-more-images-alert").removeClass("hidden").text(message);
            disableLoadMoreBtn();
            return;
        }

        data.forEach(renderImage);
        //** Render Details image
        renderImageDetails()
    } catch (e) {
        console.error("Something went wrong while progress data >>> ", e);
    }
}

function disableLoadMoreBtn() {
    $("#btn-load-more-images")
        .prop("disabled", true)
        .addClass("opacity-50 cursor-not-allowed bg-gray-950")
        .text("No more images");
}


function withoutImage() {
    $("#category-preview-images-frame").append(`<div class="mx-auto">
        <p class="font-bold text-gray-500 text-center text-[20px]">
            Without Image
        </p>
    </div>`)
}

function safeUrl(path, fallback) {
    if (!path) return fallback;
    return path.replace(/^\/+/, "");
}

function getFileExt(path = "") {
    if (!path) return "unknown";
    const clean = path.split("?")[0];
    const parts = clean.split(".");
    return parts.length > 1 ? parts.pop().toLowerCase() : "unknown";
}

function formatDateSafe(date) {
    const d = new Date(date);
    return isNaN(d) ? "N/A" : d.toLocaleString();
}

function renderImage(data) {
    const {
        id, creator = {}, width, height,
        filesize, imageUrls = {}, likeCount,
        categories = [], createdDate, price,
        description, commentCount
    } = data;

    const isPublic = !!data.public;

    const image = imageUrls?.original
        ? safeUrl(imageUrls.original, "https://demofree.sirv.com/nope-not-here.jpg")
        : "https://demofree.sirv.com/nope-not-here.jpg";

    const avatar = creator?.avatar ? creator.avatar : "https://demofree.sirv.com/nope-not-here.jpg";

    const format = getFileExt(imageUrls.original);

    const cateText = Array.isArray(categories) && categories.length
        ? categories.map(c => c.name).join(" | ")
        : "N/A";

    const listView = $("#category-image-preview-list");

    const html = `
    <div 
      class="image-details relative group cursor-pointer select-none selected-image rounded-xl border border-gray-800 shadow-sm"
      data-like="${likeCount ?? 0}"
      data-cate="${cateText}"
      data-comment="${commentCount ?? 0}"
      data-size="${filesize ?? 0}"
      data-created="${createdDate ?? ''}"
      data-price="${price ?? 0}"
      data-width="${width ?? 0}"
      data-height="${height ?? 0}"
      data-public="${isPublic}"
      data-name="${creator.name ?? ''}"
      data-avatar="${avatar}"
      data-desc="${description ?? ''}"
      data-image="${image}"
    >
      <img 
        src="${image}"
        onerror="this.src='https://demofree.sirv.com/nope-not-here.jpg'"
        alt="image"
        loading="lazy"
        class="image-view w-full h-24 md:h-16 object-cover rounded-xl border border-gray-800 shadow-sm"
      />
      <div 
        class="absolute inset-0 bg-black/45 opacity-0 
               group-hover:opacity-100 transition flex 
               items-center justify-center text-[10px] text-white 
               rounded-xl">
        View details
      </div>   
    </div>
  `;
    listView.append(html);
}

function renderImageDetails() {
    $(document).on("click", ".image-details", function () {
        const el = $(this);

        // ---- HIGHLIGHT SELECTED IMAGE ----
        $(".image-details").css("border", "1px solid #1f2937");   // reset (gray-800)
        $(".image-details").removeClass("selected-image");

        el.css("border", "1px solid lime");                      // chọn ảnh
        el.addClass("selected-image");

        $("#image-detail-empty").addClass("hidden");
        $("#image-detail-panel").removeClass("hidden");

        $("#detail-size").text(formatSize(el.data("size")));
        $("#detail-description").text(el.data("desc") || "N/A");
        $("#detail-image").prop("src", el.data("image"));
        $("#detail-like").text(el.data("like"));
        $("#detail-price").text(`$ ${el.data("price")}`);
        $("#detail-created").text(formatDateSafe(el.data("created")));
        $("#detail-creator-name").text(el.data("name") || "Unknown");
        $("#detail-comment").text(el.data("comment"));
        $("#detail-creator-avatar").prop("src", el.data("avatar"));
        $("#detail-format").text("webp");
        $("#detail-width-origin").text(`${el.data("width")} x ${el.data("height")}`);
        el.data("public") ?
            $("#detail-status").addClass("bg-green-400/20 border-green-500 text-green-300").text("PUBLIC")
            : $("#detail-status").addClass("bg-gray-400/20 border-gray-500 text-gray-300").text("PRIVATE")

        // show categories dạng text
        $("#detail-categories").text(el.data("cate"));
    });
}






