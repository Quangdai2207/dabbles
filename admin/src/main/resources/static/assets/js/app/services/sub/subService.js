import {BaseURL} from "../../baseUrl/baseURL.js";
import Parameter from "../../../utils/required.js";

const subService = {
    subsUrl: BaseURL.admin,
    required: Parameter.required,

    async getSubByUserId(
        auth = String(""),
        userId = String(""),
        page = Number(0),
        size = Number(100)
    ) {
        if (!this.required(userId, "string")) {
            console.error("userId must be instance String");
            throw Error("");
        }

        if (!this.required(auth, "string")) {
            console.error("Auth must be instance String");
            throw Error("");
        }

        if (!this.required(page, "number")) {
            console.error("page must be instance Number");
            throw Error("");
        }

        if (!this.required(size, "number")) {
            console.error("userId must be instance NUmber");
            throw Error("");
        }

        return await fetch(`${this.subsUrl}/search-subscriptions-by-user/${userId}?status=&sortByCreatedDateDesc=true&page=${page}&size=${size}`, {
            method: "GET",
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${auth}`
            }
        })
    },
}

export default subService;