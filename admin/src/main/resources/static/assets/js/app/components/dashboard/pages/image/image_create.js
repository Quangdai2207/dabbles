import {htmlPath} from "../../../../../pagesPath/paths.js";
import categoryService from "../../../../services/category/categoryService.js";
import imageService from "../../../../services/image/imageService.js";
import {getAllImages} from "./images.js";

export default async function IMAGE_CREATE(authentication, mainContent) {
    const page = htmlPath.dashboard.feature.image.image_create;

    if (!authentication) {
        location.href = "/auth/login";
        return
    }

    await $.get(page).done(html => {
        mainContent.append(html);

        const combobox = $("#upload-category-ids");
        fetchCategories(authentication, combobox);
        closePopup();

        uploadImage(authentication, mainContent);
    })
        .fail(html => {
            console.error("Can not find html create image ", html);
            mainContent.empty().html("<div>Can not find html create image<div>");
        });
}

function closePopup() {
    $("#image-page-create-btn-close-upload, #image-page-create-btn-cancel-upload")
        .on("click", function () {
            $("#image-upload-modal, #image-upload-overlay").remove();
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
        data.forEach(item => {
            combobox.append(`<option class="focus:ring-blue-600" value="${item.id}">
            ${item.name}
        </option>`)
        });
    } catch (e) {
        console.error("Error loading categories", e);
    }
}

function uploadImage(auth, mainContent) {
    $(document).off("submit", "#image-upload-form");

    $(document).on("submit", "#image-upload-form", function (e) {
        e.preventDefault();

        let categories = [];

        try {
            const formData = $(this).serializeArray();
            const payload = {};
            formData.forEach(item => {
                payload[item.name] = item.value
                if (item.name === "categoryId") {
                    categories.push(item.value)
                    payload.categoryId = categories;
                };
            });
            payload["fileUpload"] = $("#upload-file")[0]?.files?.[0] || null;

            $("#image-upload-modal, #image-upload-overlay").remove();
            mainContent.append(modalProcessing("Uploading your image…", "loading"));

            (async () => {
                const response = await imageService.uploadImage(auth, payload);
                if (!response?.ok) {
                    updateProcessing("Upload failed. Please try again.", "error");
                    setTimeout(() => hideProcessing(), 1500);
                    return;
                }

                const { isSuccess, errorMessage } = await response.json();

                if (!isSuccess) {
                    updateProcessing(errorMessage || "Upload failed.", "error");

                    setTimeout(() => hideProcessing(), 1500);
                    return;
                }

                updateProcessing("Upload successfully!", "success");
                setTimeout(() => {
                    hideProcessing();
                    getAllImages(auth);
                }, 1200);

            })();
        } catch (err) {
            console.error("Upload error:", err);
            $("#processing-message").text("Unexpected error — please try again.");
        }
    });
}


export function modalProcessing(message = "Processing...", state = "loading") {

    $("#processing-overlay").remove(); // Delete if it existing...

    const icon = state === "loading"
        ? `<div class="w-10 h-10 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>`
        : state === "success"
            ? `<div class="w-10 h-10 text-green-400">✓</div>`
            : `<div class="w-10 h-10 text-red-400">!</div>`;

    return `
    <div id="processing-overlay"
         class="fixed inset-0 z-[9999] flex items-center justify-center 
                bg-black/60 backdrop-blur-sm select-none">

        <div class="bg-gray-900 border border-gray-800 shadow-xl rounded-2xl 
                    px-6 py-5 w-[360px] flex flex-col items-center gap-4">

            <div id="processing-icon">${icon}</div>

            <p id="processing-message" 
               class="text-sm text-gray-300 text-center leading-relaxed">
                ${message}
            </p>
        </div>
    </div>
    `;
}

export function updateProcessing(message, state) {

    $("#processing-message").text(message);

    if (state === "success") {
        $("#processing-icon").html(`<div class="w-10 h-10 text-green-400 text-3xl">✓</div>`);
    }

    if (state === "error") {
        $("#processing-icon").html(`<div class="w-10 h-10 text-red-400 text-3xl">!</div>`);
    }
}

export function hideProcessing() {
    $("#processing-overlay").remove();
}




