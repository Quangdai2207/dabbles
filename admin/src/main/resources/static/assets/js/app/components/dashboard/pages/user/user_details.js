import {htmlPath} from "../../../../../pagesPath/paths.js";
import NOTFOUND from "../../../../pages/notfound.js";
import userService from "../../../../services/user/userService.js";
import {getAuthentication} from "../../../../../utils/Token.js";
import {socketContext} from "../../../../hooks/context/socketContext.js";
import {USER_INFO} from "./user_info.js";
import {USER_IMAGE} from "./user_image.js";
import USER_PAYMENT_MANAGE from "./payment/user_payment_manage.js";
import TRANSACTION_OVERVIEW from "./transaction/user_transaction_overview.js";
import USER_SUBSCRIPTION from "./subsribes/user_subs.js";

export default async function USER_DETAILS(path, mainContent, params) {
    const pagePath = htmlPath.dashboard.feature.user.user_details;
    const authentication = getAuthentication();
    const slug = params?.slug;

    if (!slug) {
        NOTFOUND(path, mainContent);
        return;
    }

    const response = await userService.getDetails(authentication, slug);

    if (response.status === 401) {
        location.href = "/auth/login";
        return;
    }

    if (response.status === 400) {
        NOTFOUND(path, mainContent);
        return;
    }

    try {
        const html = await $.get(pagePath);
        mainContent.empty().html(html);

        const detailMainLayout = $("#user-details-main-layout");

        $('#user-details-btn-info').prop("href", `/admin/users/details/${slug}/info`);
        $('#user-details-btn-payments').prop("href", `/admin/users/details/${slug}/payments`);
        $('#user-details-btn-images').prop("href", `/admin/users/details/${slug}/images`);
        $('#user-details-btn-transaction').prop("href", `/admin/users/details/${slug}/transaction`);
        $('#user-details-btn-subs').prop("href", `/admin/users/details/${slug}/subs`);

        await initRoutesUser(authentication, detailMainLayout, slug);
        await internalRouter(location.pathname, detailMainLayout, slug)

        listeningEvent();

        document.title = "Admin - User Details";
    } catch (e) {
        console.error("Cannot load user details page >>>", e);
        mainContent
            .empty()
            .html("<div class='text-red-400'>Cannot load user details page</div>");
    }
}

//** CREATE INTERNAL ROUTER FOR USER DETAILS
async function initRoutesUser(authentication, layoutDetail, identity) {
    // Internal Click
    $(document)
        .off("click.userRoute")
        .on("click.userRoute", "[data-link-user]", function (e) {
            e.preventDefault();

            if (!authentication) {
                location.href = "/auth/login";
                return;
            }

            const path = $(this).attr("href");
            navigate(path, layoutDetail, identity);
        });

    // back / forward
    window.onpopstate = () => {
        internalRouter(
            normalize(location.pathname),
            layoutDetail,
            identity
        );
    };
}

function setActiveUserTab(path) {
    const tabs = [
        "#user-details-btn-info",
        "#user-details-btn-payments",
        "#user-details-btn-images",
        "#user-details-btn-transaction",
        "#user-details-btn-subs",
    ];

    // reset
    tabs.forEach(id => {
        $(id).removeClass(
            "bg-gray-700 text-white border-gray-600"
        ).addClass(
            "bg-gray-800 text-gray-300 border-gray-700"
        );
    });

    // active theo URL
    if (path.endsWith("/info")) {
        $("#user-details-btn-info")
            .removeClass("bg-gray-800 text-gray-300 border-gray-700")
            .addClass("bg-gray-700 text-white border-gray-600");
    }

    if (path.endsWith("/payments")) {
        $("#user-details-btn-payments")
            .removeClass("bg-gray-800 text-gray-300 border-gray-700")
            .addClass("bg-gray-700 text-white border-gray-600");
    }

    if (path.endsWith("/images")) {
        $("#user-details-btn-images")
            .removeClass("bg-gray-800 text-gray-300 border-gray-700")
            .addClass("bg-gray-700 text-white border-gray-600");
    }
    if (path.endsWith("/transaction")) {
        $("#user-details-btn-transaction")
            .removeClass("bg-gray-800 text-gray-300 border-gray-700")
            .addClass("bg-gray-700 text-white border-gray-600");
    }

    if (path.endsWith("/subs")) {
        $("#user-details-btn-subs")
            .removeClass("bg-gray-800 text-gray-300 border-gray-700")
            .addClass("bg-gray-700 text-white border-gray-600");
    }
}


async function navigate(path, layoutDetail, identity) {
    path = normalize(path);
    history.pushState(null, "", path);
    await internalRouter(path, layoutDetail, identity);
}

function normalize(path) {
    return path.split("?")[0].replace(/\/$/, "");
}

async function internalRouter(path, layoutDetail, identity) {
    setActiveUserTab(path)

    const section = path.split("/")[5]; // info | payments | images

    switch (section) {
        case "info":
            await USER_INFO(path, layoutDetail, identity);
            break;
        case "payments":
            await USER_PAYMENT_MANAGE(path, layoutDetail, identity);
            break;
        case "transaction":
            await TRANSACTION_OVERVIEW(path, layoutDetail, identity);
            break;
        case "images":
            await USER_IMAGE(path, layoutDetail, identity);
            break;
        case "subs":
            await USER_SUBSCRIPTION(path, layoutDetail, identity);
            break;
        default:
            await USER_INFO(path, layoutDetail, identity);
            return;
    }
}

//** LISTENING DATA REALTIME WHEN OTHER USER LOGIN AND CONNECT SOCKET SUCCESS
function listeningEvent() {
    socketContext.subscribe((userId, isOnline) => {
        const status = $("#user-details-online-status");
        status.html(isOnline ? onlineBadge() : offlineBadge());
    });
}

//** Helper
function onlineBadge() {
    return `
       <span
            class="inline-flex items-center gap-2 px-2.5 py-1
               text-[11px] rounded-full
               bg-emerald-800 border border-emerald-700 text-emerald-300">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            Online
        </span>`;
}

function offlineBadge() {
    return `
       <span
            class="inline-flex items-center gap-2 px-2.5 py-1
               text-[11px] rounded-full
               bg-gray-800 border border-gray-700 text-gray-300">
            <span class="w-2 h-2 rounded-full bg-gray-400"></span>
            Offline
        </span>`;
}



