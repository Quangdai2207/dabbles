import {htmlPath} from "../../../pagesPath/paths.js";
import initRoutes, {internalRouter} from "../../router.js";
import authService from "../../services/auth/AuthService.js";
import {removeToken} from "../../../utils/Token.js";
import authContext from "../../hooks/context/authContext.js";
import {connectWS} from "../../main.js";



const isConnect = false;
export default function PORTAL(path, mainContent) {
    let route = path;

    if (!route.startsWith("/account")) {
        route = "/account/portal";
        history.replaceState(null, "", route);
    }

    const data = authContext.getContext();
    if (!isConnect) connectWS(data);

    const portalUI = {
        main: htmlPath.portal.layout.portal,
        header: htmlPath.portal.layout.header,
        footer: htmlPath.portal.layout.footer,
    }

    const headerSection = $("#header")
    const footerSection = $("#footer")

    $.get(portalUI["header"]).done(html => {
        headerSection.empty().html(html);

        if (data) $("#account-username").empty().text(data.email);
        $(document).on("click", "#account-logout", function () {
            handleLogout(data.email);
        })
    });
    $.get(portalUI["main"]).done(html => {
        mainContent.empty().html(html)
        const portalArea = $("#portal-area")
        if (!portalArea) return;
        initRoutes(portalArea);
        internalRouter(location.pathname, portalArea)
    });

    $.get(portalUI["footer"]).done(html => footerSection.empty().html(html));
}

export function handleLogout(email) {
    authService.logout(email)
        .then(async (res) => {
            const response = await res.json()
            if (response.isSuccess) {
                removeToken();
            }
        })
        .catch(async (e) => {
            console.error("Something went wrong: ", e);
        })
}