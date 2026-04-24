import {htmlPath} from "../../../../../pagesPath/paths.js";
import categoryContext from "../../../../hooks/context/categoryContext.js";
import categoryService from "../../../../services/category/categoryService.js";
import NOTFOUND from "../../../../pages/notfound.js";
import authContext from "../../../../hooks/context/authContext.js";
import CATEGORY_EDIT from "./category_edit.js";
import imageService from "../../../../services/image/imageService.js";
import PREVIEW_IMAGE from "./category_images/preview_image.js";

export default async function CATEGORY_DETAILS(path, mainContent, param) {
    const page = htmlPath.dashboard.feature.category.category_details;
    const slug = param?.slug;
    const cateId = categoryContext.getData()

    //** Check login session
    const authentication = authContext.getContext().token;
    if (!authentication) {
        location.href = "/auth/login";
        return;
    }

    //** Check param and slug
    if (!slug || !cateId) {
        NOTFOUND(path, mainContent);
        return;
    }

    //** Get data to check response before render UI Category details:
    const response = await categoryService.getById(authentication, cateId);

    //** Recheck 401 if un-authorization
    if (!response?.ok) {
        NOTFOUND(path, mainContent);
        return;
    }

    //** Recheck 401 if un-authorization
    if (response.status === 401) {
        location.href = "/auth/login";
        return;
    }

    //** If not found data
    if (response.status === 400) {
        NOTFOUND(path, mainContent);
        return;
    }

    //** If Container not found within DOM root
    if (!mainContent) return;

    await $.get(page)
        .done(async html => {
            mainContent.empty().html(html);
            const {data} = await response.json();

            $("#btn-edit-category").on("click", function () {
                CATEGORY_EDIT(authentication, mainContent, data);
            });

            await renderCategoryDetails(authentication, data)

            //** Open frame preview category images
            await openPreviewImage(authentication, cateId);

            document.title = "Admin - Category Details"
            history.pushState({}, "", path)
        })
        .fail(html => {
            console.error("Can not find html main dashboard ", html);
            mainContent.empty().html("<div>Can not find html main dashboard<div>");
        });
}

async function renderCategoryDetails(authentication, data) {
    const {
        name, description, slug, id, createdDate,
        updatedDate, featured
    } = data;
    $("#category-detail-name").text(name)
    $("#category-detail-slug").text(slug)
    $("#category-detail-description").text(description)
    $("#category-detail-updated").text(new Date(updatedDate).toLocaleString())
    $("#category-detail-created").text(new Date(createdDate).toLocaleString())
    if (featured) {
        $("#category-detail-featured-badge")
            .removeClass("hidden")
            .attr("class",
                "inline-flex items-center gap-1 px-2 py-[2px] rounded-full " +
                "bg-blue-500/15 border border-blue-400/40 text-blue-300 " +
                "text-[11px] font-semibold tracking-wide select-none transition"
            );
    } else {
        $("#category-detail-featured-badge")
            .removeClass("hidden")
            .attr("class",
                "inline-flex items-center gap-1 px-2 py-[2px] rounded-full " +
                "bg-gray-500/10 border border-gray-400/30 text-gray-300 " +
                "text-[11px] font-semibold tracking-wide select-none transition"
            );
    }

    console.log(data);
    const results = await getTotalImages(authentication, id);
    console.log(results);
    $("#category-images-total").text(results !== 0 ? results.imagesTotal : 0);
    $("#category-stat-likes").text(results !== 0 ? results.likeCounts : 0)
    $("#category-stat-private").text(results !== 0 ? results.privateTotal : 0)
    $("#category-stat-public").text(results !== 0 ? results.publicTotal : 0)
}

async function getTotalImages(authentication, cateId) {
    let countPublic = 0;
    let totalPrivate = 0;
    let likeCounts = 0;

    const response = await imageService.getImageByCategoryId(authentication, cateId);
    if (!response.ok) {
        return 0;
    }

    const {isSuccess, data} = await response.json();
    if (isSuccess && !Array.isArray(data)) return 0;

    if (isSuccess && data.length > 0)  {
        data.forEach(item => {
            if (item.public) countPublic++;
            else totalPrivate++;

            likeCounts += item.likeCount;
        })

        return {
            publicTotal: countPublic,
            privateTotal: totalPrivate,
            likeCounts: likeCounts,
            imagesTotal: data.length
        }
    }

    return 0;
}
function openPreviewImage(authentication, cateId) {
    $("#category-preview-images").off("click").on("click", async function() {
        await PREVIEW_IMAGE(authentication, cateId);
    })
}


