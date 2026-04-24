const resetContext = {
    message: "",
    setMessage(message = "") {
        this.message = message ?? "";
        localStorage.setItem("msg", this.message)
    },

    getMessage() {
        this.message = localStorage.getItem("msg") ?? "";
        localStorage.removeItem("msg")
        return this.message;
    }

}

export default resetContext;