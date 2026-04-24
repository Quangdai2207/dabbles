import {htmlPath} from "../../../../../pagesPath/paths.js";
import categoryService from "../../../../services/category/categoryService.js";

export default async function CATEGORY_EDIT(authentication, mainContent, data) {
    const page = htmlPath.dashboard.feature.category.category_edit;

    if (!authentication) {
        location.href = "/auth/login";
        return;
    }

    if (!mainContent) return;

    await $.get(page)
        .done(html => {
            mainContent.append(html);
            const editPageId = $("#category-edit-page");
            if (!editPageId) return;

            renderFormEdit(data);
            editCategory(authentication, data.id)

            $("#btn-close-category-edit, #btn-cancel-category-edit, #category-modal-overlay-edit").on("click", function () {
                $("#category-modal-edit, #category-modal-overlay-edit").remove();
            });

        })
        .fail(html => {
            console.error("Can not find html main dashboard ", html);
            mainContent.empty().html("<div>Can not find html main dashboard<div>");
        });
}

function renderFormEdit(data) {
    const { description, featured, name } = data;

    $("#cat-edit-name").val(name ?? "");
    $("#cat-edit-desc").val(description ?? "");
    $("#cat-edit-featured").prop("checked", Boolean(featured));
}


async function editCategory(authentication, id) {
    const oldClass = "bg-blue-600 hover:bg-blue-700"
    const newClass = "bg-gray-600 text-gray-500";
    const successClass = "mt-4 rounded-lg border border-green-500 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 p-3 text-sm font-medium"

    $(document).on("submit", "#category-edit-form", async function (e) {
        e.preventDefault();

        $("#btn-edit-category")
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

        console.log(body);
        try {
            const response = await categoryService.update(authentication, body, id);
            if (!response.ok) {
                console.error("Can not Update this Category, recheck >>>");
                $("#edit-cate-error").removeClass("hidden").text("Update category failed!")
                $("#btn-edit-category")
                    .removeClass(newClass)
                    .addClass(oldClass)
                    .text("Confirm")
                    .prop("disabled", false);
                return;
            }

            const {isSuccess, data, message, errorMessage} = await response.json();

            if (!isSuccess) {
                $("#edit-cate-error").removeClass("hidden").text(errorMessage);
                $("#btn-edit-category")
                    .removeClass(newClass)
                    .addClass(oldClass)
                    .text("Confirm")
                    .prop("disabled", false);
                return;
            }

            if (isSuccess && data) {
                $("#edit-cate-error").removeClass()
                    .addClass(successClass)
                    .text(message);
                $("#btn-edit-category")
                    .removeClass(newClass)
                    .addClass(oldClass)
                    .text("Confirm")
                    .prop("disabled", true);
            }

            setTimeout(() => {
                location.href = `/admin/category/details/${data.slug}`
            }, 1000)
        } catch (e) {
            console.error("Something when wrong while process data", e)
            $("#edit-cate-error").removeClass("hidden").text(errorMessage);
            $("#btn-edit-category")
                .removeClass(newClass)
                .addClass(oldClass)
                .text("Add")
                .prop("disabled", false);
        }
    });
}