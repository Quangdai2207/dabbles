export default function pageLoad(token) {
    if (!token) return null;

    try {
        const base64Url = token.split('.')[1]; // get payload
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload)
    } catch (err) {
        console.error("Invalid JWT:", err);
        return null;
    }
}

