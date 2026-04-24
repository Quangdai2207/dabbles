//** Parameter Object with attribute required has params, including:
//** V: value
//** T: DataTyoe

const Parameter = {
    required: function(V, T) {
        if (T === "string" || T === String) {
            return typeof V === "string" && V.trim() !== "";
        }

        if (T === "number" || T === Number) {
            return typeof V === "number" && !isNaN(V)
        }

        if (typeof T === "function") {
            return V instanceof T;
        }
        return false;
    }
}

export default Parameter;