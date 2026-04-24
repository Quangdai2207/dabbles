import {htmlPath} from "../../../../../pagesPath/paths.js";
import categoryService from "../../../../services/category/categoryService.js";

export default async function CATEGORY_CREATE(authentication, mainContent) {
    const page = htmlPath.dashboard.feature.category.category_create;
    if (!authentication) {
        location.href = "/auth/login";
        return;
    }
    if (!mainContent) return;

    await $.get(page)
        .done(html => {
            mainContent.append(html);
            const createPageId = $("#category-create-page");
            if (!createPageId) return;

            $("#btn-close-category, #btn-cancel-category, #category-modal-overlay").on("click", function () {
                $("#category-modal, #category-modal-overlay").remove();
            });

            createNewCate(authentication)
        })
        .fail(html => {
            console.error("Can not find html main dashboard ", html);
            mainContent.empty().html("<div>Can not find html main dashboard<div>");
        });
}

async function createNewCate(authentication) {
    const oldClass = "bg-blue-600 hover:bg-blue-700"
    const newClass = "bg-gray-600 text-gray-500";
    const successClass = "mt-4 rounded-lg border border-green-500 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 p-3 text-sm font-medium"

    $(document).on("submit", "#category-create-form", async function (e) {
        e.preventDefault();

        $("#btn-create-category")
            .removeClass(oldClass)
            .addClass(newClass)
            .text("Processing...")
            .prop("disabled", true);

        const formData = $(this).serializeArray();
        const body = {};
        formData.forEach(item => {
            body[item.name] = item.value
            if (item.name === "featured") body[item.name] = !!item.value
        })
        if (!body.featured) body["featured"] = false;

        try {
            const response = await categoryService.create(authentication, body);
            if (!response.ok) {
                console.error("Can not create new Category, recheck >>>");
                $("#create-cate-error").removeClass("hidden").text("Create new category failed!")
                $("#btn-create-category")
                    .removeClass(newClass)
                    .addClass(oldClass)
                    .text("Add")
                    .prop("disabled", false);
                return;
            }

            const {isSuccess, data, message, errorMessage} = await response.json();
            if (!isSuccess) {
                $("#create-cate-error").removeClass("hidden").text(errorMessage);
                $("#btn-create-category")
                    .removeClass(newClass)
                    .addClass(oldClass)
                    .text("Add")
                    .prop("disabled", false);
                return;
            }

            if (isSuccess && data) {
                $("#create-cate-error").removeClass()
                    .addClass(successClass)
                    .text(message);
                $("#btn-create-category")
                    .removeClass(newClass)
                    .addClass(oldClass)
                    .text("Add")
                    .prop("disabled", false);
            }

            setTimeout(() => {
                location.href = "/admin/categories"
            }, 1000)
        } catch (e) {
            console.error("Something when wrong while process data", e)
            $("#create-cate-error").removeClass("hidden").text(errorMessage);
            $("#btn-create-category")
                .removeClass(newClass)
                .addClass(oldClass)
                .text("Add")
                .prop("disabled", false);
        }
    });
}