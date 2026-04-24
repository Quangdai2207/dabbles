import {htmlPath} from "../../../../../pagesPath/paths.js";
import authContext from "../../../../hooks/context/authContext.js";
import imageService from "../../../../services/image/imageService.js";
import {createdFormat, formatNumber, formatSize} from "../../../../../utils/formatPattern.js";
import {imageContext} from "../../../../hooks/context/imageContext.js";
import IMAGE_CREATE, {hideProcessing, modalProcessing, updateProcessing} from "./image_create.js";
import categoryService from "../../../../services/category/categoryService.js";

export default async function IMAGES(path, mainContent) {
    const page = htmlPath.dashboard.feature.image.images

    const authentication = authContext.getContext().token;
    if (!authentication) {
        location.href = "/auth/login";
        return
    }

    await $.get(page).done(async (html) => {
        mainContent.empty().html(html);

        //** Render images
        await getAllImages(authentication);

        $("#btn-image-refresh-page").on("click", async function () {
            await getAllImages(authentication)
        })

        $("#img-clear-filters").on("click", async function () {
            $("#img-filter-category").val("");
            $("#img-sort").val("");
            $("#image-details-search-input").val("");
            $("#img-filter-visibility").val("");
            await getAllImages(authentication)
        })

        $(document)
            .off("click", "#btn-image-upload-page")
            .on("click", "#btn-image-upload-page", function (e) {
                e.preventDefault();
                IMAGE_CREATE(authentication, mainContent)
            });
    })
        .fail(html => {
            console.error("Can not find html main dashboard ", html);
            mainContent.empty().html("<div>Can not find html main dashboard<div>");
        })

    document.title = "Admin - Images Management";
    history.pushState({}, "", path)
}

export async function getAllImages(authentication) {
    const tableBody = $("#image-table-body");
    tableBody.append(modalProcessing("Loading your image…", "loading"));
    const response = await imageService.getAllImages(authentication)
    if (!response.ok) {
        updateProcessing("Loading failed. Please try again.", "error");
        setTimeout(() => hideProcessing(), 1500);
        return;
    }

    if (response.status === 400) {
        tableBody.empty().html(withoutData("Without any image."));
        return;
    }

    const {isSuccess, data} = await response.json();

    if (!isSuccess) {
        tableBody.empty().html(withoutData("Without any image."));
        updateProcessing("Loading failed.", "error");
        setTimeout(() => hideProcessing(), 1500);
        return;
    }

    if (!Array.isArray(data)) {
        tableBody.empty().html(withoutData("Without any image."));
        updateProcessing("Loading failed.", "error");
        setTimeout(() => hideProcessing(), 1500);
        return;
    }

    updateProcessing("Loaded images successfully!", "success");
    imageContext.setData(data);
    tableBody.empty();
    data.forEach(item => {
        tableBody.append(renderImages(item));
    });
    setTimeout(() => {
        hideProcessing();
    }, 2000);

    await deleteImage(authentication);
    await searchByKeyword();
    await filterStatus();
    await filterCates(authentication);
    sortByLatest();
}

function withoutData(errorMessage) {
    return `
    <tr class="mx-auto p-4">
        <td colspan="7" class="p-4">
            <p class="text-[20px] italic text-gray-600 text-center font-bold">
                ${errorMessage}
            </p>
        </td>
    </tr>
    `;
}

function renderImages(data) {
    const {
        id, creator, categories, filesize, imageUrls,
        createdDate, price
    } = data;
    const {avatar, name} = creator;

    const image = imageUrls.original == null ||  imageUrls.original === "" ? "https://placehold.co/160" : /^https?:\/\//.test(imageUrls.original) ? imageUrls.original : `http://localhost:3366/${imageUrls.original}`;
    const avatarUrl = avatar == null || avatar === "" ? "https://placehold.co/160" : /^https?:\/\//.test(avatar)? avatar : `http://localhost:3366/${avatar}`;

    let categoryName = Array.isArray(categories) && categories.length > 0
        ? categories
            .map(c => c.name).join(" | ")
        : "N/A";

    const isPublic = data.public;

    return `
            <tr class="border-b border-gray-800 hover:bg-gray-800/40 p-4"
                data-uploaded="${new Date(createdDate).getTime()}"
                data-like="${price}"
                data-size="${filesize}" 
            >
              <!-- Preview -->
              <td class="py-2 px-3">
                <img src="${image}" class="w-10 h-10 rounded-sm object-cover border border-gray-700"
                onerror="this.src='https://demofree.sirv.com/nope-not-here.jpg'"
                />
              </td>
   
              <!-- Creator -->
              <td class="py-2 px-3">
                <div class="flex items-center gap-2">
                  <img src=${avatarUrl}
                  onerror="this.src='https://demofree.sirv.com/nope-not-here.jpg'"
                  class="w-7 h-7 rounded-full object-cover" />
                  <span class="text-sm">
                    <a href="http://localhost:8668/admin/users/details/${creator.id}">${name}</a>
                  </span>
                </div>
              </td>
           
              <!-- Categories -->
              <td class="py-2 px-3">
                <div class="flex flex-wrap gap-1">
                  <!-- loop -->
                  <span class="px-2 py-[2px] bg-gray-800 rounded text-[10px]">
                    ${categoryName}
                  </span>
                </div>
              </td>
            
              <!-- File Size -->
              <td class="py-2 px-3 text-[11px] text-gray-400">
                <span>${formatSize(filesize)}</span>
              </td>
            
              <!-- Likes -->
              <td class="py-2 px-3 text-pink-400">
                    $.${formatNumber(price)}
              </td>
            
              <!-- Public -->
              <td class="py-2 px-3">
                <span class="px-2 py-[2px] rounded text-[10px] 
                  ${isPublic ? 'bg-green-700 text-green-200' : 'bg-gray-700 text-gray-300'}">
                  ${isPublic ? 'Public' : 'Private'}
                </span>
              </td>
            
              <!-- Created -->
              <td class="py-2 px-3 text-xs text-gray-400">
                ${createdFormat(createdDate)}
              </td>
            
              <!-- Actions -->
              <td class="py-2 px-3 text-center">
                <div class="flex items-center justify-center gap-3">
                  <a data-link href="/admin/image/details/${id}" class="cursor-pointer px-2 py-1 text-[10px] border-blue-600 border text-blue hover:text-white hover:bg-blue-700 rounded-lg">View</a>
                  <button data-id="${id}" class="btn-delete-image cursor-pointer px-2 py-1 text-[10px] border-red-600 border text-red hover:text-white hover:bg-red-700 rounded-lg">Delete</button>
                </div>
              </td>
            </tr>`
}

