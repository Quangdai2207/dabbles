import {htmlPath} from "../../../../../pagesPath/paths.js";
import authContext from "../../../../hooks/context/authContext.js";
import userService from "../../../../services/user/userService.js";
import {socketContext} from "../../../../hooks/context/socketContext.js";
import adminService from "../../../../services/admin/AdminService.js";
import {userContext} from "../../../../hooks/context/userContext.js";

export default function PAGE_USER(path, mainContent) {
    const page = htmlPath.dashboard.feature.user.user;
    $.get(page).done(html => {
        mainContent.empty().html(html);
        const userTable = $("#user-table-body");

        if (!userTable) return;

        const authentication = authContext.getContext().token;
        renderDataTable(authentication, userTable)

        //** Listener WS state change event
        listeningEvent();

        deleteUser(authentication, userTable)

        //** Reload table
        $(document)
            .off("click", "#super-admin-btn-reset-filters")
            .on("click", "#super-admin-btn-reset-filters", async function () {
                // Reset filters
                $("#super-admin-filter-status").val("");
                $("#super-admin-filter-role").val("");
                $("#super-admin-search-user").val("");

                try {
                    await renderDataTable(authentication, userTable);
                } catch (e) {
                    console.error("Reload table failed >>>", e);
                }
            });
    })
        .fail(html => {
            console.error("Can not find html main dashboard ", html);
            mainContent.empty().html("<div>Can not find html main dashboard<div>");
        })
    document.title = "Admin - User Manages";
    history.pushState({}, "", path)
}

//** Using Hook SocketContext to render data realtime when user connected socket without reload page
function listeningEvent() {
    socketContext.subscribe((userId, isOnline) => {
        const $row = $(`tr[data-user-email="${userId}"]`);
        if ($row.length === 0) return;

        const $status = $row.find(".user-status");
        if ($status.length === 0) return;
        $status.html(isOnline ? onlineBadge() : offlineBadge());
    });
}

//** Fetch API to keep user status when page reload:
function getStatusUserOnReload() {
    $("tr[user-tabble-row]").each(function () {
        const userId = $(this).data("user-email");
        const $status = $(this).find(".user-status");


        userService.getUserStatus(userId)
            .then(async res => {
                const {event} = await res.json();
                $status.html(event === "CONNECTED" ? onlineBadge() : offlineBadge());
            })
            .catch(e => console.error(e));
    });
}

function renderDataTable(authentication, userTable) {
    userService.getAll(authentication)
        .then(async (res) => {
            if (!res.ok || res.status === 401) {
                console.error("Login session expired, resign now!");
                return;
            }

            const response = await res.json();
            const {isSuccess, data} = response;
            if (!isSuccess) {
                const tableRow = `
                    <tr class="border-b border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition">
                        <td colspan="9" class="items-center">
                            <p class="text-gray-500 bold italic">Data Not Yet</p>
                        </td>
                    </tr>>
                `;
                userTable.empty().html(tableRow);
                return;
            }

            if (isSuccess && data.length > 0) {
                userContext.setData(data);
                userTable.empty();
                data.forEach(item => {
                    if (item.roleId !== "1")
                        userTable.append(htmlTableData(item))
                })

                //** Call filter sets for table data
                searchName();
                filterRoles();
                filterStatus();
                //** get user status user on/off when page reload
                getStatusUserOnReload();
            } else if (isSuccess && length === 0) {
                const tableRow = `
                    <tr class="border-b border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition">
                        <td colspan="9" class="items-center">
                            <p class="text-gray-500 bold italic">Data Not Yet</p>
                        </td>
                    </tr>>
                `;
                userTable.empty().html(tableRow);
            }
        })
        .catch(e => {
            console.error("Something went wrong while fetch data >>> ", e);
            return;
        })
}

function htmlTableData(user) {
    const {
        id, email, phone, active, avatar, roleId, username
    } = user;

    const avatarUrl = avatar ? avatar : `http://localhost:3366/${avatar}`;

    console.log("Avatar => ", avatarUrl);
    return `
        <tr id="user-tabble-row" data-user-email="${email}" class="border-b border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition">
          <td class="px-4 py-3 text-center">
            <img
              src="${avatarUrl}"
              onerror="this.src='https://placehold.co/160'"
              class="w-10 h-10 rounded-full object-cover"/>
          </td>
        
          <td class="px-4 py-3 text-xs">${username}</td>
          <td class="px-4 py-3 text-xs">${email}</td>
          <td class="px-4 py-3 text-xs">${phone ?? "N/a"}</td>
        
          <td class="px-4 py-3">
            <span class="inline-flex px-2.5 py-0.5 text-[10px] font-medium rounded-full ring-1
              ${roleBadge(roleId)}">
              ${roleLabel(roleId)}
            </span>
          </td>
          
          <!-- STATUS -->
          <td class="px-4 py-3">
            <span class="user-status">
              ${socketContext.isOnline(user) ? onlineBadge() : offlineBadge()}
            </span>
          </td>
        
          <td class="px-4 py-3 whitespace-nowrap">
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-full ring-1 ring-inset
                ${active ? `
                    bg-emerald-50 text-emerald-700 ring-emerald-200
                    dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-700
                     ` : `
                        bg-zinc-100 text-zinc-600 ring-zinc-200
                        dark:bg-zinc-800 dark:text-zinc-400 dark:ring-zinc-700
                         `}
              ">
                <span class="
                  w-1.5 h-1.5 rounded-full
                    ${active ? 'bg-emerald-500' : 'bg-zinc-400'}"></span>
                    ${active ? 'Active' : 'Not yet'}
              </span>
           </td>
          <td class="px-4 pt-5 flex justify-center gap-4">
            <a href="/admin/users/details/${id}" data-link
               class="px-2 py-1 text-xs border-blue-600 border hover:bg-blue-700 text-blue hover:text-white rounded-lg cursor-pointer">
              View
            </a>
            <button data-id="${id}" class="cursor-pointer users-btn-delete px-2 py-1 text-xs border-red-600 border hover:bg-red-700 text-white hover:text-white rounded-lg">
              Delete
            </button>
          </td>
        </tr>`;
}

