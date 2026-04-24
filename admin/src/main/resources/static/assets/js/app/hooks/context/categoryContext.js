'use strict'

const CategoryContext = {
    _data: null,

    setData(id ) {
        if (!id) {
            console.error("Can not found Category Id");
            return;
        }

        this._data = String(id);
        sessionStorage.setItem("catId", this._data);
    },

    getData() {
        const cateId = sessionStorage.getItem("catId");
        return this._data ?? cateId;
    }
}

window.CategoryContext = CategoryContext;   //** Using "Window" instead "this" when inline function in the onClick event
export default CategoryContext;
