import {htmlPath} from "../../../../../../pagesPath/paths.js";
import {getAuthentication} from "../../../../../../utils/Token.js";
import userService from "../../../../../services/user/userService.js";
import {renderDataInfo} from "../user_info.js";
import TransactionService from "../../../../../services/transaction/transService.js";
import {USER_TRANSACTION_TYPE} from "./user_transaction_type.js";
import walletService from "../../../../../services/wallet/walletService.js";

export default async function TRANSACTION_OVERVIEW(path, mainContent, identity) {
    const page = htmlPath.dashboard.feature.user.transaction.overview
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
            getTransactionByUser(authentication, data.id);
            renderTransactionForType(mainContent, data.id);

            document.title = "Admin - User Transaction Overview";
        })
        .fail(html => {
            console.error("Cannot load user transaction page >>>", e);
            mainContent
                .empty()
                .html("<div class='text-red-400'>Cannot load user payment page</div>");
        })
}

async function getTransactionByUser(auth, userId) {
    const response = await TransactionService.getTransactionsByUserId(auth, userId);
    if (response && response.status >= 400) {
        console.error("data not found");
        return;
    }

    const {data} = await response.json();
    await renderWalletTransaction(auth, data);
}

async function renderWalletTransaction(auth, data) {
    let totalAmountInFlow = 0.0;
    let totalAmountOutFlow = 0.0;
    let withDrowTotal = 0.0;
    let withDrowTFeeTotal = 0.0;
    let saleTotal = 0.0;
    let saleFeeTotal = 0.0;
    let purchaseTotal = 0.0;
    let purchaseFeeTotal = 0.0;
    let feeTotal = 0.0;
    let subscriptionTotal = 0.0;
    let subscriptionFeeTotal = 0.0;
    let depositTotal = 0.0;
    let depositFeeTotal = 0.0;


    if (data) {
        $("#wallet-transaction-overview").removeClass("hidden")
        const {walletTransactionResponseDtos, walletId} = data;
        await getWalletInfo(auth, walletId)

        if (Array.isArray(walletTransactionResponseDtos)) {
            walletTransactionResponseDtos.forEach(item => {
                const {amount, feeAmount, type, netReceivedAmount} = item;
                if (String(type).toLowerCase() === "sale") {
                    saleTotal = formatAmount(saleTotal, netReceivedAmount, 2);
                    saleFeeTotal = formatAmount(saleFeeTotal, feeAmount, 2);
                } else if (String(type).toLowerCase() === "purchase") {
                    purchaseTotal = formatAmount(purchaseTotal, amount, 2)
                    purchaseFeeTotal = formatAmount(purchaseFeeTotal, feeAmount, 2)
                } else if (String(type).toLowerCase() === "withdraw") {
                    withDrowTotal -= Number((withDrowTotal - amount).toFixed(2));
                    withDrowTFeeTotal = Number((withDrowTFeeTotal + feeAmount).toFixed(2));
                } else if (String(type).toLowerCase() === "deposit") {
                    depositTotal += Number((depositTotal + netReceivedAmount).toFixed(2));
                    depositFeeTotal = Number((depositFeeTotal + feeAmount).toFixed(2));
                } else if (String(type).toLowerCase() === "subscribe") {
                    subscriptionTotal = Number((subscriptionTotal - amount).toFixed(2));
                    subscriptionFeeTotal = Number((subscriptionFeeTotal + feeAmount).toFixed(2));
                }
                feeTotal = Number((feeTotal + feeAmount).toFixed(2));
            })
        }
        totalAmountOutFlow = Number(purchaseTotal + withDrowTotal + subscriptionTotal).toFixed(2);
        totalAmountInFlow = Number(depositTotal + saleTotal).toFixed(2);

        $("#wallet-transaction-total-amount-inflow").text(`$${totalAmountInFlow}`);
        $("#wallet-transaction-total-amount-outflow").text(`$${totalAmountOutFlow}`);
        $("#wallet-transaction-fee-total").text(`$${feeTotal}`);

        // Set value for each card
        $("#wallet-transaction-sale-total").text(`$${saleTotal}`);
        $("#wallet-transaction-sale-fee-total").text(`$${saleFeeTotal}`);

        $("#wallet-transaction-purchase-total").text(`$${purchaseTotal.toFixed(2)}`);
        $("#wallet-transaction-purchase-fee-total").text(`$${purchaseFeeTotal}`);

        $("#wallet-transaction-subscription-total").text(`$${subscriptionTotal}`);
        $("#wallet-transaction-subscription-fee-total").text(`$${subscriptionFeeTotal}`);

        $("#wallet-transaction-withdraw-total").text(`$${withDrowTotal}`);
        $("#wallet-transaction-withdraw-fee-total").text(`$${withDrowTFeeTotal}`);

        $("#wallet-transaction-deposit-total").text(`$${depositTotal}`);
        $("#wallet-transaction-deposit-fee-total").text(`$${depositFeeTotal}`);
    } else {
        $("#wallet-address").text("Not Yet");
        $("#wallet-transaction-overview").addClass("hidden")
    }
}

function formatAmount(val1, val2, fixVal) {
    return val2 > 0 ? Number((val1 + val2).toFixed(fixVal)) : Number((val1 - val2).toFixed(fixVal));
}

function renderTransactionForType(mainContent, identity) {
    $(document)
        .off("click", ".btn-trans-type")
        .on("click", ".btn-trans-type", async function () {
            const type = $(this).data("type");
            await USER_TRANSACTION_TYPE(mainContent, identity, type);
        });
}

async function getWalletInfo(auth, walletId) {
    // Get wallet info
    const response = await walletService.getWalletById(auth, walletId);
    if (!response || !response.ok) return null;
    const {data} = await response.json();

    const {balance, currency} = data;

    $("#wallet-balance").text(`$${balance}`);
    $("#wallet-address").text(walletId ?? "Not yet");
    if (currency.toLowerCase() === "usd") $("#wallet-currency-full").text(`US Dollar - ${currency}`);
    if (currency.toLowerCase() === "vnd") $("#wallet-currency-full").text(`Dong - ${currency}`);

}