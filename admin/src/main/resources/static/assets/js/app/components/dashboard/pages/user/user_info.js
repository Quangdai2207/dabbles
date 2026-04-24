import {htmlPath} from "../../../../../pagesPath/paths.js";
import adminService from "../../../../services/admin/AdminService.js";
import UpdateUser from "../../../../model/user/updateUser.js";
import {createdFormat, dateFormat} from "../../../../../utils/formatPattern.js";
import userService from "../../../../services/user/userService.js";
import {getAuthentication} from "../../../../../utils/Token.js";

export async function USER_INFO(path, mainContent, identity) {
    const pageUserInfo = htmlPath.dashboard.feature.user.user_info;
    if (!mainContent) return;

    const authentication = getAuthentication();

    try {
        const response = await userService.getDetails(authentication, identity);
        const {isSuccess, data} = await response.json();
        console.log("User info: ", data);

        if (!isSuccess || !data) return;

        $.get(pageUserInfo).done(html => {
            mainContent.empty().html(html);

            console.log("User info >>> ", data);
            //** RENDER DATA
            renderDataInfo(data);

            //** BIND EVENTS
            changeUpdate(authentication, data);
            roleUpdate(authentication, data);
            warningUpdate(authentication, data);
            avatarUpdate(authentication, data);

            document.title = "Admin - User Details Info";
        })
            .fail(html => {
                console.error("Something wrong while render user details >>>", e);
                mainContent
                    .empty()
                    .html("<div class='text-red-400'>Cannot load user info page</div>");
            });
    } catch (e) {
        console.error("Something went wrong");
    }
}

export function renderDataInfo(object) {

    const {
        username, firstname, lastname, email,
        phone, active, warning, avatar,
        dateOfBirth, roleId, createdDate,
        updatedDate, public: isPublic
    } = object;
    const ROLE_MAP = {
        "1": "Super Admin", "2": "Admin", "3": "User"
    };

    const avatarUrl =
        avatar == null || avatar === ""
            ? "https://placehold.co/160"
            : /^https?:\/\//.test(avatar)
                ? avatar
                : `http://localhost:3366/${avatar}`;
    console.log(avatarUrl);

    // ===== TEXT INFO =====
    $("#user-details-username").text(username || "N/A");
    $("#user-details-firstName").text(firstname);
    $("#user-details-lastName").text(lastname);
    $("#user-details-email").text(email);
    $("#user-details-phone").text(phone);
    $("#user-details-dob").text(dateFormat(dateOfBirth));
    $("#user-details-role").text(ROLE_MAP[roleId] || "Unknown");
    $("#user-details-created").text(createdFormat(createdDate));
    $("#user-details-updated").text(updatedDate ? createdFormat(updatedDate) : "N/a");

    // ===== AVATAR =====
    $("#user-details-avatar").prop("src", avatarUrl);

    // ===== SWITCHES =====
    $("#user-details-warning").prop("checked", !!warning);
    $("#user-details-active").prop({"checked": !!active, "disabled": true});
    $("#user-details-public").prop({"checked": !!isPublic, "disabled": true});

    // ===== UPDATE FORM =====
    $("#user-details-username-update").val(username ? username : "");
    $("#user-details-firstName-update").val(firstname);
    $("#user-details-lastName-update").val(lastname);
    $("#user-details-phone-update").val(phone);
    $("#user-details-dob-update").val(dateOfBirth);
    getStatusUserOnReload(email)
}

function onlineBadge() {
    return `
           <span
                class="inline-flex items-center gap-2 px-2.5 py-1
                   text-[11px] rounded-full
                   bg-emerald-800 border border-emerald-700 text-emerald-300">
                <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                Online
            </span>
    `;
}

function offlineBadge() {
    return `
           <span
                class="inline-flex items-center gap-2 px-2.5 py-1
                   text-[11px] rounded-full
                   bg-gray-800 border border-gray-700 text-gray-300">
                <span class="w-2 h-2 rounded-full bg-gray-400"></span>
                Offline
            </span>
    `;
}

