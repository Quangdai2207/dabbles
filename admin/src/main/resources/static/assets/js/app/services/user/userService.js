import {BaseURL} from "../../baseUrl/baseURL.js";
import Parameter from "../../../utils/required.js";
import {dateFormat} from "../../../utils/formatPattern.js";

const UserService = {
    userUrl: BaseURL.user,
    userProxy: BaseURL.userProxy,
    required: Parameter.required,

    async getAll(authentication = "") {
        if (!this.required(authentication, "string")) {
            console.error("Param authentication must be instance String");
            throw Error("");
        }

        return await fetch(`${this.userUrl}/get-all-users`, {
            method: "GET",
            headers: {
                "accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authentication}`
            }
        })
    },

    async getDetails(authentication = "", id = "") {
        if (!this.required(authentication, "string")) {
            console.error("Param authentication must be instance String");
            throw Error("");
        }

        return await fetch(`${this.userUrl}/get-user-by-id/${id}`, {
            method: "GET",
            headers: {
                "accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authentication}`
            }
        })
    },

    async update(payload, authentication) {
        if (!this.required(authentication, "string")) {
            console.error("Param authentication must be instance String");
            throw Error("");
        }

        let formData = new FormData();
        formData.append("username", payload.username);
        formData.append("firstName", payload.firstName);
        formData.append("lastName", payload.lastName);
        formData.append("phone", payload.phone);
        formData.append("dateOfBirth", dateFormat(payload.dob));

        if (payload.avatarFile instanceof File)
            formData.append("avatar", payload.avatarFile)

        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        return await fetch(`${this.userUrl}/update`, {
            method: "PUT",
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${authentication}`,
            },
            body: formData,
        });
    },

    async changePassword(formData = {}, authentication) {
        if (!this.required(authentication, "string")) {
            console.error("Param authentication must be instance String");
            throw Error("");
        };

        return await fetch(`${this.userUrl}/change-password`, {
            method: "PUT",
            headers: {
                "accept": "application/json",
                "Content-Type" : "application/json",
                "Authorization": `Bearer ${authentication}`
            },
            body: JSON.stringify(formData)
        });
    },

    async getUserStatus(email = "") {
        if (!this.required(email, "string")) {
            console.error("email must be instance String");
            throw Error("");
        }

        return await fetch(`${this.userProxy}/state/${email}`, {
            method: "GET",
            headers: {
                "accept": "application/json",
            },
        });
    }
}

export default UserService;