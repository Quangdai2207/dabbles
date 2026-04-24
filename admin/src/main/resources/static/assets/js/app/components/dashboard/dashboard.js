import {htmlPath} from "../../../pagesPath/paths.js";
import initRoutes, {internalRouter} from "../../router.js";
import {removeToken} from "../../../utils/Token.js";
import authService from "../../services/auth/AuthService.js";
import authContext from "../../hooks/context/authContext.js";
import {connectWS} from "../../main.js";
/**
 * <h1 style="color: white">Dashboard Layout</h1>
 * <p style="color:white">
 *     Dashboard Layout, UI for Super-admin when starts app in the first time if authenticated
 * </p>
 * **/

const isConnect = false;
export default function DASHBOARD(path, mainContent) {
    let route = path;
    let auth = authContext.getContext().token;

    if (!route.startsWith("/admin")) {
        route = "/admin/dashboard";
        history.replaceState(null, "", route);
    }

    const data = authContext.getContext();
    if (!isConnect) connectWS(data);

    const dashboardUI = {
        main: htmlPath.dashboard.layout.dashboard,
        header: htmlPath.dashboard.layout.header,
        footer: htmlPath.dashboard.layout.footer,
    }

    const headerSection = $("#header")
    const footerSection = $("#footer")

    $.get(dashboardUI["header"]).done(html => {
        headerSection.empty().html(html)

        if (data) $("#super-account").empty().text(data.email);
        $(document).on("click", "#super-logout", function () {
            handleLogout(data.email, auth);
        })
    });
    $.get(dashboardUI["main"]).done(html => {
        mainContent.empty().html(html)

        const dashboardArea = $("#dashboard-area");
        if (!dashboardArea) return;

        toggleAside();

        initRoutes(dashboardArea);
        internalRouter(location.pathname, dashboardArea)
    });

    $.get(dashboardUI["footer"]).done(html => footerSection.empty().html(html));
}

export function handleLogout(email, auth) {
    authService.logout(email, auth)
        .then(async (res) => {
            const response = await res.json();
            const {isSuccess} = response;
            if (isSuccess) {
                removeToken();
            }
        })
        .catch(async (e) => {
            console.error("Something went wrong: ", e);
        })
}

function toggleAside() {
    let isOpen = true;
    $("#aside-toggle-btn").on("click", function () {
        const $aside = $("#dashboard-aside");
        const $btn = $("#aside-toggle-btn");
        const $icon = $("#aside-toggle-icon");

        if (isOpen) {
            // ==== HIDE ASIDE ====
            $aside
                .removeClass("w-72 p-6")
                .addClass("w-0 p-0 overflow-hidden");

            $btn
                .removeClass("w-3 h-12 rounded-r-xl")
                .addClass(
                    "w-2 h-14 rounded-r-full",
                );

            $icon
                .addClass("opacity-0")
                .css("transform", "rotate(180deg)");

        } else {
            $aside
                .removeClass("w-0 p-0 overflow-hidden")
                .addClass("w-72 p-6");

            $btn
                .removeClass("w-2 h-14 rounded-r-full")
                .addClass(
                    "w-3 h-12 rounded-r-xl",
                );

            $icon
                .removeClass("opacity-0")
                .css("transform", "rotate(0deg)");
        }

        isOpen = !isOpen;
    });
}


