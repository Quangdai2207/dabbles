import {htmlPath} from "../../../../../pagesPath/paths.js";
import authContext from "../../../../hooks/context/authContext.js";
import imageService from "../../../../services/image/imageService.js";
import NOTFOUND from "../../../../pages/notfound.js";
import {formatNumber, formatSize} from "../../../../../utils/formatPattern.js";
import {socketContext} from "../../../../hooks/context/socketContext.js";
import userService from "../../../../services/user/userService.js";

export default async function IMAGE_DETAILS(path, mainContent, params) {
    const page = htmlPath.dashboard.feature.image.image_details;
    const id = params?.slug;
    const authentication = authContext.getContext().token;
    if (!authentication) {
        location.href = "/auth/login";
        return;
    }

    if (!id) {
        NOTFOUND(path, mainContent);
        return;
    }

    const response = await imageService.getImageById(authentication, id);

    if (!response?.ok || response.status >= 401) {
        location.href = "/auth/login";
        return;
    }

    if (response.status === 400) {
        NOTFOUND(path, mainContent);
        return;
    }

    if (mainContent.length === 0) {
        console.log("Not found main content");
        return;
    }

    await $.get(page).done(async html => {
        mainContent.empty().html(html);
        switchButtons();

        const {isSuccess, data} = await response.json();
        if (isSuccess) {
            await renderData(data);
        }
        listeningEvent();
    })
        .fail(html => {
            console.error("Can not find html main dashboard ", html);
            mainContent.empty().html("<div>Can not find html main dashboard<div>");
        })

    document.title = "Admin - Images Details";
    history.pushState({}, "", path)
}

function listeningEvent() {
    socketContext.subscribe((userId, isOnline) => {
        const status = $("#image-details-creator-status");
        if (isOnline) status.removeClass("bg-gray-500 ring-2 ring-gray-900").addClass("bg-green-500 ring-2 ring-gray-900");
        else status.removeClass(  "bg-green-500 ring-2 ring-gray-900").addClass("bg-gray-500 ring-2 ring-gray-900");
    });
}

function getStatusUserOnReload(slug) {
    const status = $("#image-details-creator-status");
    userService.getUserStatus(slug)
        .then(async res => {
            const {event} = await res.json();
            console.log(event);
            if (event === "CONNECTED") status.removeClass("bg-gray-500 ring-2 ring-gray-900").addClass("bg-green-500 ring-2 ring-gray-900");
            else status.removeClass(  "bg-green-500 ring-2 ring-gray-900").addClass("bg-gray-500 ring-2 ring-gray-900");
        })
        .catch(e => console.error(e));
}

async function renderData(data) {
    const {
        id, creator, description, width, height,
        categories, filesize, imageUrls, likeCount, createdDate,
        commentCount, price,
    } = data;

    const isPublic = data.public ? "Public" : "Private";
    const {avatar, name, email} = creator;
    getStatusUserOnReload(email)
    const avatarUrl = avatar ? avatar : "https://demofree.sirv.com/nope-not-here.jpg";

    //** Attributes imageUrl
    const {original, w236, w474, w736, w1080} = imageUrls;

    // const originalUrl = `http://localhost:3366/${original}`;
    // const w236Url = `http://localhost:3366/${w236}`;
    // const w474lUrl = `http://localhost:3366/${w474}`;
    // const w736Url = `http://localhost:3366/${w736}`;
    // const w1080Url = `http://localhost:3366/${w1080}`;
    // console.log(w1080Url);
    const size = formatSize(Number(filesize));
    const createdDateSplit = new Date(createdDate).toLocaleString().split(" ");

    //** Render DOM
    $("#image-details-comment").text(commentCount);
    $("#image-details-like").text(likeCount);
    $("#image-details-created-time").text(createdDateSplit[0]);
    $("#image-details-created-date").text(createdDateSplit[1]);
    $("#image-details-creator-avatar").attr("src", avatarUrl);
    $("#image-details-creator-name").text(name);
    $("#image-details-price").text(`$ ${formatNumber(price)}`);
    $("#image-details-desc").text(description);
    $("#image-details-id").text(id);
    $("#image-details-resolution").text(`${width} x ${height}`);
    $("#image-details-size").text(size);

    if (!data.public) {
        $("#image-details-status")
            .removeClass("bg-green-500/20 text-green-400")
            .addClass("bg-gray-500/20 text-gray-400")
            .text(isPublic);
    } else {
        $("#image-details-status")
            .removeClass("bg-gray-500/20 text-gray-400")
            .addClass("bg-green-500/20 text-green-400")
            .text(isPublic);
    }

    if (Array.isArray(categories) && categories.length > 0) {
        categories.forEach(cate => {
            $("#image-details-categories").append(`
                <p class="px-3 py-1 bg-gray-500 text-gray-300 
                rounded-xl border border-gray-400 font-semibold text-xs">● ${cate.name}</p>
            `)
        })
    }

    $("#image-details-logs").text("Data Not Yet")

    await previewImage({
        original: original,
        w236: w236,
        w474: w474,
        w736: w736,
        w1080: w1080
    });
}

//** Switch button UI image details
function switchButtons() {
    $(document).on("click", ".image-details-tab-btn", function () {
        $(".tab-btn").removeClass("active text-white").addClass("text-gray-300");
        $(this).addClass("active text-white");

        const tab = $(this).data("tab");
        $(".tab-content").addClass("hidden");
        $(`#tab-${tab}`).removeClass("hidden");
    });
}

async function previewImage(imageUrls = {}) {
    const {original, w236, w474, w736, w1080} = imageUrls;

    if (!original) {
        console.warn('ImageUrls is null');
        return;
    }
    $('#image-details-original').attr('src', original);
    $('#image-details-w236').attr('src', w236 || original + '?w=236');
    $('#image-details-w474').attr('src', w474 || original + '?w=474');
    $('#image-details-w736').attr('src', w736 || original + '?w=736');
    $('#image-details-w1080').attr('src', w1080 || original + '?w=1080');

    $('#image-details-current-size').attr('src', original);
    $('#current-size-label').text('Original');

    $('.group.cursor-pointer img').removeClass('border-white').addClass('border-gray-700');
    $('.group.cursor-pointer p').removeClass('text-white font-medium').addClass('text-gray-500');

    const $originalThumb = $('.group.cursor-pointer[data-size="original"]');
    $originalThumb.addClass('ring-2 ring-blue-500');
    $originalThumb.find('img').removeClass('border-gray-700').addClass('border-white');
    $originalThumb.find('p').removeClass('text-gray-500').addClass('text-white font-medium');

    $('.group.cursor-pointer').off('click').on('click', function () {
        const $thumb = $(this);
        const size = $thumb.data('size');
        const label = $thumb.data('label');

        const newSrc = $thumb.find('img').attr('src');

        $('#image-details-current-size')
            .fadeOut(200, function () {
                $(this).attr('src', newSrc).fadeIn(300);
            });

        $('#current-size-label').text(label);

        $('.group.cursor-pointer').removeClass('ring-2 ring-blue-500');
        $('.group.cursor-pointer img').removeClass('border-white').addClass('border-gray-700');
        $('.group.cursor-pointer p').removeClass('text-white font-medium').addClass('text-gray-500');

        $thumb.find('img').removeClass('border-gray-700').addClass('border-white');
        $thumb.find('p').removeClass('text-gray-500').addClass('text-white font-medium');
    });
}

