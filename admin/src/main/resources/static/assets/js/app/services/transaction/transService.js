import {BaseURL} from "../../baseUrl/baseURL.js";
import Parameter from "../../../utils/required.js";

const TransactionService = {
    transactionUrl: BaseURL.admin,
    required: Parameter.required,

    async getTransactionsByUserId(
        auth = String(""),
        userId = String("")
    ) {
        if (!this.required(auth, "string")) {
            console.error("Authentication must be instance String");
            throw Error("");
        }

        if (!this.required(userId, "string")) {
            console.error("userId must be instance String");
            throw Error("");
        }

        return await fetch(`${this.transactionUrl}/get-wallet-transaction-by-user/${userId}`, {
            method: "GET",
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${auth}`
            }
        })
    }
}

export default TransactionService;