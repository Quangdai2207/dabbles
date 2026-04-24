import {htmlPath} from "../../../../../../pagesPath/paths.js";
import {getAuthentication} from "../../../../../../utils/Token.js";
import userService from "../../../../../services/user/userService.js";
import {renderDataInfo} from "../user_info.js";
import subService from "../../../../../services/sub/subService.js";
import {createdFormat_II} from "../../../../../../utils/formatPattern.js";
import {subsContext} from "../../../../../hooks/context/subsContext.js";

export default async function USER_SUBSCRIPTION(path, mainContent, identity) {
    const page = htmlPath.dashboard.feature.user.subscribe.overview;
    const authentication = getAuthentication();

    if (!mainContent) return;
    if (!authentication) {
        location.href = "/auth/login";
        return;
    }

    const response = await userService.getDetails(authentication, identity);
    const {data} = await response.json();

    renderDataInfo(data)

    await $.get(page).done(html => {
        mainContent.empty().html(html)
        const tableBody = $("#subs-data-list-table");

        getSubsByUserId(authentication, identity, tableBody)

    })
        .fail(html => {
            console.error("Cannot load user payment page >>>", html);
            mainContent
                .empty()
                .html("<div class='text-red-400'>Cannot load user subscribe page</div>");
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

async function getSubsByUserId(auth, userId, tableBody) {
    try {
        const response = await subService.getSubByUserId(auth, userId);
        const {isSuccess, data} = await response.json();

        console.log("Subs user =>>> ", data);
        if (!isSuccess) {
            tableBody.html(htmlTableRowEmpty("Data can not found."));
            return;
        }

        if (!Array.isArray(data) || data.length === 0) {
            tableBody.html(htmlTableRowEmpty("User without any Subscription."));
            return;
        }

        console.log("Subs user =>>> ", data);
        tableBody.empty();
        subsContext.setData(data);
        data.forEach(item => {
            tableBody.append(renderData(item))
        })
    } catch (e) {
        console.error("Something went wrong while fetch data >>> ", e);
    }
}

function renderData(data) {
    const {
        planPrice, startDate, planDurationDays, endDate, status, createdDate
    } = data;

    const dateSplit = createdFormat_II(createdDate).split(" ");
    const start = createdFormat_II(startDate);
    const end = createdFormat_II(endDate);

    return `
            <tr class="hover:bg-slate-800/60 transition">
                <td class="px-6 py-4 text-slate-100 font-semibold">
                    $ ${planPrice}
                </td>

                <td class="px-6 py-4 text-slate-300">
                    ${planDurationDays}
                </td>

                <td class="px-6 py-4 text-slate-300">
                    ${start}
                </td>

                <td class="px-6 py-4 text-slate-300">
                    ${end}
                </td>

                <td class="px-6 py-4">
                    <span class="px-2.5 py-1 rounded-full text-xs font-semibold
                        ${status === 'ACTIVE'
                            ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-800'
                            : 'bg-rose-900/40 text-rose-400 border border-rose-800'}">
                        ${status}
                    </span>

                </td>

                <td class="px-6 py-4 text-slate-400">
                    ${dateSplit}
                </td>

                <td class="px-6 py-4 text-right space-x-2">
                    <button
                            class="px-3 py-1.5 text-xs rounded-lg
                           border border-sky-500/50 text-sky-400
                           hover:bg-sky-500/10 hover:border-sky-400
                           transition">
                        Report
                    </button>

                    <button
                            class="px-3 py-1.5 text-xs rounded-lg
                           border border-rose-500/50 text-rose-400
                           hover:bg-rose-500/10 hover:border-rose-400
                           transition">
                        Block
                    </button>
                </td>
            </tr>
            `;
}

export function setStatHeaderSubs(
    totalSubs, totalValue, activeTotal, expireTotal
) {
    $("#subs-total").text(totalSubs);
    $("#subs-total-value").text(`$ ${totalValue}`);
    $("#subs-active-total").text(activeTotal);
    $("#subs-expire-total").text(expireTotal);
}
