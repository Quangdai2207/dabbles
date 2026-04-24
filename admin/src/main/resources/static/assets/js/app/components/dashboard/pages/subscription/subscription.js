import {htmlPath} from "../../../../../pagesPath/paths.js";
import {getAuthentication} from "../../../../../utils/Token.js";
import {createdFormat_II} from "../../../../../utils/formatPattern.js";
import subscriptionService from "../../../../services/subscription/subscriptionService.js";

export default async function SUBSCRIPTION(path, mainContent) {
    const page = htmlPath.dashboard.feature.dashboard_subscription;
    const authentication = getAuthentication();

    $.get(page).done(html => {
        mainContent.empty().html(html);

        const pageContent = $("#dashboard-subscription");
        if (!pageContent) return;
        const container = $("#subscription-card");
        getAllSubs(authentication, container);
        bindingEvent(authentication, container);
        addNew(authentication, container);
    })
        .fail(html => {
            console.error("Can not find html subscription", html);
            mainContent.empty().html("<div>Can not find html main subscription<div>");
        })

    document.title = "Admin - Profile Manage";
    history.pushState({}, "", path);
}

async function getAllSubs(authentication, container) {
    try {
        const response = await subscriptionService.getAll(authentication);

        const { isSuccess, data } = await response.json();
        if (!isSuccess || !Array.isArray(data)) return;

        const rows = await Promise.all(
            data.map(item => renderData(authentication, item))
        );

        container.empty().append(rows.join(""));

    } catch (e) {
        console.error("Error loading categories", e);
    }
}

async function renderData(authentication, data) {
    const {
        id, price, currency, durationDays, description, createdDate, updatedDate, deleted
    } = data;

    const created = createdFormat_II(createdDate);
    const updated = updatedDate ? createdFormat_II(updatedDate) : "--";
    const state = !deleted ? "APPROVED" : "DISABLED";
    return `
   <!-- CARD -->
            <div class="subscription-card
                 bg-[#020617]
                 border border-slate-800
                 rounded-2xl
                 overflow-hidden
                 flex flex-col
                 h-full
                 transition-all duration-300 ease-out
                 hover:border-gray-200
                 hover:bg-[#020617]/90"
            data-id="${id}">
                <!-- VIEW MODE -->
                <div class="sub-view p-5 flex flex-col gap-4 flex-1">
                    <div class="flex items-center justify-between">
                        <div>
                            <span class="text-[11px] uppercase tracking-wide text-slate-500">
                                Subscription Plan
                            </span>
                        </div>

                        <span class="px-2 py-0.5 text-[11px] rounded-full
                                     bg-emerald-900/40 text-emerald-400 border border-emerald-800">
                            ${state}
                        </span>
                    </div>

                    <div class="rounded-xl bg-slate-900/40 border border-slate-800 p-4">
                        <div class="flex items-end justify-between">
                            <div class="flex items-baseline gap-2">
                                <span class="text-4xl font-semibold text-white">$${price}</span>
                                <span class="text-sm text-slate-400">USD</span>
                            </div>
                            <span class="text-xs text-slate-400">/ ${durationDays === 999999 ? " Unlimited" : durationDays + " days"}</span>
                        </div>
                        <div class="mt-1 text-xs text-slate-500">
                            Billed every ${durationDays} days
                        </div>
                    </div>

                    <p class="text-sm text-slate-400 line-clamp-2">
                        ${description}
                    </p>

                    <div class="mt-auto pt-3 border-t border-slate-800 text-[11px] space-y-1">
                        <div class="flex justify-between">
                            <span class="text-slate-500">Created</span>
                            <span class="text-slate-300">${created}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-500">Updated</span>
                            <span class="text-slate-300">${updated}</span>
                        </div>
                    </div>
                </div>

                <!-- EDIT MODE (COMPACT) -->
                <div class="sub-edit hidden p-4 flex flex-col gap-4 flex-1">
                
                    <h4 class="text-sm font-semibold text-white">
                        Edit subscription
                    </h4>
                
                    <!-- PRICE + DAYS -->
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="text-xs text-slate-400">Price</label>
                            <input type="number"
                                   name="price"
                                   value="${price}"
                                   class="mt-1 w-full h-10 px-3 bg-transparent border border-slate-700 rounded-lg text-sm text-white"/>
                        </div>
                
                       <div>
                            <label class="text-xs text-slate-400">Duration</label>
                            <select name="durationDays"
                                    class="mt-1 w-full h-10 px-3 bg-transparent border border-slate-700 rounded-lg text-sm text-white">
                                <option value="30" ${durationDays === 30 ? "selected" : ""}>30 days</option>
                                <option value="90" ${durationDays === 90 ? "selected" : ""}>3 months</option>
                                <option value="180" ${durationDays === 180 ? "selected" : ""}>6 month</option>
                                <option value="365" ${durationDays === 365 ? "selected" : ""}>1 year</option>
                                <option value="999999" ${durationDays === 999999 ? "selected" : ""}>LifeTime</option>
                            </select>
                        </div>
                    </div>
                
                    <!-- DESCRIPTION -->
                    <div>
                        <label class="text-xs text-slate-400">Description</label>
                        <textarea rows="3"
                                  name="description"
                                  class="mt-1 w-full px-3 py-2 bg-transparent border border-slate-700 rounded-lg text-sm text-white resize-none">${description}</textarea>
                    </div>
                
                    <!-- ACTION -->
                    <div class="mt-auto grid grid-cols-2 gap-2 pt-3 border-t border-slate-800">
                        <button data-save-id="${id}"
                                class="subs-edit-save h-9 rounded-lg bg-blue-600 text-xs font-semibold text-white">
                            Save
                        </button>
                        <button class="btn-cancel h-9 rounded-lg border border-slate-600 text-xs text-slate-400">
                            Cancel
                        </button>
                    </div>
                </div>

                <!-- ACTION BAR (VIEW MODE ONLY) -->
                <div class="action-bar grid grid-cols-2 border-t border-slate-800 bg-[#020617]">
                    <button class="subs-btn-edit py-3 text-xs font-medium text-sky-400 hover:bg-sky-600/10">
                        Edit
                    </button>
                    <button 
                    data-btn-id="${id}"
                    class="btn-disable-sub py-3 text-xs font-medium text-rose-400 hover:bg-rose-600/10">
                        Disable
                    </button>
                </div>

            </div>
    `
}

