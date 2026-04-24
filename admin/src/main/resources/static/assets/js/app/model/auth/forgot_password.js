class ForgotPassword {
    constructor(email = "") {
        this.email = email;
    }

    static builder() {
        return new ForgotPasswordBuilder()
    }

    setEmail(email) {
        this.email = String(email);
    }

    returnBody() {
        return JSON.stringify({
            email: this.email,
        })
    }

}

class ForgotPasswordBuilder {
    #email;

    constructor() {
    }

    setEmail(email) {
        this.#email = String(email);
        return this;
    }

    build() {
        return new ForgotPassword(this.#email);
    }
}

export default ForgotPassword;