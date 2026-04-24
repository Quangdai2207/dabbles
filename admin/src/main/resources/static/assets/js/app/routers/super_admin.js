'use strict'

import MAIN_DASHBOARD from "../components/dashboard/pages/main_dashboard.js";
import PAGE_USER from "../components/dashboard/pages/user/user.js";
import USER_DETAILS from "../components/dashboard/pages/user/user_details.js";
import CREATE_USER from "../components/dashboard/pages/user/user_create.js";
import SERVER_STATUS from "../components/dashboard/pages/server_status.js";
import ACTIVITY_LOGS from "../components/dashboard/pages/activity_log.js";
import CATEGORY from "../components/dashboard/pages/category/categories.js";
import BOARD from "../components/dashboard/pages/board.js";
import COMMENTS from "../components/dashboard/pages/comment.js";
import IMAGES from "../components/dashboard/pages/image/images.js";
import CONVERSATION from "../components/dashboard/pages/conversation.js";
import PROFILE from "../components/dashboard/pages/profile.js";
import CATEGORY_DETAILS from "../components/dashboard/pages/category/category_details.js";
import IMAGE_DETAILS from "../components/dashboard/pages/image/image_details.js";
import SETTING from "../components/dashboard/pages/settings/setting.js";
import SUBSCRIPTION from "../components/dashboard/pages/subscription/subscription.js";
import FEE from "../components/dashboard/pages/fee/fee.js";
/**
 *     <h5 style="font-weight: 900; color: white">Super Admin RouterDOMs</h5>
 *     <p style="font-family:'roboto'; color:white">
 *         Subscribes RouterDOM when super-admin have a new UI
 *     </p>
 * **/

export const SuperRouterDom = {
    //** ASIDE MAIN DASHBOARD
    "/admin": MAIN_DASHBOARD,
    "/admin/home": MAIN_DASHBOARD,
    "/admin/dashboard": MAIN_DASHBOARD,

    //** Main Features manage relate to account
    "/admin/users": PAGE_USER,
    "/admin/users/create": CREATE_USER,
    "/admin/users/details/:slug": USER_DETAILS,
    "/admin/users/details/:slug/info": USER_DETAILS,
    "/admin/users/details/:slug/payments": USER_DETAILS,
    "/admin/users/details/:slug/images": USER_DETAILS,
    "/admin/users/details/:slug/transaction": USER_DETAILS,
    "/admin/users/details/:slug/subs": USER_DETAILS,
    "/admin/roles": "",
    "/admin/subscriptions": SUBSCRIPTION,
    "/admin/fee": FEE,
    "/admin/contacts": "",

    //** Main features manage relate to assets
    "/admin/images": IMAGES,
    "/admin/image/details/:slug": IMAGE_DETAILS,
    "/admin/categories": CATEGORY,
    "/admin/category/details/:slug": CATEGORY_DETAILS,
    "/admin/boards": BOARD,
    "/admin/comments": COMMENTS,

    //** Main features manage relate to logs
    "/admin/reports": "",
    "/admin/moderation": "",

    "/admin/conversations": CONVERSATION,

    //** Main feature manage relate to system
    "/admin/system/server": SERVER_STATUS,
    "/admin/storage": "",
    "/admin/backups": "",
    "/admin/activity": ACTIVITY_LOGS,

    //** settings the whole system
    "/admin/settings": SETTING,

    //** HEADER
    "/admin/plans": "",
    "/admin/payments": "",
    "/admin/system/heath": "",
    "/admin/system/logs": "",

    "/admin/profile": PROFILE,
    "/admin/logout": "",
}
