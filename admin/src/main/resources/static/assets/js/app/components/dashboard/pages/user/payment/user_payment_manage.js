import {htmlPath} from "../../../../../../pagesPath/paths.js";
import {getAuthentication} from "../../../../../../utils/Token.js";
import userService from "../../../../../services/user/userService.js";
import {renderDataInfo} from "../user_info.js";
import paymentService from "../../../../../services/payment/paymentService.js";
import {USER_PAYMENT} from "./user_payment.js";

export default async function USER_PAYMENT_MANAGE(path, mainContent, identity) {
    console.log(path);
    const page = htmlPath.dashboard.feature.user.user_payment_manages;

    const authentication = getAuthentication();

    if (!mainContent) return;
    if (!authentication) {
        location.href = "/auth/login";
        return;
    }

    const response = await userService.getDetails(authentication, identity);
    const {data} = await response.json();

    renderDataInfo(data)

    await $.get(page)
        .done(html => {
            mainContent.empty().html(html)

            renderPaymentForType(mainContent, identity);

            getPaymentsByUser(authentication, data.username)
            document.title = "Admin - User Payment Manages";
        })
        .fail(html => {
            console.error("Cannot load user payment page >>>", e);
            mainContent
                .empty()
                .html("<div class='text-red-400'>Cannot load user payment page</div>");
        })
}

async function getPaymentsByUser(auth, userId) {
    const response = await paymentService.getPaymentByUser(auth, userId);
    if (response && response.status >= 400) {
        console.error("data not found");
        return;
    }

    const {data} = await response.json();
    renderPaymentData(data);
}

function renderPaymentData(data) {
    let paidTotal = 0.0;
    let depositTotal = 0.0;
    let purchaseTotal = 0.0;
    let subTotal = 0.0;

    if (Array.isArray(data)) {
        data.forEach(item => {
            const {amount, type, paymentStatus} = item;
            if (String(type).toLowerCase() === "deposit" && paymentStatus === 2) {
                depositTotal += amount;
            } else if (String(type).toLowerCase() === "purchase" && paymentStatus === 2) {
                purchaseTotal += amount;
            } else if (String(type).toLowerCase() === "subscribe" && paymentStatus === 2) {
                subTotal += amount;
            }
        })
    }

    paidTotal = depositTotal + purchaseTotal + subTotal;

    $("#payment-overview-total-amount").text(paidTotal);
    $("#payment-overview-deposit-amount").text(depositTotal);
    $("#payment-overview-purchase-amount").text(purchaseTotal);
    $("#payment-overview-subscription-amount").text(subTotal);
}

function renderPaymentForType(mainContent, identity) {
    $(document).off("click", ".btn-type").on("click",  ".btn-type", async function() {
        const type = $(this).data("type");
        await USER_PAYMENT(mainContent, identity, type);
    });
}