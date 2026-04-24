"use strict"

import {BaseURL} from "../../baseUrl/baseURL.js";
import Parameter from "../../../utils/required.js";

const FeeService = {
    feeUrl: BaseURL.fee,
    required: Parameter.required,

    async getAll(authentication = "") {
        if (!this.required(authentication, "string")) {
            console.error("Param authentication must be instance String");
            throw Error("");
        }

        return await fetch(`${this.feeUrl}/get-all-fees`, {
            method: "GET",
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${authentication}`
            }
        });
    },

    async feeUpdate(auth, feeId, percent = {}) {
        if (!this.required(auth, "string")) {
            console.error("authentication must be instance String");
            throw Error("");
        }

        if (!this.required(feeId, "string")) {
            console.error("feeId must be instance String");
            throw Error("");
        }

        if (!this.required(percent, "number")) {
            console.error("percent value must be instance number");
            throw Error("");
        }

        return await fetch(`${this.feeUrl}/update/${feeId}`, {
            method: "PUT",
            headers: {
                "accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${auth}`,
            },
            body: JSON.stringify({"percent" : percent})
        });
    },

    async feeAdd(auth, data = {}) {
        if (!this.required(auth, "string")) {
            console.error("authentication must be instance String");
            throw Error("");
        }

        return await fetch(`${this.feeUrl}/create`, {
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

        return await fetch(`${this.feeUrl}/delete/${id}`, {
            method: "DELETE",
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${auth}`,
            },
        });
    },
}

export default FeeService;