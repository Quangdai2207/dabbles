const Cookie = {
    setCookie: (opts = {}) => {
        const {
            name = "",
            value = "",
            expires = null,
            path = "/",
            sameSite = "Lax",
            secure = false
        } = opts

        const sameSites = ["Strict", "Lax", "None"];
        if (!sameSites.includes(sameSite)) return false;

        const exp = new Date(Date.now() + ((expires ?? 3600) * 1000)).toUTCString();
        let cookieStr = `${name}=${value}; expires=${exp}; path=${path}; SameSite=${sameSite}`;

        if (secure) cookieStr += "; Secure";

        document.cookie = cookieStr;
        return true;
    },

    getCookie: (name) => {
        const cookie = document.cookie.split("; ");
        let parts = {};
        cookie.forEach(c => {
            const [k, v] = c.split("=");
            parts[k.trim()] = v
        })

        return name ? parts[name] : parts;
    },

}

export default Cookie;