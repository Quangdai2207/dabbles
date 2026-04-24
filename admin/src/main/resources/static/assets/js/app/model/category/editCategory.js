'use strict'

class EditCategory {
    constructor(
        name = String(""),
        description = String(""),
        featured = Boolean(0),
    ) {
        this.name = String(name);
        this.description = String(description);
        this.featured = Boolean(featured);
    }

    static builder() {
        return new EditCategoryBuilder();
    }

    setName(name = String("")) {
        this.name = String(name);
        return this;
    }

    setDesc(description = String("")) {
        this.description = String(description);
        return this;
    }

    setFeatured(featured = Boolean(0)) {
        this.featured = Boolean(featured);
        return this;
    }
}


class EditCategoryBuilder {
    #name;
    #description;
    #featured;

    constructor() {
    }

    setName(name = String("")) {
        this.#name = String(name);
        return this;
    }

    setDesc(description = String("")) {
        this.#description = String(description);
        return this;
    }

    setFeatured(featured = Boolean(0)) {
        this.#featured = Boolean(featured);
        return this;
    }

    build() {
        return new EditCategory(
            this.#name,
            this.#description,
            this.#featured
        )
    }
}
export default EditCategory;