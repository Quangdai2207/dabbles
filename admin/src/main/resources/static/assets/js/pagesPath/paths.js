
/**
 * <h1 style="color: white">Path pages HTML</h1>
 * <p style="color: white">
 *     Module "paths.js" in the directory pagePath where is store DOMs layout/ feature pages to render,
 *     including:
 *     <ul style="color: white">
 *         <li>Layouts: Contain layout for the whole web system</li>
 *         <li>Dashboard: contain layout and feature pages within the dashboard UI as the Super-admin</li>
 *         <li>Portal: Contain layout and feature pages within the Portal UI as the role admin</li>
 *         <li>Auth: Contain layout and pages login, reset password, forgot-password</li>
 *     </ul>
 * </p>
 * **/

export const htmlPath = {
    layouts: {
        header: "/assets/html/layouts/header.html",
        footer: "/assets/html/layouts/footer.html",
        layout: "/assets/html/layouts/layout.html",
    },
    dashboard: {
        layout: {
            dashboard: "/assets/html/layouts/dashboard/dashboard.html",
            mainPage: "/assets/html/layouts/dashboard/pages/main_dashboard.html",
            header: "/assets/html/layouts/dashboard/header.html",
            footer: "/assets/html/layouts/dashboard/footer.html",
        },
        feature: {
            user: {
                user: "/assets/html/layouts/dashboard/pages/user/page_user.html",
                user_details: "/assets/html/layouts/dashboard/pages/user/user_details.html",
                user_create: "/assets/html/layouts/dashboard/pages/user/user_create.html",
                user_info: "/assets/html/layouts/dashboard/pages/user/user_info.html",
                user_payment: "/assets/html/layouts/dashboard/pages/user/user_payment.html",
                user_payment_manages: "/assets/html/layouts/dashboard/pages/user/payment/user_payment_manages.html",
                user_payment_details: "/assets/html/layouts/dashboard/pages/user/payment/user_payment_details.html",
                user_image: "/assets/html/layouts/dashboard/pages/user/user_image.html",
                user_image_upload: "/assets/html/layouts/dashboard/pages/user/user_image_upload.html",
                user_image_download: "/assets/html/layouts/dashboard/pages/user/user_image_download.html",
                user_image_details: "/assets/html/layouts/dashboard/pages/user/user_image_detail.html",
                transaction : {
                    overview: "/assets/html/layouts/dashboard/pages/user/transaction/user_transaction_overview.html",
                    type: "/assets/html/layouts/dashboard/pages/user/transaction/user_transaction_type.html",
                },
                subscribe : {
                    overview: "/assets/html/layouts/dashboard/pages/user/subscribe/user_subscribes.html",
                }
            },
            image: {
                images: "/assets/html/layouts/dashboard/pages/image/page_images.html",
                image_details: "/assets/html/layouts/dashboard/pages/image/image_details.html",
                image_update: "/assets/html/layouts/dashboard/pages/image/image_update.html",
                image_create: "/assets/html/layouts/dashboard/pages/image/image_create.html",
            },
            category: {
                categories: "/assets/html/layouts/dashboard/pages/category/page_categories.html",
                category_details: "/assets/html/layouts/dashboard/pages/category/page_category_details.html",
                category_create: "/assets/html/layouts/dashboard/pages/category/page_category_create.html",
                category_edit: "/assets/html/layouts/dashboard/pages/category/page_category_edit.html",
                preview_images: "/assets/html/layouts/dashboard/pages/category/category_images/ui_preview_images.html",
            },
            settings: {
                main_setting: "/assets/html/layouts/dashboard/pages/settings/setting.html"
            },
            dashboard_profile: "/assets/html/layouts/dashboard/pages/page_profile.html",
            dashboard_user_contact: "/assets/html/layouts/dashboard/pages/page_user_contact.html",
            dashboard_payment: "/assets/html/layouts/dashboard/pages/page_payment.html",
            dashboard_report: "/assets/html/layouts/dashboard/pages/page_report.html",
            dashboard_moderation: "/assets/html/layouts/dashboard/pages/page_moderation.html",
            dashboard_role: "/assets/html/layouts/dashboard/pages/page_roles.html",
            dashboard_comment: "/assets/html/layouts/dashboard/pages/page_comment.html",
            dashboard_server_status: "/assets/html/layouts/dashboard/pages/page_server_status.html",
            dashboard_server_storage: "/assets/html/layouts/dashboard/pages/page_server_storage.html",
            dashboard_activity: "/assets/html/layouts/dashboard/pages/page_activity.html",
            dashboard_subscription: "/assets/html/layouts/dashboard/pages/subscription/page_subscription.html",
            dashboard_fee: "/assets/html/layouts/dashboard/pages/fee/page_fee.html",
            dashboard_settings: "/assets/html/layouts/dashboard/pages/page_settings.html",
            dashboard_board: "/assets/html/layouts/dashboard/pages/page_board.html",
            dashboard_conversation: "/assets/html/layouts/dashboard/pages/page_conversation.html",
        },
    },
    portal: {
        layout: {
            portal: "/assets/html/layouts/portal/portal.html",
            mainPage: "/assets/html/layouts/portal/pages/main_portal.html",
            header: "/assets/html/layouts/portal/header.html",
            footer: "/assets/html/layouts/portal/footer.html",
        },
        feature: {
            user: {
                user: "/assets/html/layouts/portal/pages/user/page_user.html",
                user_details: "/assets/html/layouts/portal/pages/user/page_user.html",
            },
            portal_images: "/assets/html/layouts/portal/pages/page_images.html",
            portal_categories: "/assets/html/layouts/portal/pages/page_categories.html",
            portal_activity_logs: "/assets/html/layouts/portal/pages/page_activity_log.html",
            portal_payment: "/assets/html/layouts/portal/pages/page_payment.html",
            portal_image_pending: "/assets/html/layouts/portal/pages/page_pending_image.html",
            portal_subscription: "/assets/html/layouts/portal/pages/page_pending_subscription.html",
            portal_report_center: "/assets/html/layouts/portal/pages/page_report_center.html",
            portal_report_comment: "/assets/html/layouts/portal/pages/page_comment.html",
            portal_profile_settings: "/assets/html/layouts/portal/pages/page_profile_settings.html",
            portal_board: "/assets/html/layouts/portal/pages/page_board.html",
            portal_account_request: "/assets/html/layouts/portal/pages/page_account_request.html",
        },
    },
    auth: {
        layout: "/assets/html/pages/auth/layout.html",
        login: "/assets/html/pages/auth/login.html",
        reset_password: "/assets/html/pages/auth/reset_password.html",
        forget_password: "/assets/html/pages/auth/forget_password.html",
        register: "/assets/html/pages/auth/register.html"
    },

    //** Page content 404/403
    notfound: "/assets/html/pages/notfound.html",
    access_denied: "/assets/html/pages/access_denied.html",

}