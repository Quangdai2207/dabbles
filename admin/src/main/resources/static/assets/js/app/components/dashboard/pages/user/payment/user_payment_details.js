import {htmlPath} from "../../../../../../pagesPath/paths.js";
import {USER_PAYMENT} from "./user_payment.js";
import paymentService from "../../../../../services/payment/paymentService.js";
import {createdFormat_II} from "../../../../../../utils/formatPattern.js";
import imageService from "../../../../../services/image/imageService.js";
import subService from "../../../../../services/sub/subService.js";

export default async function USER_PAYMENT_DETAILS(auth, mainContent, paymentId, userId, type) {
    const page = htmlPath.dashboard.feature.user.user_payment_details;

    if (!mainContent) return

    await $.get(page).done(html => {
        mainContent.empty().html(html)
        $("#btn-back-user-payment").on("click", async function () {
            await USER_PAYMENT(mainContent, userId, type)
        })

        //Render data with paymentId details
        getPaymentId(auth, paymentId);
        toggleContentReference();

        document.title = "Admin - User payment details"
    }).fail(html => {
        console.error("Cannot load user payment details page >>>", e);
        mainContent
            .empty()
            .html("<div class='text-red-400'>Cannot load user payment details page</div>");
    })
}

async function getPaymentId(auth, paymentId) {
    try {
        const response = await paymentService.getPaymentById(auth, paymentId);
        if (!response || response.status >= 400) {
            console.error("Data was not found");
            return;
        }

        const {isSuccess, data} = await response.json();
        if (!isSuccess) return;
        if (isSuccess && !data) return;

        await renderPaymentDetails(auth, data);

    } catch (e) {
        console.error("Something went wrong >>> ", e);
    }
}

async function renderPaymentDetails(auth, data) {
    const {
        id, referenceId,
        type, amount, currency, updateDate,
        paymentMethod, paymentStatus, paymentDate
    } = data;

    const $status = $("#payment-status");
    $status.removeClass(
        "bg-gray-500/10 text-gray-400 " +
        "bg-green-500/10 text-green-400 " +
        "bg-amber-500/10 text-amber-400 " +
        "bg-red-500/10 text-red-400"
    );

    // Payment status
    switch (paymentStatus) {
        case 0:
            $status.text("FAILED").addClass("bg-gray-500/10 text-gray-400");
            break;
        case 1:
            $status.text("PENDING").addClass("bg-amber-500/10 text-amber-400");
            break;
        case 2:
            $status.text("SUCCESS").addClass("bg-green-500/10 text-green-400");
            break;
        case 3:
            $status.text("CANCEL").addClass("bg-red-500/10 text-red-400");
            break;
    }

    if (paymentMethod === 1) $("#payment-method").addClass("bg-blue-500/10 text-blue-400").text("Paypal");
    else if (paymentMethod === 2) $("#payment-method").addClass("bg-red-500/10 text-red-400").text("VNPay");
    else if (paymentMethod === 3) $("#payment-method").addClass("bg-pink-500/10 text-pink-400").text("MoMo");

    $("#payment-date").text(createdFormat_II(paymentDate));
    $("#payment-amount").text(amount);
    $("#payment-currency").text(currency);
    $("#payment-type").text(type);
    $("#user-payment-details").text(id)

    // Tracking process payment's:
    $("#payment-timeline-completed").text(createdFormat_II(updateDate));

    if (String(type) === "DEPOSIT") {
        $("#payment-reference-object-value").text("PRIVATE WALLET");
        return;
    }

    let refObj = {};
    if (String(type) === "PURCHASE") {
        $("#payment-reference-object-value").text("IMAGE");
        if (referenceId) {
            const response = await imageService.getImageById(auth, referenceId);
            if (response && response.status >= 400) return;
            refObj = await response.json();
        }
    } else if (String(type) === "SUBSCRIBE") {
        $("#payment-reference-object-value").text("SUBSCRIBE PLAN");
        const response = await subService.getSubPlanId(referenceId);
        if (response && response.status >= 400) return;
        refObj = await response.json();
    }
    toggleContentReference(type, refObj);
}

function toggleContentReference(type, data) {
    const btn = $('#payment-reference-object');
    const refWrapper = $('#reference-wrapper');
    const paymentScope = $('#payment-scope');

    let isOpen = false;
    btn.off('click');

    if (type === "DEPOSIT") return;

    if (type === "PURCHASE") {
        const {id, creator, imageUrls} = data?.data || {};
        console.log(creator);

        const image =
            imageUrls.original == null ||  imageUrls.original === ""
                ? "https://placehold.co/160"
                : /^https?:\/\//.test( imageUrls.original)
                    ? imageUrls.original
                    : `http://localhost:3366/${ imageUrls.original}`;

        btn.on('click', () => {
            drawerToggle(isOpen = !isOpen, refWrapper, paymentScope)
            if (isOpen) {
                $("#ref-panel-image").removeClass("hidden")
                $('#payment-reference-type').text(id || '--');
                $('#payment-reference-content').prop('src', image);
                $('#ref-link-image').prop('href', id ? `/admin/image/details/${id}` : '#');
                $('#payment-reference-uploader').prop("href", "/admin/users/details/" + creator.id).text(creator.username || "");
            } else $("#ref-panel-image").addClass("hidden")
        });
        return;
    }

    if (type === "SUBSCRIBE") {
        const {id, description, durationDays, createdDate} = data.data;
        btn.on('click', () => {
            drawerToggle(isOpen = !isOpen, refWrapper, paymentScope)
            if (isOpen) {
                $("#ref-panel-sub").removeClass("hidden")
                $("#payment-reference-sub-id").text(id);
                $("#payment-sub-desc").text(description);
                $("#payment-reference-duration").text(durationDays + " days ");
                $("#payment-sub-renew-date").text(createdFormat_II(createdDate).split(" ")[0]);
                $("#payment-sub-renew-time").text(createdFormat_II(createdDate).split(" ")[1]);
            } else $("#ref-panel-sub").addClass("hidden")
        });
    }
}

function drawerToggle(isOpen, refWrapper, paymentScope) {
    if (isOpen) {
        refWrapper.removeClass('translate-x-full opacity-0 pointer-events-none');
        paymentScope.removeClass('col-span-12').addClass('col-span-8');
    } else {
        refWrapper.addClass('translate-x-full opacity-0 pointer-events-none');
        paymentScope.removeClass('col-span-8').addClass('col-span-12');
    }
}

