import {htmlPath} from "../../../../../../pagesPath/paths.js";
import paymentService from "../../../../../services/payment/paymentService.js";
import {getAuthentication} from "../../../../../../utils/Token.js";
import userService from "../../../../../services/user/userService.js";
import {renderDataInfo} from "../user_info.js";
import USER_PAYMENT_DETAILS from "./user_payment_details.js";
import {userPaymentContext} from "../../../../../hooks/context/userPaymentContext.js";
import {createdFormat_II} from "../../../../../../utils/formatPattern.js";
import USER_PAYMENT_MANAGE from "./user_payment_manage.js";

export async function USER_PAYMENT(mainContent, identity, type) {
    const pageUserPayment = htmlPath.dashboard.feature.user.user_payment;
    const authentication = getAuthentication();

    if (!mainContent) return;
    if (!authentication) {
        location.href = "/auth/login";
        return;
    }

    const response = await userService.getDetails(authentication, identity);
    const {data} = await response.json();

    renderDataInfo(data)

    await $.get(pageUserPayment)
        .done(html => {
            mainContent.empty().html(html)
            $("#payment-history").text(`${String(type.toUpperCase())} HISTORY`);

            const tableBody = $("#user-payment-table-body");
            if (!tableBody || tableBody.length === 0) return;

            $("#user-payment-btn-back").off("click").on("click", async function() {
                await USER_PAYMENT_MANAGE(location.pathname ,mainContent, identity);
            })

            // Reset filter
            $("#btn-user-payment-filters-reset").on("click", function () {
                resetFilters();
                // Re-render payment table list
                getPaymentByUserId(authentication, data.username, tableBody, type);
            });

            // Reload data when event button click Reload Data
            reloadData(authentication, data, tableBody, type);

            // Render payments table list
            getPaymentByUserId(authentication, data.username, tableBody, type);

            // Render payment details when event click executes
            paymentDetails(authentication, mainContent, identity, type);

            document.title = "Admin - User Payment history";
        })
        .fail(html => {
            console.error("Cannot load user payment page >>>", html);
            mainContent
                .empty()
                .html("<div class='text-red-400'>Cannot load user payment page</div>");
        })
}

function htmlTableRowEmpty(message) {
    return `
            <tr class="border-b border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition">
                <td colspan="8" class="py-2">
                    <p class="text-center font-semibold italic text-xl text-gray-400">${message}</p>
                </td>
            </tr>
        `
}

async function getPaymentByUserId(auth, userId, tableBody, typed) {
    try {
        const response = await paymentService.getPaymentByUser(auth, userId);

        if (response?.status === 400) {
            const paymentErrorSelector = $("#user-details-payment-error")
            paymentErrorSelector.removeClass("hidden");
            return;
        }

        if (response.status === 401) {
            location.href = "/auth/login"
            return;
        }

        const {isSuccess, message, data} = await response.json();

        if (!isSuccess) {
            tableBody.html(htmlTableRowEmpty(message));
            return;
        }

        if (!Array.isArray(data)) {
            tableBody.html(htmlTableRowEmpty(message));
            return;
        }

        tableBody.empty();
        if (String(typed) === "all") {
            userPaymentContext.setData(data);
            let count = 0;
            data.forEach(item => {
                count++;
                tableBody.append(renderPayment(item, count))
            })
        } else {
            let paymentTypes = [];
            data.forEach(item => {
                const {type} = item;
                if (String(type).toLowerCase() === typed) paymentTypes.push(item);
            });

            userPaymentContext.setData(paymentTypes);
            let count = 0;
            paymentTypes.forEach(item => {
                count++;
                tableBody.append(renderPayment(item, count))
            })
        }

        // Search keywords
        searchByKeyword();
        filterStatus();
        filterGateway();
        sortPrice();
        sortDate();
    } catch (e) {
        console.error("Something went wrong while fetch data >>> ", e);
    }
}

