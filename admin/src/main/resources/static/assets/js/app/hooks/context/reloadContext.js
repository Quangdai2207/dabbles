import reloadCaptcha from "../../../utils/captcha.js";

const reloadContext = {
    isReload: false,
    subscribes: [],

    setIsReload: function (isReload) {
        this.isReload = isReload;
        setTimeout(() => {
            if (this.isReload && location.pathname === "/auth/login") {
                const loginPage = $("#auth-login")

                if (!loginPage) return;
                reloadCaptcha()
            };
        }, 100)
    },

    subscribe(fn) {
        this.subscribes.push(fn)
    },

    getIsReload() {
        return this.isReload;
    }
}

export default reloadContext;