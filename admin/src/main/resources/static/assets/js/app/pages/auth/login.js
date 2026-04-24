import {htmlPath} from "../../../pagesPath/paths.js";
import authService from "../../services/auth/AuthService.js";
import RequestLogin from "../../model/auth/login.js";
import {parseToken, setToken} from "../../../utils/Token.js";
import DASHBOARD from "../../components/dashboard/dashboard.js";
import authContext from "../../hooks/context/authContext.js";
import reloadCaptcha from "../../../utils/captcha.js";
import PORTAL from "../../components/portal/portal.js";

export default function LOGIN(path, mainContent) {
    const login = htmlPath.auth.login;

    $.get(login)
        .done(html => {
            //** Render UI Login first
            mainContent.empty().html(html)

            //** After render, check the Captcha Token:
            let captchaToken = "";
            //** Handle Turnstile callback Token, Token auto generate within Callback FN onTurnstile()
            window.onTurnstileVerify = function (token) {
                if (!token) location.reload();
                captchaToken = token;
            }

            window.onTurnstileExpire = window.onTurnstileError = function () {
                captchaToken = "";
                console.warn("Captcha expired or error, token cleared");
            };

            window.onTurnstileError = function () {
                captchaToken = "";
                console.error("It's time went wrong.");
            };

            const $form_login = $("#form-login");
            if (!$form_login) return;

            $form_login.on("submit", function (e) {
                e.preventDefault();
                //** Check CaptchaToken before get formDate to submit
                if (!captchaToken || captchaToken.trim() === "") {
                    $("#login-error").removeClass("hidden")
                        .text("Click verify you're not robot");
                    return;
                }

                //** Get input value from formData
                const formData = $(this).serializeArray();
                const data = {};
                formData.forEach(field => {
                    data[field.name] = field.value
                })

                const requestLogin = RequestLogin.builder()
                    .setEmail(data.email)
                    .setPassword(data.password)
                    .build();

                //** Handle Login
                handleLogin(requestLogin, captchaToken)
            })
        })
        .fail(html => {
            console.error("Can not find login.html in the path ", html);
            mainContent.empty().html("<h4>Can not find Login page<h4>");
        })

    document.title = "Account - Login";
}

//** Handle Login main function:
function handleLogin(requestLogin, captchaToken) {
    $("#btn-login").prop("disabled", true).text("Processing ...");

    authService.login(requestLogin, captchaToken)
        .then(async (res) => {
            if (res !== null && res.ok) {
                const data = await res.json();
                const {isSuccess, accountId, token, expires, errorMessage} = data
                console.log(data);
                if (!isSuccess) {
                    //** Reload captcha Token if login fail
                    reloadCaptcha();
                    captchaToken = "";
                    $('#btn-login').prop("disabled", false).text("Sign in");
                    $("#login-error").removeClass("hidden")
                        .empty()
                        .text(errorMessage);
                    return;
                }

                if (isSuccess && isPermission(data.token)) {
                    $('#btn-login').prop("disabled", false).text("Sign in");
                    redirect();
                } else if (isSuccess) {
                    //** If login successful and account is administrator, to accept
                    $("#login-error").addClass("hidden");
                    //** Gui mesage realtime khi dang nhap thanh cong
                    switchLayoutContent(token, expires, accountId);

                    captchaToken = ""
                }
            } else {
                reloadCaptcha();
                captchaToken = "";
                $("#btn-login").prop("disabled", false).text("Sign in");
                $("#login-error").removeClass("hidden")
                    .empty()
                    .text("Something went wrong.");
            }
        })
        .catch(e => {
            console.error("Error message >> ", e);
            reloadCaptcha();
            captchaToken = "";
            $("#btn-login").prop("disabled", false).text("Sign in");
            $("#login-error").removeClass("hidden")
                .empty()
                .text("Something went wrong.");
        });
}

function switchLayoutContent(token, expires, identity) {
    const payload = parseToken(token);
    const role = payload.role;
    let isRole = "";

    const isSetCookie = setToken(token, expires);
    if (isSetCookie) {
        switch (role) {
            case "SUPERADMIN":
                setContext(payload, token, identity)
                isRole = role;
                DASHBOARD(location.pathname, $('#main-content'))
                // location.href = "/admin/dashboard"
                break;
            case "ADMIN":
                isRole = role;
                setContext(payload, token, identity)
                PORTAL(location.pathname, $('#main-content'));
                // location.href = "/account/portal";
                break;
            default:
                return;
        }
    } else {
        console.error("Something went wrong...");
    }
}

//** Set data context
function setContext(payload, auth, identity) {
    const data = {
        email: payload.sub,
        role: payload.role,
        token: auth,
        id: identity
    };
    authContext.setData(data)
}

function isPermission(token) {
    const authentication = parseToken(token).role;
    return authentication === "USER";
}

function redirect(timer = 3) {
    $("#login-error")
        .removeClass("hidden")
        .text(`Your Account denied access permission (${timer}s)`);
    let interval = setInterval(() => {
        timer--;

        $("#login-error").text(`Your Account denied access permission (${timer}s)`);

        if (timer <= 0) {
            clearInterval(interval);
            location.href = "http://localhost:3000"; // redirect USERs UI
        }
    }, 1000);
}
