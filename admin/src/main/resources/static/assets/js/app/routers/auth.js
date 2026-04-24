import LOGIN from "../pages/auth/login.js";
import FORGET_PASSWORD from "../pages/auth/forget_password.js";
import RESET_PASSWORD from "../pages/auth/reset_password.js";

/**
 *     <h5 style="font-weight: 900; color: white">Authentication RouterDOMs</h5>
 *     <p style="font-family:'roboto'; color:white">
 *         Subscribes RouterDOM when auth have a new UI
 *     </p>
 * **/
export const AuthRouterDom = {
    "/auth/login" : LOGIN,
    "/auth/forgot-password" : FORGET_PASSWORD,
    "/auth/reset-password/:slug" : RESET_PASSWORD,
    "/auth/reset-password" : RESET_PASSWORD,
}