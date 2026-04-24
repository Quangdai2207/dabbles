"use strict"

import {BaseURL} from "../../baseUrl/baseURL.js";
import Parameter from "../../../utils/required.js";
import RequestLogin from "../../model/auth/login.js";
import ForgotPassword from "../../model/auth/forgot_password.js";
import ResetPassword from "../../model/auth/reset_password.js";

class AuthService {
    #authUrl;
    #authProxyUrl;

    constructor() {
        this.#authUrl = `${BaseURL.auth}`;
        this.#authProxyUrl = `${BaseURL.authProxy}`;
        this.required = Parameter.required;
    }

    async login(requestLogin = {}, captchaToken) {
        //** Check params matching data type => requestLogin must be RequestLogin Object
        if (!this.required(requestLogin, RequestLogin)) {
            console.error("requestLogin must be instance of RequestLogin");
            throw new Error("")
        }

        //** Check params matching data type => captcha token must be String
        if (!this.required(captchaToken, "string")) {
            console.error("CaptchaToken can not null OR empty.");
            throw new Error("")
        }

        return await fetch(`${this.#authProxyUrl}/login`, {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Content-Type": "application/json",
                "X-Captcha-Token": captchaToken,
            },
            body: JSON.stringify(requestLogin)
        });
    }

    // async logout(email = "") {
    //     if (!this.required(email, "string")) {
    //         console.error("Email can not null OR empty.");
    //         throw new Error("Email can not null or empty.")
    //     }
    //     return await fetch(`${this.#authProxyUrl}/logout`, {
    //         method: "POST",
    //         headers: {
    //             "accept": "application/json",
    //             "X-User-Email": email,
    //         },
    //     });
    // }

    async logout(
        email = String(""),
        authorization = String("")
    ) {
        if (!this.required(email, "string")) {
            console.error("Email can not null OR empty.");
            throw new Error("Email can not null or empty.")
        }

        if (!this.required(authorization, "string")) {
            console.error("Authorization can not null OR empty.");
            throw new Error("Authorization can not null or empty.")
        }
        return await fetch(`${this.#authProxyUrl}/logout`, {
            method: "POST",
            headers: {
                "accept": "application/json",
                "X-User-Email": email,
                "Authorization": `Bearer ${authorization}`
            },
        });
    }

    async forgot_password(forgotPassword = {}) {
        if (!this.required(forgotPassword, ForgotPassword)) {
            console.error("Format email is not valid.");
            throw new Error("")
        }

        return await fetch(`${this.#authUrl}/forgot-password`, {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(forgotPassword)
        });
    }

    async reset_password(resetPassword = {}) {
        if (!this.required(resetPassword, ResetPassword)) {
            console.error("Format resetPassword must be ResetPassword instance.");
            throw new Error("")
        }

        return await fetch(`${this.#authUrl}/reset-password`, {
            method: "PUT",
            headers: {
                "accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(resetPassword)
        });
    }

    async profile(token = "") {
        if (!this.required(token, "string")) {
            console.error("Authentication not yet, this feature waiting authorize.");
            throw new Error("Authentication not yet, this feature waiting authorize.");
        }

        return await fetch(`${this.#authUrl}/profile`, {
            method: "GET",
            headers: {
                "accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${String(token)}`
            },
        });
    }
}

const authService = new AuthService();
export default authService;