function getStatusUserOnReload(slug) {
    const status = $("#user-details-online-status");
    userService.getUserStatus(slug)
        .then(async res => {
            const {event} = await res.json();
            status.html(event === "CONNECTED" ? onlineBadge() : offlineBadge());
        })
        .catch(e => console.error(e));
}

function roleUpdate(authentication, object) {

    const $enableSwitch = $("#user-role-edit-enable");
    const $roleSelect = $("#user-role-select");
    const $updateBtn = $("#user-role-btn-update");
    const $currentRole = $("#user-role-current");
    const $detailRole = $("#user-details-role");

    const ROLE_MAP = {
        "2": {label: "Admin", current: "ADMIN"}, "3": {label: "User", current: "USER"}
    };

    // ===== INIT =====
    $roleSelect.val(object.roleId);
    $currentRole.text(ROLE_MAP[object.roleId]?.current || "UNKNOWN");

    // ===== ENABLE / DISABLE =====
    $enableSwitch.on("change", function () {
        const enabled = this.checked;
        $roleSelect.prop("disabled", !enabled);
        $updateBtn.prop("disabled", !enabled);
    });

    // ===== UPDATE ROLE =====
    $updateBtn.on("click", function () {
        const roleId = $roleSelect.val();
        if (!roleId) return;

        adminService
            .roleUpdate(authentication, roleId, object.id)
            .then(res => res.json())
            .then(({isSuccess}) => {
                if (!isSuccess) return;

                const role = ROLE_MAP[roleId] || {};

                $detailRole.text(role.label || "Unknown");
                $currentRole.text(role.current || "UNKNOWN");
            })
            .catch(e => {
                console.error("Something went wrong while updating role", e);
            });
    });
}

function changeUpdate(authentication, object) {
    const userInfo = {
        username: object.username,
        firstName: object.firstname,
        lastName: object.lastname,
        phone: object.phone,
        dob: object.dateOfBirth
    };

    const oldClass = "px-10 py-3 bg-gray-400 text-gray-700 border border-1 border-gray-500 rounded-xl font-medium cursor-pointer";
    const newClass = "px-10 py-3 bg-indigo-600 hover:bg-indigo-700 text-white border border-1 border-white-500 rounded-xl font-medium cursor-pointer";

    const inputs = {
        username: $("#user-details-username-update"),
        firstName: $("#user-details-firstName-update"),
        lastName: $("#user-details-lastName-update"),
        phone: $("#user-details-phone-update"),
        dob: $("#user-details-dob-update"),
    }

    for (let key in inputs) {
        inputs[key].on("keyup", function () {
            if (inputs[key].val().trim() !== userInfo[key]) {
                $("#user-details-btn-update")
                    .removeClass(oldClass)
                    .addClass(newClass)
                    .prop("disabled", false);
            } else {
                $("#user-details-btn-update")
                    .removeClass(newClass)
                    .addClass(oldClass)
                    .prop("disabled", true);
            }
        })
    }

    $("#user-details-form-update").on("submit", function (e) {
        e.preventDefault();

        const formData = $(this).serializeArray();
        let data = {};
        formData.forEach(item => {
            data[item.name] = item.value;
        });
        handleFormSubmit(authentication, data, object.id, oldClass, newClass);
    })
}

function handleFormSubmit(authentication, data, identity, btnOldClass, btnNewClass) {
    const oldClass = `hidden mt-6 text-left rounded-lg border border-red-500 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 p-3 text-sm font-medium`;
    const newClass = `mt-6 text-left rounded-lg border border-green-500 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 p-3 text-sm font-medium`;

    const userUpdate = UpdateUser.builder()
        .setUsername(data.username)
        .setFirstName(data.firstName)
        .setLastName(data.lastName)
        .setPhone(data.phone)
        .setDateOfBirth(data.dob)
        .build();

    userUpdate.dateOfBirth = dateFormat(data.dob);
    adminService.updateById(userUpdate, authentication, identity)
        .then(async (res) => {
            const response = await res.json();
            console.log(response);
            const {isSuccess, message, errorMessage, data} = response;

            if (!isSuccess) {
                $("#user-details-update-error")
                    .removeClass("hidden")
                    .empty()
                    .text(errorMessage);
                return;
            }

            $('#user-details-update-error')
                .removeClass(oldClass)
                .addClass(newClass)
                .empty()
                .text(message);

            //** Render data info fo UI Detail and Form Update
            renderDataInfo(data);
            // window.location.reload();

            setTimeout(() => {
                $("#user-details-update-error").removeClass(newClass).addClass(oldClass)
                $("#user-details-btn-update")
                    .removeClass(btnNewClass)
                    .addClass(btnOldClass)
                    .prop("disabled", true);
            }, 2000)
        })
        .catch(async (e) => console.error("Something went wrong while fetch data", e));
}

