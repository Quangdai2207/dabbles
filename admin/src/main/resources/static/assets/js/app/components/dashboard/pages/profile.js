import {htmlPath} from "../../../../pagesPath/paths.js";
import authService from "../../../services/auth/AuthService.js";
import {getAuthentication} from "../../../../utils/Token.js";
import {dateFormat} from "../../../../utils/formatPattern.js";
import userService from "../../../services/user/userService.js";
import {handleLogout} from "../dashboard.js";
import authContext from "../../../hooks/context/authContext.js";

export default function PROFILE(path, mainContent) {
    const page = htmlPath.dashboard.feature.dashboard_profile;
    const authentication = getAuthentication();

    $.get(page).done(html => {
        mainContent.empty().html(html);

        const pageContent = $("#dashboard-profile");
        if (!pageContent) return;

        //** Get fields:
        const fields = ["username", "firstName", "lastName", "phone", "dob"];

        //** show profile info
        showProfileInfo(pageContent, authentication);

        //** Switch update form
        handleBtnSwitch(fields)

        //** Handle update profile:
        handleUpdateProfile(fields, authentication);

        changePassword(authentication);

        zoomOutAvatar();
    })
        .fail(html => {
            console.error("Can not find html main dashboard ", html);
            mainContent.empty().html("<div>Can not find html main dashboard<div>");
        })

    document.title = "Admin - Profile Manage";
    history.pushState({}, "", path)
}

function handleBtnSwitch(fields) {
    const editBtn = $("#btn-edit-profile");
    const actions = $("#profile-actions");
    const avatarBox = $("#avatar-upload-box");

    $(document).on("click", "#btn-edit-profile", function () {
        fields.forEach(id => {
            $(`#${id}`).prop("disabled", false);
            if (id === "firstName") $(`#${id}`).focus();
            if (id === "dob") $(`#${id}`).removeClass("hidden");
        });

        avatarBox.removeClass("hidden");
        actions.removeClass("hidden");
        editBtn.addClass("hidden");
    });

    $(document).on("click", "#btn-cancel-profile", function () {
        $("#profile-error").addClass("hidden")
        fields.forEach(id => {
            $(`#${id}`).prop("disabled", true);
            if (id === "dob") $(`#${id}`).addClass("hidden");
        });
        avatarBox.addClass("hidden");
        actions.addClass("hidden");
        editBtn.removeClass("hidden");
    });
}

function handleUpdateProfile(fields, authentication) {
    $(document).on("click", "#btn-save-profile", function () {
        const payload = {};
        fields.forEach(id => {
            payload[id] = $(`#${id}`).val()?.trim() || "";
        })
        //** Change format date dd/MM/yyyy to yyyy/MM/dd for formData into UserService
        if (payload.dob === "") payload.dob = dateFormatFormData($("#dob-show").val());

        payload.avatarFile = $("#avatarFile")[0].files[0] ?? null;
        updateProfile(payload, authentication)
    });
}

function showProfileInfo(pageContent, authentication) {
    authService.profile(authentication)
        .then(async (res) => {
            const payload = await res.json();
            if (!payload.isSuccess) {
                pageContent.empty().html(`
                    <div class="text-red-500 p-4">
                        <h3>Tài khoản không tồn tại hoặc chưa xác thực</h3>
                    </div>
                `);
                return;
            }
            const data = payload.data;
            console.log("Profile: ", data);
            renderData(data);
        })
        .catch(async (e) => console.error(await e));
}

function updateProfile(model, auth) {
    const oldClass = "mt-4 hidden rounded-lg border border-red-500 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 p-3 text-sm font-medium"
    const newClass = "mt-4 rounded-lg border border-green-500 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 p-3 text-sm font-medium"

    userService.update(model, auth)
        .then(async (res) => {
            let response = await res.json();
            console.log("Data: ", response);
            const {isSuccess, errorMessage, data, message} = response;

            if (!isSuccess) {
                $("#profile-error").removeClass("hidden").empty().text(errorMessage)
                return;
            }
            $("#profile-error")
                .removeClass(oldClass)
                .addClass(newClass)
                .empty()
                .text(message);

            renderData(data);

            setTimeout(() => {
                $("#profile-error").removeClass(newClass).addClass(oldClass)
            }, 2000)

        })
        .catch((e) => console.error("Error message: ", e));
}

function zoomOutAvatar() {
    let scale = 1;

    if ($("#avatar-popup").length === 0) $("body").append(createPopup());
    //** Event click on avatar
    $(document).on("click", "#profile-avatar", function () {
        const src = $(this).attr("src");
        if (!src) return;

        scale = 1;
        $("#avatar-preview").attr("src", src).css("transform", "scale(1)");
        $("#avatar-popup").fadeIn(150);
    });

    // Zoom in
    $(document).on("click", "#zoom-in", function () {
        scale += 0.2;
        $("#avatar-preview").css("transform", `scale(${scale})`);
    });

    // Zoom out
    $(document).on("click", "#zoom-out", function () {
        scale = Math.max(0.4, scale - 0.2);
        $("#avatar-preview").css("transform", `scale(${scale})`);
    });

    // Close popup
    $(document).on("click", "#close-popup, .backdrop", function () {
        $("#avatar-popup").fadeOut(150);
    });

    // Press ESC keyboard:
    $(document).on("keydown", function (e) {
        if (e.key === "Escape") {
            $("#avatar-popup").fadeOut(150);
        }
    });
}

