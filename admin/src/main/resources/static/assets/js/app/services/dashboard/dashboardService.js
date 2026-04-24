import {BaseURL} from "../../baseUrl/baseURL.js";
import Parameter from "../../../utils/required.js";

const DashboardService = {
    adminUrl: BaseURL.admin,
    required: Parameter.required,

    async getTotalUsers(auth = String("")) {
        if (!this.required(auth, "string")) {
            console.error("Auth must be instance String");
            throw Error("");
        }

        return await fetch(`${this.adminUrl}/total-users`, {
            method: "GET",
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${auth}`
            }
        })
    },
    async getTotalPayments(auth = String("")) {
        if (!this.required(auth, "string")) {
            console.error("Auth must be instance String");
            throw Error("");
        }

        return await fetch(`${this.adminUrl}/total-payments`, {
            method: "GET",
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${auth}`
            }
        })
    },
    async getTotalCategories(auth = String("")) {
        if (!this.required(auth, "string")) {
            console.error("Auth must be instance String");
            throw Error("");
        }

        return await fetch(`${this.adminUrl}/total-categories`, {
            method: "GET",
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${auth}`
            }
        })
    },
    async getTotalImages(auth = String("")) {
        if (!this.required(auth, "string")) {
            console.error("Auth must be instance String");
            throw Error("");
        }

        return await fetch(`${this.adminUrl}/total-images`, {
            method: "GET",
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${auth}`
            }
        })
    },
}

export default DashboardService;