import {htmlPath} from "../../../pagesPath/paths.js";
import initRoutes, {internalRouter} from "../../router.js";
import reloadCaptcha from "../../../utils/captcha.js";

export default function AUTH_FORM(path, mainContent) {
    let route = path;

    if (!route.startsWith("/auth")) {
        route = "/auth/login";
        history.replaceState(null, "", route);
    }

    const authLayout = htmlPath.auth.layout;

    $.get(authLayout).done((html) => {
        mainContent.empty().html(html)
        const authForm = $("#auth-form")
        if (!authForm) return;

        initRoutes(authForm)
        internalRouter(location.pathname, authForm)
    })
        .fail(html => {
            console.error("Can not find 'auth layout'", html);
            mainContent.empty().html("<div><p>Can not find Auth Layout</p></div>");
        });
}