import {htmlPath} from "../../../../../../pagesPath/paths.js";
import {getAuthentication} from "../../../../../../utils/Token.js";
import transService from "../../../../../services/transaction/transService.js";
import TRANSACTION_OVERVIEW from "./user_transaction_overview.js";
import {createdFormat_II} from "../../../../../../utils/formatPattern.js";

export async function USER_TRANSACTION_TYPE(mainContent, identity, type) {
    const page = htmlPath.dashboard.feature.user.transaction.type;
    const authentication = getAuthentication();

    if (!mainContent) return;
    if (!authentication) {
        location.href = "/auth/login";
        return;
    }

    await $.get(page)
        .done(html => {
            mainContent.empty().html(html)
            $("#transaction-type").text(type.toUpperCase())
            const tableRow = $("#wallet-transaction-list-data");

            $("#transaction-type-btn-back").off("click").on("click", async function () {
                await TRANSACTION_OVERVIEW(location.pathname, mainContent, identity);
            });

            getTransactionForType(authentication, identity, tableRow, type)
            document.title = "Admin - User Transaction history";
        })
        .fail(html => {
            console.error("Cannot load user payment page >>>", e);
            mainContent
                .empty()
                .html("<div class='text-red-400'>Cannot load user payment page</div>");
        })
}


function htmlTableRowEmpty(message) {
    return `
            <tr class="border-b border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition">
                <td colspan="7" class="py-2">
                    <p class="text-center font-semibold italic text-xl text-gray-400">${message}</p>
                </td>
            </tr>
        `
}

async function getTransactionForType(auth, userId, tableBody, typed) {
    try {
        const response = await transService.getTransactionsByUserId(auth, userId);
        const {isSuccess, message, data} = await response.json();
        if (!isSuccess) {
            tableBody.html(htmlTableRowEmpty(message));
            return;
        }
        const {walletTransactionResponseDtos} = data;

        if (!Array.isArray(walletTransactionResponseDtos)) {
            tableBody.html(htmlTableRowEmpty(message));
            return;
        }

        tableBody.empty();
        let transactionType = [];
        walletTransactionResponseDtos.forEach(item => {
            const {type} = item;
            console.log("item => ", item);
            if (String(type).toLowerCase() === typed) {
                transactionType.push(item);
            }
        });

        if (transactionType.length === 0) {
            tableBody.html(htmlTableRowEmpty(`${typed.toUpperCase()} Not Yet Transaction`));
            return;
        }

        transactionType.forEach(item => {
            tableBody.append(renderTransactionType(item))
        })

        sortTransactionsDate();
        sortTransactionsAmount();
        sortTransactionsFee();

    } catch (e) {
        console.error("Something went wrong while fetch data >>> ", e);
    }
}

function renderTransactionType(item) {
    const {amount, feeAmount, type, netReceivedAmount, createdDate, feePercent, balanceAfter, description} = item;
    let typeFlow = "";
    switch (type.toLowerCase()) {
        case "sale" :
            typeFlow = "Inflow";
            break;
        case "deposit" :
            typeFlow = "Inflow";
            break;
        default:
            typeFlow = "Outflow";
            break;
    }
    const dateSplit = createdFormat_II(createdDate).split(" ");

    return `
            <tr class="hover:bg-gray-900/60 transition" 
                data-amount="${amount}" 
                data-date="${dateSplit[0]} - ${dateSplit[1]}"
                data-fee="${feeAmount}"
                >
                <td class="py-3 px-3 text-left text-sky-400 font-medium w-[12%]"> ${type}</td>
                <td class="py-3 px-3 text-left text-xs w-[12%]"> ${description}</td>
                <td class="py-3 px-3 text-center w-[10%] ${typeFlow === 'Outflow' ? 'text-rose-400' : 'text-emerald-400'}">${typeFlow}</td>
                <td class="py-3 px-3 text-right text-amber-400 w-[14%]">$ ${amount}</td>
                <td class="py-3 px-3 text-right text-gray-300 w-[10%]">${feePercent}%</td>
                <td class="py-3 px-3 text-right text-gray-200 w-[12%]">$ ${feeAmount}</td>
                <td class="py-3 px-3 text-right text-white font-medium w-[14%]">$ ${netReceivedAmount} </td>
                <td class="py-3 px-3 text-right text-white w-[14%]">$ ${balanceAfter}</td>
                <td class="py-3 px-3 text-center text-gray-400 w-[14%]">${createdFormat_II(createdDate)}</td>
            </tr>`
}

function parseDate(date) {
    // "10-01-2026 - 13:38"
    if (!date) return 0;

    const [datePart, timePart] = date.split(" - ");
    if (!datePart || !timePart) return 0;

    const [day, month, year] = datePart.split("-").map(Number);
    const [hour, minute] = timePart.split(":").map(Number);

    return new Date(year, month - 1, day, hour, minute).getTime();
}

function sortTransactionsDate() {
    const combobox = $("#transaction-sort-date");
    const tableListPayment = $("#wallet-transaction-list-data");

    if (combobox.length === 0) return;
    combobox.off("change").on("change", function () {
        const value = $(this).val();
        console.log(value);
        const rows = tableListPayment.find("tr").get();

        rows.sort(function (a, b) {
            const dateA = parseDate($(a).data("date"));
            const dateB = parseDate($(b).data("date"));

            if (value === "1" || value === "0") return dateB - dateA; // mới → cũ
            if (value === "2") return dateA - dateB; // cũ → mới
            return 0;
        });

        $.each(rows, function (_, row) {
            tableListPayment.append(row);
        });
    });
}

function sortTransactionsAmount() {
    const combobox = $("#transaction-sort-amount");
    const tableListPayment = $("#wallet-transaction-list-data");

    if (combobox.length === 0) return;
    combobox.off("change").on("change", function () {
        const value = $(this).val();
        const rows = tableListPayment.find("tr").get();

        rows.sort(function (a, b) {
            const amountA = Number($(a).data("amount"));
            const amountB = Number($(b).data("amount"));

            if (value === "1" || value === "0") return amountB - amountA; // mới → cũ
            if (value === "2") return amountA - amountB; // cũ → mới
            return 0;
        });

        $.each(rows, function (_, row) {
            tableListPayment.append(row);
        });
    });
}

function sortTransactionsFee() {
    const combobox = $("#transaction-sort-fee");
    const tableListPayment = $("#wallet-transaction-list-data");

    if (combobox.length === 0) return;
    combobox.off("change").on("change", function () {
        const value = $(this).val();
        const rows = tableListPayment.find("tr").get();

        rows.sort(function (a, b) {
            const amountA = Number($(a).data("fee"));
            const amountB = Number($(b).data("fee"));

            if (value === "1" || value === "0") return amountB - amountA; // mới → cũ
            if (value === "2") return amountA - amountB; // cũ → mới
            return 0;
        });

        $.each(rows, function (_, row) {
            tableListPayment.append(row);
        });
    });
}