function onlineBadge() {
    return `
          <span class="
            inline-flex items-center gap-1.5
            px-2.5 py-1
            text-[11px] font-medium
            rounded-full
            bg-emerald-50 text-emerald-700
            ring-1 ring-emerald-200
            dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-700
          ">
            <span class="
              w-1.5 h-1.5 rounded-full
              bg-emerald-500
              animate-pulse
            "></span>
            Online
          </span>
    `;
}


function offlineBadge() {
    return `
          <span class="
            inline-flex items-center gap-1.5
            px-2.5 py-1
            text-[11px] font-medium
            rounded-full
            bg-zinc-100 text-zinc-600
            ring-1 ring-zinc-200
            dark:bg-zinc-800 dark:text-zinc-400 dark:ring-zinc-700
          ">
            <span class="
              w-1.5 h-1.5 rounded-full
              bg-zinc-400
            "></span>
            Offline
          </span>
    `;
}


function roleLabel(id) {
    return {2: 'Admin', 3: 'User'}[id] || 'Unknown';
}

function roleBadge(id) {
    return {
        2: `
              bg-indigo-50 text-indigo-700
              ring-1 ring-inset ring-indigo-200
              dark:bg-indigo-900/30 dark:text-indigo-300 dark:ring-indigo-700
            `, 3: `
              bg-slate-50 text-slate-700
              ring-1 ring-inset ring-slate-200
              dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700
            `
    }[id] || `
                  bg-zinc-100 text-zinc-500
                  ring-1 ring-inset ring-zinc-300
                  dark:bg-zinc-800 dark:text-zinc-400 dark:ring-zinc-600
              `;
}

function deleteUser(authentication, userTable) {
    $(document).on("click", ".users-btn-delete", function () {
        const accountID = $(this).data("id");

        if (!accountID) return;

        adminService.deleteAccount(authentication, accountID)
            .then(async (res) => {
                if (res.status === 400) return;

                const {isSuccess} = await res.json()
                if (isSuccess) {
                    renderDataTable(authentication, userTable)
                }
            })
            .catch(async (e) => {
                console.error("Something went wrong while fetch data >>> ", e);
            })

    });
}

function searchName() {
    //** Get Id search input and table row after render table data
    const searchTable = $("#super-admin-search-user");
    const tableList = $("#user-table-body tr")

    if (!searchTable) return;
    if (tableList.length === 0) return;

    searchTable.on("input", function () {
        const keyword = $(this).val().toLowerCase();
        tableList.each(function () {
            const cols = [0, 1, 2, 3, 4, 5, 6];
            var name = "";

            cols.forEach(i => {
                const cell = $(this).children().eq(i).text().toLowerCase();
                name += cell + " ";
            })
            $(this).toggle(name.includes(keyword));
        });
    })
}

function filterRoles() {
    const tableList = $("#user-table-body tr")
    const combobox = $("#super-admin-filter-role");

    if (!tableList || !combobox) return;

    combobox.on("change", function () {
        const value = $(this).val().toLowerCase();

        tableList.each(function () {
            const role = $(this).children().eq(4).text().toLowerCase();
            $(this).toggle(role.includes(value));
        });
    });
}

function filterStatus() {
    const tableList = $("#user-table-body tr")
    const combobox = $("#super-admin-filter-status");

    if (!tableList || !combobox) return;

    combobox.on("change", function () {
        const value = $(this).val().toLowerCase();

        tableList.each(function () {
            const status = $(this).children().eq(6).text().toLowerCase();
            $(this).toggle(status.includes(value));
        });
    });
}

export function setStatHeaderUser(
    userTotal,
    activeTotal,
    blockTotal,
    publicTotal,
    warningTotal
) {
    $("#section-user-stat-total").text(userTotal);
    $("#section-user-stat-activated-total").text(activeTotal);
    $("#section-user-stat-block-total").text(blockTotal);
    $("#section-user-stat-public-total").text(publicTotal);
    $("#section-user-stat-warning-total").text(warningTotal);
}