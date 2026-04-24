import {htmlPath} from "../../../../../pagesPath/paths.js";
import CreateUser from "../../../../model/user/createUser.js";
import adminService from "../../../../services/admin/AdminService.js";
import PAGE_USER from "./user.js";
import {dateFormat} from "../../../../../utils/formatPattern.js";
import authContext from "../../../../hooks/context/authContext.js";

export default function CREATE_USER(path, mainContent) {
    const page = htmlPath.dashboard.feature.user.user_create;

    $.get(page).done(html => {
        mainContent.empty().html(html);

        $("#create-user-form").on("submit", function (e) {
            e.preventDefault();

            const formData = $(this).serializeArray();
            const data = {};
            formData.forEach(item => {
                data[item.name] = item.value;
            })
            console.log(data)
            let createUser = CreateUser.builder()
                .setUsername(data.username)
                .setFirstName(data.firstName)
                .setLastName(data.lastName)
                .setEmail(data.email)
                .setPhone(data.phone)
                .setRoleId(data.roleId)
                .setPassword(data.password)
                .setPasswordConfirm(data.passwordConfirm)
                .setDateOfBirth(data.dateOfBirth)
                .build();

            createUser["dateOfBirth"] = dateFormat(data.dateOfBirth);
            handleCreateUser(createUser, mainContent)
        });
    })
        .fail(html => {
            console.error("Can not find html main dashboard ", html);
            mainContent.empty().html("<div>Can not find html main dashboard<div>");
        })

    document.title = "Admin - Create new user";
    history.pushState({}, "", path)
}

function handleCreateUser(createUser, mainContent) {
    const oldClass = "bg-blue-600 hover:bg-blue-700"
    const newClass = "bg-gray-600 text-gray-500"

    $("#btn-user-create")
        .removeClass(oldClass)
        .addClass(newClass)
        .text("Create processing...")
        .prop("disabled", true);

    const authentication = authContext.getContext().token;
    adminService.createUser(createUser, authentication)
        .then(async (res) => {
            isUnAuthentication(res, oldClass, newClass);

            const data = await res.json();
            const {isSuccess, message, errorMessage} = data;
            if (!isSuccess) {
                $("#btn-user-create")
                    .removeClass(newClass)
                    .addClass(oldClass)
                    .text("Create User")
                    .prop("disabled", false);

                $("#create-user-error")
                    .removeClass("hidden")
                    .empty()
                    .text(errorMessage)
            } else {
                PAGE_USER("/admin/users", mainContent)
            }
        })
        .catch(e => {
            console.error(e);
        });
}

function isUnAuthentication(res, oldClass, newClass) {
    if (res.status === 401 && !res.ok) {
        $("#create-user-error")
            .removeClass("hidden")
            .empty()
            .text("Unauthorized, you must login before create new user")

        $("#btn-user-create")
            .removeClass(newClass)
            .addClass(oldClass)
            .text("Create User")
            .prop("disabled", false);

        return;
    }
    $('#create-user-error')
        .addClass("hidden")
        .empty();
}