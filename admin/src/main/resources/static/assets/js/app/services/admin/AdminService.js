"use strict"

import {BaseURL} from "../../baseUrl/baseURL.js";
import Parameter from "../../../utils/required.js";
import CreateUser from "../../model/user/createUser.js";
import UpdateUser from "../../model/user/updateUser.js";

class AdminService {
    #adminUrl;

    constructor() {
        this.#adminUrl = BaseURL.admin;
        this.required = Parameter.required;
    }

    async createUser(createUser = {}, token) {
        if (!this.required(createUser, CreateUser)) {
            console.error("body must be instance CreateUser");
            throw Error("Body must instance CreateUser");
        }

        if (!this.required(token, "string")) {
            console.error("token must be instance string");
            throw Error("token must instance string");
        }

        return await fetch(`${this.#adminUrl}/create`, {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Content-type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(createUser)
        })
    }

    async updateById(userUpdate = {}, authentication, identity) {
        if (!this.required(authentication, "string")) {
            console.error("Param authentication must be instance String");
            throw Error("");
        }

        if (!this.required(userUpdate, UpdateUser)) {
            console.error("userUpdate must be instance of UpdateUser");
            throw new Error("userUpdate must be instance of UpdateUser")
        }

        if (!this.required(identity, "string")) {
            console.error("identity must be instance of string");
            throw new Error("identity must be instance of string")
        }

        return await fetch(`${this.#adminUrl}/update-user-by-id/${identity}`, {
            method: "PUT",
            headers: {
                "accept": "application/json",
                "Content-type": "application/json",
                "Authorization": `Bearer ${authentication}`,
            },
            body: JSON.stringify(userUpdate)
        });
    }

    async warningUpdate(authentication, value, identity) {
        if (!this.required(authentication, "string")) {
            console.error("Param authentication must be instance String");
            throw Error("");
        }

        if (!this.required(value, "number")) {
            console.error("value must be instance of number");
            throw new Error("value must be instance of number")
        }

        if (!this.required(identity, "string")) {
            console.error("identity must be instance of string");
            throw new Error("identity must be instance of string")
        }

        const data = {
            warning: value
        }

        return await fetch(`${this.#adminUrl}/update-warning/${identity}`, {
            method: "PUT",
            headers: {
                "accept": "application/json",
                "Content-Type" : "application/json",
                "Authorization": `Bearer ${authentication}`,
            },
            body: JSON.stringify(data)
        });
    }

    async updateImage(authentication, image, identity) {
        if (!this.required(authentication, "string")) {
            console.error("Param authentication must be instance String");
            throw Error("");
        }

        if (!this.required(identity, "string")) {
            console.error("identity must be instance of string");
            throw new Error("identity must be instance of string")
        }

        const formData = new FormData();
        if (image instanceof File) formData.append("file", image)
        else throw Error("");

        return await fetch(`${this.#adminUrl}/update-avatar/${identity}`, {
            method: "PUT",
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${authentication}`,
            },
            body: formData
        });
    }

    async roleUpdate(authentication, roleId, identity) {
        if (!this.required(authentication, "string")) {
            console.error("Param authentication must be instance String");
            throw Error("");
        }

        if (!this.required(identity, "string")) {
            console.error("identity must be instance of string");
            throw new Error("identity must be instance of string")
        }

        if (!this.required(roleId, "string")) {
            console.error("Role must be instance String");
            throw Error("");
        }

        const data = {
            roleId: roleId
        };

        return await fetch(`${this.#adminUrl}/update-role/${identity}`, {
            method: "PUT",
            headers: {
                "accept": "application/json",
                "Content-Type" : "application/json",
                "Authorization": `Bearer ${authentication}`,
            },
            body: JSON.stringify(data)
        });
    }

    async deleteAccount(authentication, identity) {
        if (!this.required(authentication, "string")) {
            console.error("Param authentication must be instance String");
            throw Error("");
        }

        if (!this.required(identity, "string")) {
            console.error("identity must be instance of string");
            throw new Error("identity must be instance of string")
        }

        return await fetch(`${this.#adminUrl}/delete-user/${identity}`, {
            method: "DELETE",
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${authentication}`,
            },
        });
    }
}

const adminService = new AdminService();
export default adminService;