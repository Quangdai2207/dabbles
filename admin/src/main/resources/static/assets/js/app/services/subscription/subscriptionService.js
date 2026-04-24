"use strict"

import {BaseURL} from "../../baseUrl/baseURL.js";
import Parameter from "../../../utils/required.js";

const FeeService = {
    subscriptionUrl: BaseURL.subscription,
    required: Parameter.required,

    async getAll(authentication = "") {
        if (!this.required(authentication, "string")) {
            console.error("Param authentication must be instance String");
            throw Error("");
        }

        return await fetch(`${this.subscriptionUrl}/get-all-plans`, {
            method: "GET",
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${authentication}`
            }
        });
    },

    async update(auth, subsId, data = {}) {
        if (!this.required(auth, "string")) {
            console.error("authentication must be instance String");
            throw Error("");
        }

        if (!this.required(subsId, "string")) {
            console.error("subsId must be instance String");
            throw Error("");
        }

        return await fetch(`${this.subscriptionUrl}/update-plan/${subsId}`, {
            method: "PUT",
            headers: {
                "accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${auth}`,
            },
            body: JSON.stringify(data)
        });
    },

    async add(auth, data = {}) {
        if (!this.required(auth, "string")) {
            console.error("authentication must be instance String");
            throw Error("");
        }

        return await fetch(`${this.subscriptionUrl}/create-plan`, {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${auth}`,
            },
            body: JSON.stringify(data)
        });
    },

    async delete(auth, id = String("")) {
        if (!this.required(auth, "string")) {
            console.error("authentication must be instance String");
            throw Error("");
        }

        if (!this.required(id, "string")) {
            console.error("authentication must be instance String");
            throw Error("");
        }

        return await fetch(`${this.subscriptionUrl}/delete-plan/${id}`, {
            method: "DELETE",
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${auth}`,
            },
        });
    },
}

export default FeeService;