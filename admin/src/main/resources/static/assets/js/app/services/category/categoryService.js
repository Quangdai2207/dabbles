import {BaseURL} from "../../baseUrl/baseURL.js";
import Parameter from "../../../utils/required.js";
import CreateCategory from "../../model/category/createCategory.js";
import EditCategory from "../../model/category/editCategory.js";

const CategoryService = {
    categoryUrl: BaseURL.category,
    required: Parameter.required,

    async getAll(authentication = "") {
        if (!this.required(authentication, "string")) {
            console.error("Param authentication must be instance String");
            throw Error("");
        }

        return await fetch(`${this.categoryUrl}/get-all-categories`, {
            method: "GET",
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${authentication}`
            }
        });
    },

    async create(authentication = "", body = {}) {
        if (!this.required(authentication, "string")) {
            console.error("Param authentication must be instance String");
            throw Error("");
        }

        if (!body) {
            console.error("Body Can not null");
            return;
        }

        if (this.required(body, CreateCategory)) {
            console.error("body must be instance CreateCategory");
            return;
        }

        const {name, description, featured} = body;
        const createCategory = CreateCategory.builder()
            .setName(name)
            .setDesc(description)
            .setFeatured(featured)
            .build()

        return await fetch(`${this.categoryUrl}/create-category`, {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authentication}`
            },
            body: JSON.stringify(createCategory)
        });
    },

    async update(authentication = "", body = {}, id) {
        if (!this.required(authentication, "string")) {
            console.error("Param authentication must be instance String");
            throw Error("");
        }

        if (!body) {
            console.error("Body Can not null");
            return;
        }

        if (this.required(body, EditCategory)) {
            console.error("body must be instance CreateCategory");
            return;
        }

        const {name, description, featured} = body;
        const editCategory = EditCategory.builder()
            .setName(name)
            .setDesc(description)
            .setFeatured(featured)
            .build()

        return await fetch(`${this.categoryUrl}/update-category/${id}`, {
            method: "PUT",
            headers: {
                "accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authentication}`
            },
            body: JSON.stringify(editCategory)
        });
    },

    async delete(authentication = "",  id) {
        if (!this.required(authentication, "string")) {
            console.error("Param authentication must be instance String");
            throw Error("");
        }

        if (!id) {
            console.error("Body Can not null");
            return;
        }

        return await fetch(`${this.categoryUrl}/delete-category/${id}`, {
            method: "DELETE",
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${authentication}`
            },
        });
    },

    async getById(authentication = String(""), id = String("")) {
        if (!this.required(authentication, "string")) {
            console.error("Param authentication must be instance String");
            throw Error("");
        }

        if (!this.required(id, "string")) {
            console.error("id must be instance String");
            throw Error("");
        }

        return await fetch(`${this.categoryUrl}/get-category-by-id/${id}`, {
            method: "GET",
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${authentication}`
            },
        });

    },
}

export default CategoryService;