function warningUpdate(authentication, object) {

    const $warningCheckbox = $("#user-details-warning");
    const $warningBox = $("#user-details-warning-bounder");

    const EFFECT_SUCCESS = "ring-2 ring-lime-400/40 border-lime-400 scale-[1.01]";
    const EFFECT_ERROR = "ring-2 ring-orange-400/40 border-orange-400 scale-[1.01]";
    const EFFECT_BASE = "transition-all duration-300 ease-out";

    // ensure animation smooth
    $warningBox.addClass(EFFECT_BASE);

    $warningCheckbox.on("change", function () {
        const isChecked = this.checked;
        const value = isChecked ? 1 : 0;

        adminService
            .warningUpdate(authentication, value, object.id)
            .then(res => res.json())
            .then(({isSuccess, data}) => {

                if (isSuccess) {
                    object.warning = data.warning;

                    playEffect(EFFECT_SUCCESS);
                } else {
                    rollback();
                    playEffect(EFFECT_ERROR);
                }
            })
            .catch((e) => {
                rollback();
                playEffect(EFFECT_ERROR);
                console.error("Something went wrong while update warning >>>", e);
            });
    });

    // ===== HELPERS =====
    function rollback() {
        $warningCheckbox.prop("checked", !!object.warning);
    }

    function playEffect(effectClass) {
        $warningBox
            .addClass(effectClass);

        setTimeout(() => {
            $warningBox.removeClass(effectClass);
        }, 350);
    }
}

function avatarUpdate(authentication, object) {

    const $input = $("#user-details-avatar-input");
    const $avatar = $("#user-details-avatar");

    const MAX_SIZE = 2 * 1024 * 1024; // 2MB
    const ALLOW_TYPES = ["image/jpeg", "image/png", "image/webp"];

    $input.on("change", function () {
        const file = this.files[0];
        if (!file) return;

        // ===== VALIDATE =====
        if (!ALLOW_TYPES.includes(file.type)) {
            console.error("Invalid image type");
            resetInput();
            return;
        }

        if (file.size > MAX_SIZE) {
            console.error("Image size too large");
            resetInput();
            return;
        }

        // ===== PREVIEW =====
        const previewUrl = URL.createObjectURL(file);
        $avatar.attr("src", previewUrl);

        // disable input tránh spam
        $input.prop("disabled", true);

        // ===== UPLOAD =====
        adminService
            .updateImage(authentication, file, object.id)
            .then(res => res.json())
            .then(({isSuccess, data}) => {

                if (!isSuccess) throw new Error("Upload failed");
                const {avatar} = data;
                const avatarUrl =
                    avatar == null || avatar === ""
                        ? "https://placehold.co/160"
                        : /^https?:\/\//.test(avatar)
                            ? avatar
                            : `http://localhost:3366/${avatar}`;

                // update avatar from server
                $avatar.attr("src", `${avatarUrl}/?t=${Date.now()}`);
            })
            .catch((e) => {
                console.error("Something went wrong while upload avatar", e);
                rollbackAvatar();
            })
            .finally(() => {
                URL.revokeObjectURL(previewUrl);
                resetInput();
            });
    });

    // ===== HELPERS =====
    function rollbackAvatar() {
        // rollback avatar cũ
        $avatar.attr("src", object.avatar ? object.avatar : "https://placehold.co/160");
    }

    function resetInput() {
        $input.prop("disabled", false).val("");
    }
}
