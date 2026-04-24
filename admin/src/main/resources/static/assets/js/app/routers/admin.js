import MAIN_PORTAL from "../components/portal/pages/main_portal.js";
import PAGE_USER from "../components/portal/pages/user/user.js";

/**
 *     <h5 style="font-weight: 900; color: white">Admin RouterDOMs</h5>
 *     <p style="font-family:'roboto'; color:white">
 *         Subscribes RouterDOM when admin have a new UI
 *     </p>
 * **/
export const AdminRouterDom = {
    // ASIDE MAIN PORTAL
    "/account": MAIN_PORTAL,
    "/account/portal": MAIN_PORTAL,
    "/account/home": MAIN_PORTAL,

    "/account/pending-accounts" : "",
    "/account/pending-images" : "",
    "/account/reports" : "",
    "/account/logs" : "",
    "/account/settings" : "",
    "/account/users" : PAGE_USER,
}
