"use strict"

/**
 *     <h4 style="font-family: 'roboto'; color: white">
 *         CLASS and CLASS BUILDER
 *     </h4>
 *     <p style="color: white; font-family: 'roboto'">
 *         Class builder, you can use builder() to init Object OR init normally with new Object OOP
 *     </p>
 *     <hr />
 *     <h5 style="color: white; font-weight: 900">USAGE:</h5>
 *     <ul style="color: white">
 *        Init new object by using <strong style="font-style: italic; color: #eeee">builder()</strong> to build a class object.
 *        <pre>
 *            const object = Object.builder()
 *                             .setProp(param)
 *                             .setProp2(param)
 *                             .build()
 *
 *            build() to return the instance itself, until builder() return the instance class builder's.
 *        </pre>
 *     </ul>
 * **/
class RequestLogin {
    constructor(email = "", password = "") {
        this.email = String(email);
        this.password = String(password);
    }

    static builder() {
        return new RequestLoginBuilder()
    }

    setEmail(email) {
        this.email = String(email);
        return this;
    }

    setPassword(password) {
        this.password = password;
        return this;
    }

    returnBody() {
        return JSON.stringify({
            email: this.email,
            password: this.password,
        })
    }
}

class RequestLoginBuilder {
    #email;
    #password;

    constructor() {
    }

    setEmail(email) {
        this.#email = String(email);
        return this;
    }

    setPassword(password) {
        this.#password = String(password);
        return this;
    }

    build() {
        return new RequestLogin(this.#email, this.#password);
    }
}

export default RequestLogin;