function bindingEvent(auth, container) {

    // EDIT
    $(document).on("click", ".subs-btn-edit", function () {
        const $card = $(this).closest(".subscription-card");

        $card.find(".sub-view").addClass("hidden");
        $card.find(".sub-edit").removeClass("hidden");
        $card.find(".action-bar").addClass("hidden");
    });

    // CANCEL
    $(document).on("click", ".btn-cancel", function () {
        const $card = $(this).closest(".subscription-card");

        $card.find(".sub-edit").addClass("hidden");
        $card.find(".sub-view").removeClass("hidden");
        $card.find(".action-bar").removeClass("hidden");
    });

    $(document).on("click", ".subs-edit-save", async function () {
        const $card = $(this).closest(".subscription-card");
        const id = $card.data("id");
        const body = {
            "price" : Number($card.find("input[name=price]").val()),
            "description" : String($card.find("textarea[name=description]").val()),
            "durationDays" :  Number($card.find("select[name=durationDays]").val()),
        }

        console.log(body);
        const res = await subscriptionService.update(auth, id, body);
        if (!res?.ok) return;
        await getAllSubs(auth, container);
    });

    // DISABLE / ACTIVE
    $(document).on("click", ".btn-disable-sub", async function () {
        const id = $(this).data("btn-id");
        const res = await subscriptionService.delete(auth, id);
        if (!res?.ok) return;

        await getAllSubs(auth, container);
    });
}


async function addNew(auth, container) {
    $(document)
        .off("submit", "#subscription-add-form")
        .on("submit", "#subscription-add-form", async function (e) {
            e.preventDefault();

            const $form = $(this);

            const body = {};
            $form.serializeArray().forEach(({name, value}) => {
                body[name] = name === "price" || name === "durationDays" ? Number(value) : value;
            });
            console.log($form.serializeArray());

            const response = await subscriptionService.add(auth, body);

            const result = await response.json();
            const {isSuccess, data, errorMessage} = result;

            if (!isSuccess) {
                $("#subs-create-error").text(`(*) ${errorMessage}`);
                return;
            }

            if (isSuccess && data)  await getAllSubs(auth, container);
        });
}

