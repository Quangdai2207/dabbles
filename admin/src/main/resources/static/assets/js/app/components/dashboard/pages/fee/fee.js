import {htmlPath} from "../../../../../pagesPath/paths.js";
import {getAuthentication} from "../../../../../utils/Token.js";
import {createdFormat_II} from "../../../../../utils/formatPattern.js";
import feeService from "../../../../services/fee/feeService.js";

export default async function FEE(path, mainContent) {
    const page = htmlPath.dashboard.feature.dashboard_fee;
    const auth = getAuthentication();

    await $.get(page).done(html => {
        mainContent.empty().html(html);

        const container = $("#fee-cards");

        getAllFee(auth, container);
        bindFeeEvents(auth, container);
        feeCreate(auth, container);
    });

    document.title = "Admin - Fee Manage";
    history.pushState({}, "", path);
}
async function getAllFee(auth, container) {
    const res = await feeService.getAll(auth);
    if (!res?.ok) return;

    const { isSuccess, data } = await res.json();
    if (!isSuccess) return;

    const html = data.map(item => renderData(auth, item)).join("");
    container.empty().append(html);
}

function renderData(auth, data) {
    const { id, percent, type, isDeleted, createdDate, updatedDate } = data;
    const state = !isDeleted ? "APPLY" : "DISABLED";
    const updated = updatedDate ? createdFormat_II(updatedDate) : "--";

    const disabledStyle = isDeleted
        ? "opacity-50 grayscale pointer-events-none"
        : "";

    return `
    <div class="fee-card ${disabledStyle}
         bg-[#020617] border border-slate-800 rounded-2xl
         transition-all duration-300 ease-out
                 hover:border-gray-200
         flex flex-col overflow-hidden"
         data-id="${id}">

        <!-- VIEW MODE -->
        <div class="fee-view flex flex-col flex-1" id="view-${id}">
            <div class="p-5 flex flex-col gap-5 flex-1">
                <div class="flex justify-between">
                    <h4 class="text-sm font-semibold text-white">${type}</h4>
                    <span class="text-xs px-2 py-0.5 rounded-full
                        ${state === "APPLY"
                        ? "bg-emerald-900/40 text-emerald-400"
                        : "bg-gray-800 text-gray-400"}">
                        ${state}
                    </span>
                </div>

                <div class="text-center">
                    <span class="text-5xl font-bold text-white">${percent}%</span>
                </div>

                <div class="text-xs text-slate-400 border-t border-slate-800 pt-3">
                    <div class="flex justify-between">
                        <span>Created</span>
                        <span>${createdFormat_II(createdDate)}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Updated</span>
                        <span>${updated}</span>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-2 border-t border-slate-800">
                <button class="fee-btn-edit py-3 text-sky-400">Edit</button>
                <button class="fee-btn-disable py-3 text-rose-400"
                        data-id="${id}">
                    ${isDeleted ? "Active" : "Disable"}
                </button>
            </div>
        </div>

        <!-- EDIT MODE (INLINE – KHÔNG ABSOLUTE) -->
        <div class="fee-edit hidden flex flex-col flex-1 p-5 gap-4" id="edit-${id}">
            <div>
                <label class="text-xs text-slate-400 mb-1 block">Type</label>
                <input disabled value="${type}"
                       class="w-full bg-transparent border border-slate-700 px-3 py-2 text-white"/>
            </div>

            <div>
                <label class="text-xs text-slate-400 mb-1 block">Percent</label>
                <input name="percent" type="number" value="${percent}"
                       class="w-full px-3 py-2 border border-slate-700 text-white bg-transparent"/>
            </div>

            <div class="mt-auto grid grid-cols-2 gap-2 pt-4 border-t border-slate-800">
                <button class="btn-fee-save bg-blue-600 py-2 rounded-lg">
                    Confirm
                </button>
                <button class="fee-btn-cancel border border-slate-600 py-2 rounded-lg">
                    Cancel
                </button>
            </div>
        </div>
    </div>
    `;
}


function bindFeeEvents(auth, container) {

    // EDIT
    $(document).on("click", ".fee-btn-edit", function () {
        const $card = $(this).closest(".fee-card");
        const id = $card.data("id");

        $card.find(`#view-${id}`).addClass("hidden");
        $card.find(`#edit-${id}`).removeClass("hidden");
    });

    // CANCEL
    $(document).on("click", ".fee-btn-cancel", function () {
        const $card = $(this).closest(".fee-card");
        const id = $card.data("id");

        $card.find(`#edit-${id}`).addClass("hidden");
        $card.find(`#view-${id}`).removeClass("hidden");
    });

    // SAVE
    $(document).on("click", ".btn-fee-save", async function () {
        const $card = $(this).closest(".fee-card");
        const id = $card.data("id");
        const percent = Number($card.find("input[name=percent]").val());

        if (isNaN(percent)) return;

        const res = await feeService.feeUpdate(auth, id, percent);
        if (!res?.ok) return;

        const { data } = await res.json();
        $card.replaceWith(renderData(auth, data));
    });

    // DISABLE / ACTIVE
    $(document).on("click", ".fee-btn-disable", async function () {
        const id = $(this).data("id");
        const res = await feeService.delete(auth, id);
        if (!res?.ok) return;

        await getAllFee(auth, container);
    });
}

async function feeCreate(auth, container) {
    $(document)
        .off("submit", "#fee-add-form")
        .on("submit", "#fee-add-form", async function (e) {
            e.preventDefault();

            const $form = $(this);

            const body = {};
            $form.serializeArray().forEach(({name, value}) => {
                body[name] = name === "percent" ? Number(value) : value;
            });

            const response = await feeService.feeAdd(auth, body);

            const result = await response.json();
            const {isSuccess, data, errorMessage} = result;

            if (!isSuccess) {
                $("#fee-error").text(`(*) ${errorMessage}`);
                return;
            }

            if (isSuccess && data) {
                const html = renderData(auth, data);
                container.prepend(html);
                $form[0].reset();
                $("#fee-error").text("")
            }
        });
}

