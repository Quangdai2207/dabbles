import { htmlPath } from "../../../../../pagesPath/paths.js";
import authContext from "../../../../hooks/context/authContext.js";
import categoryService from "../../../../services/category/categoryService.js";
import imageService from "../../../../services/image/imageService.js";
import CATEGORY_CREATE from "./category_create.js";
import {createdFormat_II} from "../../../../../utils/formatPattern.js";

export default async function CATEGORY(path, mainContent) {
    const page = htmlPath.dashboard.feature.category.categories;
    const authentication = authContext.getContext().token;

    if (!authentication) {
        location.href = "/auth/login";
        return;
    }

    try {
        const html = await $.get(page);
        mainContent.empty().html(html);

        const $layout = $("#category-layout");
        const $tableBody = $("#category-table-body");

        if (!$layout || !$tableBody) {
            console.error("Missing layout/table body");
            return;
        }

        await getAllCategories(authentication, $tableBody);

        $(document)
            .off("click", "#category-btn-add")
            .on("click", "#category-btn-add", function (e) {
                e.preventDefault();
                CATEGORY_CREATE(authentication, mainContent);
            });

        $(document)
            .off("click", ".btn-delete-cate")
            .on("click", ".btn-delete-cate", async function () {
                const id = $(this).data("id");
                await deleteCategory(authentication, id, $tableBody);
            });

    } catch (e) {
        console.error("Cannot load HTML page", e);
        mainContent.empty().html("<div>Cannot find html main dashboard</div>");
    }

    document.title = "Admin - Categories Management";
    history.pushState({}, "", path);
}

async function getAllCategories(authentication, $tableBody) {
    try {
        const response = await categoryService.getAll(authentication);
        if (!response.ok && response.status === 400) {
            $tableBody.empty().html(withoutData("Category is nothing data"))
            return;
        }

        const { isSuccess, data } = await response.json();
        if (!isSuccess || !Array.isArray(data)) return;

        const rows = await Promise.all(
            data.map(item => renderRow(authentication, item))
        );

        $tableBody.empty().append(rows.join(""));

    } catch (e) {
        console.error("Error loading categories", e);
    }
}

function withoutData(errorMessage) {
    return `
    <tr class="mx-auto">
        <td colspan="7" class="p-4">
            <p class="text-[20px] italic text-gray-600 text-center font-bold">
                ${errorMessage}
            </p>
        </td>
    </tr>`;
}

async function renderRow(authentication, data) {
    const {
        id,
        name,
        slug,
        createdDate,
        updatedDate,
        deleted,
        featured
    } = data;

    const imageQty = await getImageQty(authentication, id);

    return `
<tr class="hover:bg-gray-800/40">
    <td class="px-4 py-3 text-white">${name}</td>

    <td class="px-4 py-3 text-center">
        <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-700/60">
            <span class="font-semibold">${imageQty}</span>
            <span class="text-xs text-gray-300">images</span>
        </span>
    </td>

    <td class="px-4 py-3">
        <span class="px-2 py-1 rounded-lg text-xs
            ${featured ? 'bg-green-700/40 text-green-300' : 'bg-gray-700/40 text-gray-300'}">
            ${featured ? 'Featured' : 'Normal'}
        </span>
    </td>

    <td class="px-4 py-3">
        <span class="px-2 py-1 rounded-lg text-xs
            ${deleted ? 'bg-red-700/40 text-red-300' : 'bg-gray-700/40 text-gray-300'}">
            ${deleted ? 'Deleted' : 'Active'}
        </span>
    </td>

    <td class="px-4 py-3 text-gray-400 hidden md:table-cell">
        ${createdFormat_II(createdDate)}
    </td>

    <td class="px-4 py-3 text-gray-400 hidden md:table-cell">
       ${createdFormat_II(updatedDate ?? createdDate)}
    </td>

    <td class="px-4 py-3">
        <div class="flex justify-end gap-4">
            <a
              href="/admin/category/details/${slug}"
              data-link
              onclick="CategoryContext.setData('${id}')"
              class="px-2 py-1 border rounded-lg border-lime-400 text-lime-400
                     text-[11px] md:text-xs hover:bg-lime-400/10 transition">
              Details
            </a>

            <button
                data-id="${id}"
                class="btn-delete-cate px-2 py-1 border rounded-lg border-red-500 text-red-400
                       text-[11px] md:text-xs hover:bg-red-500/10 transition cursor-pointer">
                Delete
            </button>
        </div>
    </td>
</tr>`;
}

async function getImageQty(authentication, categoryId) {
    try {
        const response = await imageService.getImageByCategoryId(authentication, categoryId);
        if (!response.ok) return 0;

        const { isSuccess, data } = await response.json();
        return isSuccess && Array.isArray(data) ? data.length : 0;

    } catch {
        return 0;
    }
}

async function deleteCategory(authentication, id, $tableBody) {
    const $line = $("#cate-error-line");

    const errorClass =
        "hidden rounded-lg border border-red-500 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 p-3 text-sm font-medium mb-5";
    const successClass =
        "rounded-lg border border-green-500 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 p-3 text-sm font-medium mb-5";

    try {
        const response = await categoryService.delete(authentication, id);

        if (!response.ok) {
            $line.removeClass("hidden").text("Category not found.");
            return resetLine($line);
        }

        const { isSuccess, errorMessage } = await response.json();

        if (!isSuccess) {
            $line.removeClass("hidden").text(errorMessage || "Delete failed");
            return resetLine($line);
        }

        $line.removeClass(errorClass).addClass(successClass).text("Deleted successfully!");
        await getAllCategories(authentication, $tableBody);

        setTimeout(() => {
            $line.removeClass(successClass).addClass(errorClass).text("");
        }, 2000);

    } catch (e) {
        console.error("Delete failed", e);
        $line.removeClass("hidden").text("Unexpected error");
        resetLine($line);
    }

    function resetLine($el) {
        setTimeout(() => $el.addClass("hidden").text(""), 2000);
    }
}
