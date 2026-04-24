import {BaseURL} from "../../baseUrl/baseURL.js";
import Parameter from "../../../utils/required.js";

const PaymentService = {
    paymentUrl: BaseURL.payment,
    required: Parameter.required,

    async getPaymentByUser(authentication = "", userId = "") {
        if (!this.required(authentication, "string")) {
            console.error("Param authentication must be instance String");
            throw Error("");
        }

        if (!this.required(userId, "string")) {
            console.error("userId must be instance String");
            throw Error("");
        }

        return await fetch(`${this.paymentUrl}/get-payments-by-user/${userId}`, {
            method: "GET",
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${authentication}`
            }
        })
    },

    async getPaymentById(authentication = String(""), paymentId = String("")) {
        if (!this.required(authentication, "string")) {
            console.error("Param authentication must be instance String");
            throw Error("");
        }

        if (!this.required(paymentId, "string")) {
            console.error("userId must be instance String");
            throw Error("");
        }

        return await fetch(`${this.paymentUrl}/get-payments-by-id/${paymentId}`, {
            method: "GET",
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${authentication}`
            }
        })
    },

    async getReferenceById(authentication = String(""), refId = String("")) {
        if (!this.required(authentication, "string")) {
            console.error("Param authentication must be instance String");
            throw Error("");
        }

        if (!this.required(refId, "string")) {
            console.error("userId must be instance String");
            throw Error("");
        }

        return await fetch(`${this.paymentUrl}/get-payments-by-reference-id/${refId}`, {
            method: "GET",
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${authentication}`
            }
        })
    },

}

export default PaymentService;