function renderPayment(data, count) {
    const paymentStatuses = {
        0: {label: "Failed", color: "bg-gray-600 text-gray-200 border border-gray-500/30 px-4"},
        1: {label: "Pending", color: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"},
        2: {label: "Success", color: "bg-green-500/20 text-green-400 border border-green-500/30"},
        3: {label: "Cancel", color: "bg-red-500/20 text-red-400 border border-red-500/30 px-3"}
    };

    const paymentMethods = {
        1: {label: "PayPal", color: "bg-blue-500/20 text-blue-400 border border-blue-500/30"},
        2: {label: "MoMo", color: "bg-pink-500/20 text-pink-400 border border-pink-500/30"},
        3: {
            label: "VN Pay",
            color: "bg-gradient-to-r from-blue-500/20 to-red-500/20 text-indigo-300 border border-indigo-500/30"
        }
    };

    const {
        id,
        amount,
        currency,
        paymentMethod,
        type,
        paymentStatus,
        paymentDate
    } = data;

    const status = paymentStatuses[paymentStatus] ?? {
        label: "Unknown",
        color: "bg-gray-700 text-gray-300"
    };

    const method = paymentMethods[paymentMethod] ?? {
        label: "Unknown",
        color: "bg-gray-700 text-gray-300"
    };

    const dateSplit = createdFormat_II(paymentDate).split(" ");

    return `
            <tr class="hover:bg-gray-800/60 transition text-center" 
                data-price="${amount}" 
                data-date="${dateSplit[0]} - ${dateSplit[1]}">
                <td class="px-4 py-3 text-xs text-gray-500 truncate max-w-[160px]">
                ${count}
                </td>
                
                <td class="px-4 py-3 text-[12px] font-semibold text-white">
                    ${amount}
                </td>
        
                <td class="px-4 py-3">
                    <span class="px-2 py-1 rounded text-[10px] bg-gray-700 text-gray-300">
                        ${currency}
                    </span>
                </td>
        
                <td class="px-4 py-3">
                    <span class="px-3 py-2 rounded-full text-xs font-semibold ${method.color}">
                        ${method.label}
                    </span>
                </td>
                
                <td class="px-4 py-3 text-right">
                    <span class="rounded-full text-[10px] font-semibold">
                        ${type}
                    </span>
                </td>
        
                <td class="px-4 py-3">
                    <span class="px-2 py-1 rounded-full text-[10px] font-semibold ${status.color}">
                        ${status.label}
                    </span>
                </td>
        
                <td class="px-4 py-3 text-xs text-gray-400">
                    ${dateSplit[0]} - ${dateSplit[1]}
                </td>
        
                <td class="px-4 py-3">
                    <div class="flex gap-2 justify-center">
                        <button
                            data-payment-id="${id}"
                            class="btn-user-payment-details cursor-pointer px-3 py-1 text-xs rounded-lg 
                            bg-gray-700 hover:bg-gray-600 text-gray-200 hover:opacity-50"
                            >
                            Details
                        </button>
                    </div>
                </td>
            </tr>
            `;
}

function paymentDetails(auth, mainContent, userId, type) {
    $(document).off("click", ".btn-user-payment-details")
        .on("click", ".btn-user-payment-details", function () {
            const paymentId = $(this).data("payment-id");
            USER_PAYMENT_DETAILS(auth, mainContent, paymentId, userId, type);
        });
}

export function setStatHeaderUserPayment(
    paidTotal, paymentTotal, failed, successTotal, cancelTotal, pendingTotal, latestPayment,
    failedAmount, pendingAmount, successAmount, cancelAmount
) {
    $("#payment-total-amount").text(paidTotal ?? 0.0);
    $("#payment-total").text(paymentTotal ?? 0.0);
    $("#payment-failed-count").text(failed ?? 0.0);
    $("#payment-success-count").text(successTotal ?? 0.0);
    $("#payment-pending-count").text(pendingTotal ?? 0.0);
    $("#payment-cancel-count").text(cancelTotal ?? 0.0);
    $("#payment-last-date").text(latestPayment ?? "--");

    $("#payment-failed-amount").text(failedAmount ?? 0.0);
    $("#payment-pending-amount").text(pendingAmount ?? 0.0);
    $("#payment-success-amount").text(successAmount ?? 0.0);
    $("#payment-cancel-amount").text(cancelAmount ?? 0.0);
}

// SEARCH KEYWORDS
function searchByKeyword() {
    //** Get Id search input and table row after render table data
    const searchTablePayment = $("#payment-search");
    const tableListPayment = $("#user-payment-table-body tr")

    if (!tableListPayment) return;
    if (tableListPayment.length === 0) return;

    searchTablePayment.on("input", function () {
        const keyword = $(this).val().toLowerCase().trim();
        tableListPayment.each(function () {
            const cols = [0, 1, 2, 3, 4, 5, 6];
            let name = "";

            cols.forEach(i => {
                const cell = $(this).children().eq(i).text().toLowerCase();
                name += cell + " ";
            })
            $(this).toggle(name.includes(keyword));
        });
    })
}

// FILTER STATUS PAYMENT
function filterStatus() {
    const tableListPayment = $("#user-payment-table-body tr")
    const combobox = $("#payment-filter-status");

    if (!tableListPayment || !combobox) return;

    combobox.on("change", function () {
        const status = $(this).val();
        let value = "";
        switch (status) {
            case "0" :
                value = "failed";
                break;
            case "1" :
                value = "pending";
                break;
            case "2" :
                value = "success";
                break;
            case "3" :
                value = "cancel";
                break;
            default:
                value = "";
                break
        }

        tableListPayment.each(function () {
            const status = $(this).children().eq(5).text().toLowerCase();
            $(this).toggle(status.includes(value));
        });
    });
}


// FILTER GATEWAY
function filterGateway() {
    const tableListPayment = $("#user-payment-table-body tr")
    const combobox = $("#payment-filter-gateway");

    if (!tableListPayment || !combobox) return;

    combobox.on("change", function () {
        const status = $(this).val();
        let value = "";
        switch (status) {
            case "1" :
                value = "paypal";
                break;
            case "2" :
                value = "vnpay";
                break;
            case "3" :
                value = "momo";
                break;
            default:
                value = "";
                break;
        }

        tableListPayment.each(function () {
            const status = $(this).children().eq(3).text().toLowerCase();
            $(this).toggle(status.includes(value));
        });
    });
}

function sortPrice() {
    const combobox = $("#payment-sort-price");
    const tableListPayment = $("#user-payment-table-body")

    if (combobox.length === 0) return;
    combobox.off("change").on("change", function () {
        const value = $(this).val();
        const rows = tableListPayment.find("tr").get();

        rows.sort(function (a, b) {
            const priceA = Number($(a).data("price"));
            const priceB = Number($(b).data("price"));

            switch (value) {
                case "1":
                    return priceB - priceA;
                case "2":
                    return priceA - priceB;
                default:
                    return "";
            }
        });
        $.each(rows, function (_, row) {
            tableListPayment.append(row);
        });
    });
}

function parsePaymentDate(dateStr) {
    // "10-01-2026 - 13:38"
    if (!dateStr) return 0;

    const [datePart, timePart] = dateStr.split(" - ");
    if (!datePart || !timePart) return 0;

    const [day, month, year] = datePart.split("-").map(Number);
    const [hour, minute] = timePart.split(":").map(Number);

    return new Date(year, month - 1, day, hour, minute).getTime();
}

function sortDate() {
    const combobox = $("#payment-sort-date");
    const tableListPayment = $("#user-payment-table-body");

    if (combobox.length === 0) return;
    combobox.off("change").on("change", function () {
        const value = $(this).val();
        const rows = tableListPayment.find("tr").get();

        rows.sort(function (a, b) {
            const dateA = parsePaymentDate($(a).data("date"));
            const dateB = parsePaymentDate($(b).data("date"));

            if (value === "1") return dateB - dateA; // mới → cũ
            if (value === "2") return dateA - dateB; // cũ → mới
            return 0;
        });

        $.each(rows, function (_, row) {
            tableListPayment.append(row);
        });
    });
}


function reloadData(auth, data, tableBody, type) {
    let isLoading = false;
    $("#user-payment-btn-reload-data").on("click", function () {
        isLoading = true;
        $(this)
            .removeClass("bg-blue-800 border border-blue-700")
            .addClass("bg-gray-800 border border-gray-700")
            .prop("disabled", isLoading)
            .text("Refreshing ...");

        resetFilters();

        // Re-render payment table list
        setTimeout(async () => {
            await getPaymentByUserId(auth, data.username, tableBody, type);
            isLoading = false;
            $("#user-payment-btn-reload-data")
                .removeClass("bg-gray-800 border border-gray-700")
                .addClass("bg-blue-800 border border-blue-700")
                .prop("disabled", isLoading)
                .text("Refresh");
        }, 2000)
    });
}

function resetFilters() {
    $("#payment-filter-gateway").val("");
    $("#payment-search").val("");
    $("#payment-filter-status").val("");
    $("#payment-filter-type").val("");
    $("#payment-sort-date").val("");
    $("#payment-sort-price").val("");
}





