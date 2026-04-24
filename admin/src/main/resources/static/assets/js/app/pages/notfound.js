import {htmlPath} from "../../pagesPath/paths.js";

export default function NOTFOUND(path, mainContent) {
    console.log("Main content not found =>> ", mainContent)
    const notfound = htmlPath.notfound;
    $.get(notfound).done(html => {
        mainContent.empty().html(html)
        $(document).off("click", "button#not-found").on("click", "button#not-found", function() {
            if (mainContent.attr("id") === "dashboard-area") location.href = "/admin/dashboard"
            else if (mainContent.attr("id") === "auth-form") location.href = "/auth/login"
            else if (mainContent.attr("id") === "portal-area") location.href = "/account/portal"
        });
    })
        .fail(html => {
            console.error("Can not find login.html in the path ", html);
            mainContent.empty().html("<h4>Can not find 404 page<h4>");
        })
    document.title = "404 - Page Not Found";
    if (window.history.length <= 1) history.replaceState({}, "", path);
    else history.pushState({}, "", path)
}