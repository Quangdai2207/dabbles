import {BaseURL} from "../../baseUrl/baseURL.js";
import Parameter from "../../../utils/required.js";

const ImageService = {
    imageUrl: BaseURL.image,
    adminUrl: BaseURL.admin,
    required: Parameter.required,

    async getImageByUser(
        authentication = "",
        userId = "",
        isBlacklist = false,
        page = parseInt("0") || 0,
        size = parseInt("200") || 200
    ) {
        if (!this.required(authentication, "string")) {
            console.error("Param authentication must be instance String");
            throw Error("");
        }

        if (!this.required(userId, "string")) {
            console.error("userId must be instance String");
            throw Error("");
        }

        if (!this.required(page, "number")) {
            console.error("Page must be instance Number");
            throw Error("");
        }

        if (!this.required(size, "number")) {
            console.error("Size must be instance Number");
            throw Error("");
        }

        if (!isBlacklist) {
            return await fetch(`${this.adminUrl}/get-all-images-by-user/${userId}?page=${page}&size=${size}`, {
                method: "GET",
                headers: {
                    "accept": "application/json",
                    "Authorization": `Bearer ${authentication}`
                }
            })
        }

        return await fetch(`${this.adminUrl}/get-all-deleted-images-by-user/${userId}`, {
            method: "GET",
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${authentication}`
            }
        })
    },

    async getTotalImageDeleted(authentication = "", userId = "") {
        if (!this.required(authentication, "string")) {
            console.error("Param authentication must be instance String");
            throw Error("");
        }

        if (!this.required(userId, "string")) {
            console.error("userId must be instance String");
            throw Error("");
        }

        return await fetch(`${this.adminUrl}/get-all-deleted-images-by-user/${userId}`, {
            method: "GET",
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${authentication}`
            }
        })
    },

    async getImageById(authentication, identity = "") {
        if (!this.required(identity, "string")) {
            console.error("Identity must be instance String");
            throw Error("");
        }

        if (!this.required(authentication, "string")) {
            console.error("Param authentication must be instance String");
            throw Error("");
        }

        return await fetch(`${this.adminUrl}/get-images-by-id/${identity}`, {
            method: "GET",
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${authentication}`
            }
        })
    },

    async deleteImageById(authentication, identity) {
        if (!this.required(identity, "string")) {
            console.error("Identity must be instance String");
            throw Error("");
        }

        if (!this.required(authentication, "string")) {
            console.error("Param authentication must be instance String");
            throw Error("");
        }

        return await fetch(`${this.adminUrl}/delete-image/${identity}`, {
            method: "DELETE",
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${authentication}`
            }
        })
    },

    async getImageByCategoryId(authentication, categoryId, page = parseInt("0" || 0), size = parseInt("1000") || 1000) {
        if (!this.required(categoryId, "string")) {
            console.error("categoryId must be instance String");
            throw Error("");
        }

        if (!this.required(authentication, "string")) {
            console.error("Param authentication must be instance String");
            throw Error("");
        }

        return await fetch(`${this.adminUrl}/get-images-by-category/${categoryId}?page=${page}&size=${size}`, {
            method: "GET",
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${authentication}`
            }
        })
    },

    async getImagesByCategoryPaginate(
        authentication = String(""),
        cateId = String(""),
        page = Number(0),
        size = Number(10)
    ) {
        if (!this.required(cateId, "string")) {
            console.error("categoryId must be instance String");
            throw Error("");
        }

        if (!this.required(authentication, "string")) {
            console.error("Param authentication must be instance String");
            throw Error("");
        }

        if (!this.required(page, "number")) {
            console.error("page must be instance number");
            throw Error("");
        }

        if (!this.required(size, "number")) {
            console.error("size authentication must be instance number");
            throw Error("");
        }

        return await fetch(`${this.adminUrl}/get-images-by-category/${cateId}?page=${page}&size=${size}`, {
            method: "GET",
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${authentication}`
            }
        })
    },

    async getAllImages(authentication = String(""),
                       page = parseInt("0") || 0,
                       size = parseInt("200") || 200,
    ) {
        if (!this.required(authentication, "string")) {
            console.error("Param authentication must be instance String");
            throw Error("");
        }

        return await fetch(`${this.adminUrl}/get-all-images?page=${page}&size=${size}`, {
            method: "GET",
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${authentication}`
            }
        });
    },

    async uploadImage(authentication, payload = {}) {
        if (!this.required(authentication, "string")) {
            console.error("Param authentication must be instance String");
            throw Error("");
        }

        const {description, categoryId, fileUpload} = payload;

        let formData = new FormData();
        formData.append("description", description);
        formData.append("categoryIds", categoryId);

        if (fileUpload instanceof File) formData.append("file", fileUpload);
        else {
            console.error("File is not valid")
            return;
        }

        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        return await fetch(`${this.adminUrl}/upload`, {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${authentication}`,
            },
            body: formData,
        });
    }
}

export default ImageService