import {BaseURL} from "../../baseUrl/baseURL.js";
import Parameter from "../../../utils/required.js";

const WalletService = {
    walletUrl: BaseURL.admin,
    required: Parameter.required,

    async getWalletById(
        auth = String(""),
        walletId = String("")
    ) {
        if (!this.required(auth, "string")) {
            console.error("Authentication must be instance String");
            throw Error("");
        }

        if (!this.required(walletId, "string")) {
            console.error("userId must be instance String");
            throw Error("");
        }

        return await fetch(`${this.walletUrl}/get-wallet-by-id/${walletId}`, {
            method: "GET",
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${auth}`
            }
        })
    }
}

export default WalletService;