export function setStatsImagePage(total, publicTotal, privateTotal, price) {
    $("#section-img-stat-total").text(total)
    $("#section-img-stat-private").text(privateTotal)
    $("#section-img-stat-public").text(publicTotal)

    if (String(price).length >= 10) {
        $("#section-img-stat-price")
            .removeClass("text-2xl")
            .addClass("text-sm")
    }
    $('#section-img-stat-price').text(`$ ${price}`)
    console.log(price);
}

async function deleteImage(authentication) {
    const $line = $("#image-error-line");

    const errorClass =
        "hidden rounded-lg border border-red-500 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 p-3 text-sm font-medium mb-5";
    const successClass =
        "rounded-lg border border-green-500 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 p-3 text-sm font-medium mb-5";

    $(document).off("click", "btn-delete-image");
    $(document).on("click", ".btn-delete-image", async function () {
        const imageId = $(this).data("id");
        try {
            const response = await imageService.deleteImageById(authentication, imageId);

            if (!response.ok) {
                $line.removeClass("hidden").text("Image not found.");
                return resetLine($line);
            }

            const {isSuccess, errorMessage} = await response.json();

            if (!isSuccess) {
                $line.removeClass("hidden").text(errorMessage || "Delete failed");
                return resetLine($line);
            }

            await getAllImages(authentication)
            $line.removeClass(errorClass).addClass(successClass).text("Deleted successfully!");
            setTimeout(() => {
                $line.removeClass(successClass).addClass(errorClass).text("");
            }, 1000);

        } catch (e) {
            console.error("Delete failed", e);
            $line.removeClass("hidden").text("Unexpected error");
            resetLine($line);
        }

        function resetLine($el) {
            setTimeout(() => $el.addClass("hidden").text(""), 2000);
        }
    });
}

async function searchByKeyword() {
    //** Get Id search input and table row after render table data
    const searchTableImage = $("#image-details-search-input");
    const tableListImage = $("#image-table-body tr")

    if (!searchTableImage) return;
    if (tableListImage.length === 0) return;

    searchTableImage.on("input", function () {
        const keyword = $(this).val().toLowerCase().trim();
        tableListImage.each(function () {
            const cols = [0, 1, 2, 3, 4, 5, 6];
            var name = "";

            cols.forEach(i => {
                const cell = $(this).children().eq(i).text().toLowerCase();
                name += cell + " ";
            })
            $(this).toggle(name.includes(keyword));
        });
    })
}

async function filterStatus() {
    const tableListImage = $("#image-table-body tr")
    const combobox = $("#img-filter-visibility");

    if (!tableListImage || !combobox) return;

    combobox.on("change", function () {
        const value = $(this).val().toLowerCase() === "0" ? "private" : "public"
        console.log(value);

        tableListImage.each(function () {
            const status = $(this).children().eq(5).text().toLowerCase();
            $(this).toggle(status.includes(value));
        });
    });
}

async function filterCates(auth) {
    const tableListImage = $("#image-table-body tr")
    const combobox = $("#img-filter-category");

    await fetchCategories(auth, combobox)
    if (!tableListImage || !combobox) return;

    combobox.on("change", function () {
        const value = $(this).val().toLowerCase();
        tableListImage.each(function () {
            const status = $(this).children().eq(2).text().toLowerCase();
            $(this).toggle(status.includes(value));
        });
    });
}

async function fetchCategories(auth, combobox) {
    if (combobox.length === 0) return;

    try {
        const response = await categoryService.getAll(auth);
        if (!response.ok && response.status === 400) {
            console.error("Without any category.");
            return;
        }

        const {isSuccess, data} = await response.json();
        if (!isSuccess || !Array.isArray(data)) return;
        combobox.empty();
        combobox.append('<option class="focus:ring-blue-600" value="">All Categories</option>')
        data.forEach(item => {
            combobox.append(`<option class="focus:ring-blue-600" value="${item.name}">${item.name}</option>`)
        });
    } catch (e) {
        console.error("Error loading categories", e);
    }
}

//** Filter option for combobox "Select Options"
function sortByLatest() {
    const $select = $("#img-sort");
    const $tbody = $("#image-table-body");

    if ($select.length === 0) return;
    $select.off("change").on("change", function () {

        const value = $(this).val();
        const rows = $tbody.find("tr").get();

        rows.sort(function (a, b) {

            const createdA = Number($(a).data("uploaded"));
            const createdB = Number($(b).data("uploaded"));
            const sizeA = Number($(a).data("size"));
            const sizeB = Number($(b).data("size"));

            switch (value) {
                case "1":
                    return createdB - createdA;
                case "2":
                    return createdA - createdB;
                case "3":
                    return sizeB - sizeA;
                default:
                    return "0";
            }
        });
        $.each(rows, function (_, row) {
            $tbody.append(row);
        });
    });
}



