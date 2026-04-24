import {htmlPath} from "../../../pagesPath/paths.js";
import ResetPassword from "../../model/auth/reset_password.js";
import authService from "../../services/auth/AuthService.js";
import resetContext from "../../hooks/context/resetContext.js";

export default function RESET_PASSWORD(path, mainContent, params) {
    const page = htmlPath.auth.reset_password;
    let slug = "";

    $.get(page)
        .done(resetPass => {
            mainContent.html(resetPass)

            const formSubmit = $("#reset-password-form")
            formSubmit.on("submit", function (e) {
                e.preventDefault();

                if (params === undefined || !params) {
                    resetContext.setMessage("You must validates email before reset password.")
                    location.href = "/auth/forgot-password"
                    return;
                }
                if (params) slug = params.slug;

                const formData = $(this).serializeArray();
                const data = {};

                formData.forEach(item => {
                    data[item.name] = item.value;
                });

                const resetPassword = ResetPassword.builder()
                    .setToken(slug)
                    .setPassword(data.password)
                    .setPasswordConfirm(data.passwordConfirm)
                    .build();

                handleResetPassword(resetPassword);
            })

        })
        .fail(resetPass => {
            console.error("Can not find login.html in the path ", resetPass);
            mainContent.empty().html("<h4>Can not find Login page<h4>");
        })

    document.title = "Account - Reset Password";
    if (window.history.length <= 1) history.replaceState(null, "", path);
    else history.pushState(null, "", path)
}

function handleResetPassword(resetPassword, codeResetPassword) {
    const newBgColor = "bg-gray-300"
    const oldBgColor = "bg-red-500 hover:bg-red-600"
    $("#btn-reset-password")
        .prop("disabled", true)
        .removeClass(oldBgColor).addClass(newBgColor)
        .text("Processing...")

    authService.reset_password(resetPassword)
        .then(async (res) => {
            const data = await res.json();
            const {isSuccess, errorMessage, message} = data;

            if (!isSuccess) {
                const errorMessageSplit = errorMessage.split(", ")
                $("#btn-reset-password")
                    .prop("disabled", false)
                    .removeClass(newBgColor).addClass(oldBgColor)
                    .text("Reset Password")
                if (errorMessageSplit.length > 1) {
                    $("#reset-error").empty()
                    errorMessageSplit.map(error => {
                        $("#reset-error").append(`
                            <ul class="list-disc list-outside pl-5 space-y-1" id="reset-error-list">
                                <li>${error}</li>
                            </ul>
                        `)
                    })
                } else {
                    $("#reset-error").empty().text(errorMessageSplit[0])
                }
                $("#reset-error").removeClass("hidden")
            } else {
                const html = `
                    <div id="reset-success-popup"
                         class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 hidden">
                    
                        <div class="bg-white rounded-xl shadow-xl px-6 py-7 w-[380px] animate-[zoomIn_.25s_ease]">
                    
                            <h2 class="text-xl font-bold text-gray-800 mb-3 text-center">
                                Password Reset Successful
                            </h2>
                    
                            <p class="text-gray-600 text-center mb-4 leading-relaxed">
                                Your password has been reset successfully.<br>
                                Redirecting to login page in
                                <span id="redirect-countdown" class="font-semibold text-blue-600">5</span>s...
                            </p>
                    
                            <!-- Buttons -->
                            <div class="flex items-center justify-center gap-3">
                    
                                <!-- Cancel -->
                                <button id="cancel-redirect"
                                        class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700
                                               hover:bg-gray-100 active:scale-95 transition-all">
                                    Cancel
                                </button>
                    
                                <!-- Redirect Now -->
                                <a id="go-login-now" href="/auth/login"
                                        class="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium
                                               hover:bg-blue-700 active:scale-95 transition-all">
                                    Go to Login
                                </a>
                            </div>
                    
                        </div>
                    </div>
                `
                $("#reset-password-form").empty().html(html);
                showResetSuccessPopup();
            }
        })
        .catch(e => {
            console.error("Reset password has an error: ", e);
        })
}

//** Redirect countdown
function showResetSuccessPopup() {
    $("#reset-success-popup").removeClass("hidden");

    let seconds = 5;
    const countdownText = $("#redirect-countdown");

    const intervalId = setInterval(() => {
        seconds--;
        countdownText.text(seconds);

        if (seconds <= 0) {
            clearInterval(intervalId);
            window.location.href = "/auth/login";
        }
    }, 1000);

    // Cancel redirect
    $("#cancel-redirect").on("click", function () {
        clearInterval(intervalId);
        $("#reset-success-popup").addClass("hidden");
    });

    // Go to login immediately
    $("#go-login-now").on("click", function () {
        clearInterval(intervalId);
        window.location.href = "/auth/login";
    });
}
