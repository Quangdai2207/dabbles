class RequestRegister {
    #username;
    #email;
    #password;
    #gender;
    #dob;

    constructor(username = "", email = "", password = "", gender = 0, dob = null) {
        this.#username = String(username);
        this.#email = String(email);
        this.#password = String(password);
        this.#gender = Number(gender);
        this.#dob = dob ? new Date(dob) : null;
    }

    static builder() {
        return new RequestRegisterBuilder();
    }

    setUsername = (username) => {
        this.#username = String(username);
        return this;
    }

    getUsername = () => this.#username;

    setEmail(email) {
        this.#email = String(email);
        return this;
    }

    getEmail = () => this.#email;

    static setPassword = (password) => {
        this.#password = String(password);
        return this;
    }

    getPassword = () => this.#password;

    setGender = (gender) => {
        this.#gender = gender
        return this;
    }

    getGender = () => this.#gender;

    setDob = (dob) => {
        this.#dob = dob;
        return this;
    }

    getDob = () => this.#dob;

    toJson() {
        return JSON.stringify({
            username: this.#username,
            email: this.#email,
            password: this.#password,
            gender: this.#gender,
            dob: this.#dob
        })
    }
}

class RequestRegisterBuilder {
    constructor() {
        this.username = "";
        this.email = "";
        this.password = "";
        this.gender = "";
        this.dob = null;
    }

    static setUsername = (username) => {
        this.username = String(username);
        return this;
    }

    static setEmail(email) {
        this.email = String(email);
        return this;
    }

    static setPassword = (password) => {
        this.password = String(password);
        return this;
    }

    static setGender = (gender) => {
        this.gender = gender
        return this;
    }

    static setDob = (dob) => {
        this.dob = dob;
        return this;
    }

    build() {
        return new RequestRegister(
            this.username,
            this.email,
            this.password,
            this.gender,
            this.dob
        );
    }
}

export default RequestRegister;