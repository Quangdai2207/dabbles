class ResetPassword {
    constructor(token = "", password = "", passwordConfirm = "") {
        this.token = String(token);
        this.password = String(password);
        this.passwordConfirm = String(passwordConfirm);
    }

    static builder() {
        return new ResetPasswordConfirmBuilder()
    }

    setToken(token = "") {
        this.token = String(token);
        return this;
    }

    setPassword(password = "") {
        this.password = String(password);
        return this;
    }

    setPasswordConfirm(passwordConfirm = "") {
        this.passwordConfirm = String(passwordConfirm);
        return this;
    }

    returnBody() {
        return JSON.stringify({
            token: this.token,
            password: this.password,
            passwordConfirm: this.passwordConfirm
        })
    }

}

class ResetPasswordConfirmBuilder {
    #token;
    #password;
    #passwordConfirm;

    constructor(token = "", password = "", passwordConfirm = "") {
        this.#token = String(token);
        this.#password = String(password);
        this.#passwordConfirm = String(passwordConfirm);
    }

    static builder() {
        return new ResetPasswordConfirmBuilder()
    }

    setToken(token = "") {
        this.#token = String(token);
        return this;
    }

    setPassword(password = "") {
        this.#password = String(password);
        return this;
    }

    setPasswordConfirm(passwordConfirm = "") {
        this.#passwordConfirm = String(passwordConfirm);
        return this;
    }

    build() {
        return new ResetPassword(this.#token, this.#password, this.#passwordConfirm)
    }
}

export default ResetPassword;