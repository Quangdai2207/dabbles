import {htmlPath} from "../../../../pagesPath/paths.js";
import dashboardService from "../../../services/dashboard/dashboardService.js";
import {getAuthentication} from "../../../../utils/Token.js";

export default async function MAIN_DASHBOARD(path, mainContent) {
    const page = htmlPath.dashboard.layout.mainPage;
    const auth = getAuthentication();

    await $.get(page).done(html => {
        mainContent.empty().html(html);

        getValueTotal(auth);
    })
        .fail(html => {
            console.error("Can not find html main dashboard ", html);
            mainContent.empty().html("<div>Can not find html main dashboard<div>");
        })

    document.title = "Admin - Dashboard Overview";
}

async function getTotalUser(auth) {
    const resUser = await dashboardService.getTotalUsers(auth);
    const userTotal = await resUser.json();
    $("#dashboard-user-total").text(userTotal.data);
}
async function getTotaImage(auth) {
    const resUser = await dashboardService.getTotalImages(auth);
    const userTotal = await resUser.json();
    $("#dashboard-image-total").text(userTotal.data);
}
async function getTotalPayment(auth) {
    const resUser = await dashboardService.getTotalPayments(auth);
    const userTotal = await resUser.json();
    $("#dashboard-payment-total").text(userTotal.data);
}
async function getTotalCate(auth) {
    const resUser = await dashboardService.getTotalCategories(auth);
    const userTotal = await resUser.json();
    $("#dashboard-cate-total").text(userTotal.data);
}

async function getValueTotal(auth) {
    await getTotalUser(auth);
    await getTotaImage(auth);
    await getTotalPayment(auth);
    await getTotalCate(auth);
}