function createPopup() {
    return `
       <div id="avatar-popup" class="fixed inset-0 z-[9999] hidden">
        
            <!-- Backdrop -->
            <div class="backdrop absolute inset-0 bg-black/70"></div>
        
            <!-- Content -->
            <div class="content relative w-full h-full flex items-center justify-center">
        
                <!-- Image -->
                <img id="avatar-preview"
                     class="rounded-lg max-w-[80%] max-h-[80%] transition-transform duration-200 cursor-grab select-none"/>
        
                <!-- Actions -->
                <div class="actions fixed bottom-5 flex gap-3">
                    <button id="zoom-in"
                            class="px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-200 text-gray-600 bold">
                        +
                    </button>
        
                    <button id="zoom-out"
                            class="px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-200 text-gray-600 bold">
                        −
                    </button>
        
                    <button id="close-popup"
                            class="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600">
                        ✕
                    </button>
                </div>
        
            </div>
        </div>
        `;
}

function renderData(data) {
    $("#profile-avatar").prop("src", data.avatar)
    $("#firstName").val(data.firstName);
    $("#lastName").val(data.lastName)
    $("#email").val(data.email)
    $("#username").val(data.username || "N/A")
    $("#phone").val(data.phone)
    $("#dob-show").val(data.dob ? dateFormat(data.dob) : "-- / -- / -- ")
    $("#dob").val(data.dob ? dateFormat(data.dob) : "2025-01-01")
}

function changePassword(authentication) {
    const newBgColor = "bg-gray-300 text-gray-300"
    const oldBgColor = "bg-purple-600 hover:bg-purple-700"
    const successClass = "mt-4 rounded-lg border border-green-500 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 p-3 text-sm font-medium"
    $(document).on("click", "#btn-change-password", function () {
        $("#btn-change-password")
            .prop("disabled", true)
            .removeClass(oldBgColor).addClass(newBgColor)
            .text("Waiting process...");

        const currentPass = $("#currentPassword").val().trim();
        const newPass = $("#newPassword").val().trim();
        const confirmPass = $("#confirmPassword").val().trim();

        let formData = {
            currentPassword: currentPass,
            password: newPass,
            passwordConfirm: confirmPass
        }

        userService.changePassword(formData, authentication)
            .then(async (res) => {
                if (res && res.status >= 400) {
                    const payload = await res.json();
                    const {isSuccess, errorMessage} = payload;

                    if (!isSuccess && errorMessage) {
                        const errorsSplit = errorMessage.split(",");
                        console.log("split => ", errorsSplit);
                        $("#btn-change-password")
                            .prop("disabled", false)
                            .removeClass(newBgColor).addClass(oldBgColor)
                            .text("Confirm Update")

                        if (errorsSplit.length > 1) {
                            $("#change-password-error").removeClass("hidden").empty();
                            errorsSplit.map(error => {
                                $("#change-password-error").append(`
                                    <ul class="list-disc list-outside pl-5 space-y-1" id="reset-error-list">
                                        <li>${error}</li>
                                    </ul>
                                `)
                            })
                        } else {
                            $("#change-password-error").empty().text(errorsSplit[0])
                        }
                        return;
                    }

                    if (!isSuccess && !errorMessage) {
                        $("#btn-change-password")
                            .prop("disabled", false)
                            .removeClass(newBgColor).addClass(oldBgColor)
                            .text("Confirm Update")

                        $("#change-password-error").empty().text(message)
                        return;
                    }
                }

                autoLogout(successClass, authContext.getContext().email)
            })
            .catch(async (e) => console.error("Message Error: ", e));
    })
}

function autoLogout(successClass, email) {
    let countDown = 3;
    $("#change-password-error")
        .removeClass()
        .addClass(successClass)
        .empty()
        .html(`
        <p>Update successful, re-signIn after [
            <span class="bold text-white" id="countdown">${countDown}</span>
            s]
        </p>`);
    const intervalId = setInterval(() => {
        countDown--;
        $("#countdown").text(countDown);

        if (countDown <= 0) {
            clearInterval(intervalId);
            handleLogout(email, authContext.getContext().token)
        }
    }, 1000);
}

function dateFormatFormData(date) {
    if (!date) return "";

    console.log(date);
    let dateSplit = date.split("/");

    const year = dateSplit[2];
    const month = dateSplit[1];
    const day = dateSplit[0];

    date = `${year}-${month}-${day}`;
    console.log(date);
    return date;
}


