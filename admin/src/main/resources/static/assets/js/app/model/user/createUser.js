class CreateUser {
    constructor(
        username = "",
        firstName = "",
        lastName = "",
        email = "",
        phone = "",
        roleId = "",
        password = "",
        passwordConfirm = "",
        dateOfBirth = "",
    ) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.roleId = roleId;
        this.password = password;
        this.passwordConfirm = passwordConfirm;
        this.dateOfBirth = dateOfBirth;
    }

    static builder() {
        return new UserBuilder();
    }

    setUsername(username = "") {
        this.username = String(username);
        return this;
    }

    setFirstName(firstName = "") {
        this.firstName = String(firstName);
    }

    setLastName(lastName = "") {
        this.lastName = String(lastName);
    }

    setEmail(email = "") {
        this.email = String(email)
    }

    setPhone(phone = "") {
        this.phone = String(phone);
    }

    setRoleId(roleId = "") {
        this.roleId = String(roleId)
    }

    setPassword(password = "") {
        this.password = String(password);
    }

    setPasswordConfirm(passwordConfirm = "") {
        this.passwordConfirm = String(passwordConfirm);
    }

    setDateOfBirth(dateOfBirth = "") {
        this.dateOfBirth = String(dateOfBirth);
    }
}

class UserBuilder {
    #username = "";
    #firstName = "";
    #lastName = "";
    #email = "";
    #phone = "";
    #roleId = "";
    #password = "";
    #passwordConfirm = "";
    #dateOfBirth = "";

    constructor() {
    }

    setUsername(username = "") {
        this.#username = String(username);
        return this;
    }

    setFirstName(firstName = "") {
        this.#firstName = String(firstName);
        return this;
    }

    setLastName(lastName = "") {
        this.#lastName = String(lastName);
        return this;
    }

    setEmail(email = "") {
        this.#email = String(email);
        return this;
    }

    setPhone(phone = "") {
        this.#phone = String(phone);
        return this;
    }

    setRoleId(roleId = "") {
        this.#roleId = String(roleId);
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

    setDateOfBirth(dateOfBirth = "") {
        this.#dateOfBirth = String(dateOfBirth);
        return this;
    }

    build() {
        return new CreateUser(
            this.#username,
            this.#firstName,
            this.#lastName,
            this.#email,
            this.#phone,
            this.#roleId,
            this.#password,
            this.#passwordConfirm,
            this.#dateOfBirth
        );
    }
}

export default CreateUser;
