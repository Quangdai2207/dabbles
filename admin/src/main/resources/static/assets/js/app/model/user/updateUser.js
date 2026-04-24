class UpdateUser {
    constructor(
        username = "",
        firstName = "",
        lastName = "",
        phone = "",
        dateOfBirth = "",
    ) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.dateOfBirth = dateOfBirth;
    }

    static builder() {
        return new UpdateUserBuilder();
    }

    setUsername(username = "") {
        this.username = String(username);
        return this;
    }

    setFirstName(firstName = "") {
        this.firstName = String(firstName);
        return this;
    }

    setLastName(lastName = "") {
        this.lastName = String(lastName);
        return this;
    }

    setPhone(phone = "") {
        this.phone = String(phone);
        return this;
    }

    setDateOfBirth(dateOfBirth = "") {
        this.dateOfBirth = String(dateOfBirth);
        return this;
    }
}

class UpdateUserBuilder {
    #username = "";
    #firstName = "";
    #lastName = "";
    #phone = "";
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

    setPhone(phone = "") {
        this.#phone = String(phone);
        return this;
    }

    setDateOfBirth(dateOfBirth = "") {
        this.#dateOfBirth = String(dateOfBirth);
        return this;
    }

    build() {
        return new UpdateUser(
            this.#username,
            this.#firstName,
            this.#lastName,
            this.#phone,
            this.#dateOfBirth,
        );
    }
}

export default UpdateUser;
