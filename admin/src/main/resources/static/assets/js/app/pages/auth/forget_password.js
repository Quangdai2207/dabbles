import {htmlPath} from "../../../pagesPath/paths.js";
import authService from "../../services/auth/AuthService.js";
import ForgotPassword from "../../model/auth/forgot_password.js";
import resetContext from "../../hooks/context/resetContext.js";
import reloadContext from "../../hooks/context/reloadContext.js";

export default function FORGET_PASSWORD(path, mainContent) {
    const page = htmlPath.auth.forget_password;

    $.get(page)
        .done(forgetPass => {
            mainContent.html(forgetPass)
            $(document).on("click", '#auth-forgot-back', function () {
                reloadContext.setIsReload(true)
            });

            const message = resetContext.getMessage()
            if (message !== "") {
                $("#forgot-error").removeClass("hidden").empty().text(`${message}`)
            }
            //** Using redirect  to reload Token Captcha
            $(document).on("click", "#auth-submit-forget", function (e) {
                e.preventDefault();

                const email = $("#email").val();
                const formForgotPassword = ForgotPassword.builder().setEmail(email).build();
                handleForgetPassword(formForgotPassword)
            })

        })
        .fail(forgetPass => {
            console.error("Can not find login.html in the path ", forgetPass);
            mainContent.empty().html("<h4>Can not find Login page<h4>");
        })

    document.title = "Account - Forget Password";
    if (window.history.length <= 1) history.replaceState(null, "", path);
    else history.pushState(null, "", path)
}

//** Handle main function forgot-password
function handleForgetPassword(formData) {
    const newBgColor = "bg-gray-300"
    const oldBgColor = "bg-red-500 hover:bg-red-600"
    $("#auth-submit-forget")
        .prop("disabled", true)
        .removeClass(oldBgColor).addClass(newBgColor)
        .text("Processing validate email...")
    authService.forgot_password(formData)
        .then(async (res) => {
            const response = await res.json();
            console.log(response);

            if (!response.isSuccess) {
                $("#forgot-error").removeClass("hidden").empty().text(`${response.errorMessage}`)
                $("#auth-submit-forget")
                    .prop("disabled", true)
                    .removeClass(newBgColor).addClass(oldBgColor)
                    .text("Send Reset Link")
                return;
            }

            const popUpHtml = `
                <div id="email-sent-popup"
                     class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div class="bg-white rounded-xl shadow-xl px-6 py-7 w-[380px] animate-[zoomIn_.25s_ease]">
                        <h2 class="text-xl font-bold text-gray-800 mb-3 text-center">
                            Email Sent Successfully
                        </h2>
                        <p class="text-gray-600 text-center mb-6 leading-relaxed">
                            A password reset link has been sent to:<br>
                            <span class="font-semibold text-blue-600">${formData.email}</span>
                        </p>               
                        <!-- Nút -->
                        <div class="flex items-center justify-center gap-3">
                            <!-- Close -->
                            <button id="close-email-popup"
                                    class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700
                                           hover:bg-gray-100 active:scale-95 transition-all">
                                Close
                            </button>
                            <!-- Go to Gmail -->
                            <a href="https://mail.google.com/mail"
                               target="_blank"
                               class="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium
                                      hover:bg-blue-700 active:scale-95 transition-all">
                                Open Gmail
                            </a>
                        </div>
                    </div>
                </div>
            `;

            $("#forgot-password-form").empty().html(popUpHtml)
        })
        .catch(async (e) => {
            console.error("Occurred an error with api forget-password >>> ", e);
        })
}