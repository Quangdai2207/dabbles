const authContext = {
    sessionData: null,
    setData(data) {
        if (data) {
            this.sessionData = data;
            try {
                //** set data browser
                const {email, role, id} = data;
                //** Decode email and role
                localStorage.setItem("eb", btoa(String(email)));
                localStorage.setItem("rb", btoa(String(role)));
                localStorage.setItem("b64ids", btoa(String(id)));
            } catch (e) {
                console.error("Encoding error:", e);
            }
        }
    },

    getContext() {
        if (this.sessionData) {
            return this.sessionData;
        }
        const emailEncode = localStorage.getItem("eb");
        const roleEncode = localStorage.getItem("rb");
        const token = localStorage.getItem("code");
        const id = localStorage.getItem("b64ids");

        let email = "";
        let role = "";

        try {
            if (emailEncode) email = atob(emailEncode);
            if (roleEncode) role = atob(roleEncode);
        } catch (e) {
            console.error("Decoding error:", e);
        }

        this.sessionData = {
            email: email,
            role: role,
            token: token,
            id: id
        }
        return this.sessionData;
    }
}

export default authContext;