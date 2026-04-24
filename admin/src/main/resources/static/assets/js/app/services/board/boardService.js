import {BaseURL} from "../../baseUrl/baseURL.js";
import Parameter from "../../../utils/required.js";

const BoardService = {
    boardUrl: BaseURL.board,
    required:  Parameter.required,

    async getAll(authentication = String("")) {
        if (!this.required(authentication, "string")) {
            console.error("Param authentication must be instance String");
            throw Error("");
        }

        return await fetch(`${this.boardUrl}/get-all-categories`, {
            method: "GET",
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${authentication}`
            }
        });
    }
}

export default BoardService;