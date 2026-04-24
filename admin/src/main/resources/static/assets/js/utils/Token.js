export function parseToken(token) {
    // token has shape: header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    try {
        return JSON.parse(atob(parts[1]));
    } catch (e) {
        console.error("Invalid token:", e);
        return null;
    }
}

export function getPayloadToken(tokenKey = "code", expiresKey = "time") {
    const jwtToken = localStorage.getItem(tokenKey);
    const expiresToken = parseInt(localStorage.getItem(expiresKey), 10);

    if (!jwtToken || !expiresToken) return null;

    if (Date.now() > expiresToken || typeof expiresToken !== "number") {
        localStorage.clear();
        return null;
    }
    return parseToken(jwtToken);
}

export function setToken(token, expires) {
    try {
        if (!token || !expires) {
            console.error(`Token or expires is null`);
            return false;
        }

        if (typeof expires !== "number") {
            console.error("token expires must be number");
            return false;
        }

        const tokenExpires = Date.now() + parseInt(expires) * 1000;
        localStorage.setItem("code", token);
        localStorage.setItem("time", tokenExpires);
    } catch (e) {
        console.error("Error parsed expires >>>", e);
        return false;
    }
    return true;
}

export function removeToken() {
    localStorage.clear();
    location.reload();
}

export function getAuthentication() {
    return localStorage.getItem("code") ?? null;
}