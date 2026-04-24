import {setStatHeaderUser} from "../../components/dashboard/pages/user/user.js";

export const userContext = {
    reset() {
        this.userTotal = 0;
        this.activeTotal = 0;
        this.blockTotal = 0;
        this.publicTotal = 0;
        this.warningTotal = 0;
    },

    setData(data) {
        this.reset();

        if (Array.isArray(data) && data.length > 0) {
            this.userTotal = data.length;
            data.forEach(item => {
                const {warning, active, deleted, public: isPublic} = item;
                if (active) this.activeTotal++;
                if (active && warning !== 0) this.warningTotal++;
                if (active && isPublic) this.publicTotal++;
                if (deleted) this.deleted++;
            });
        }

        setStatHeaderUser(
            this.userTotal,
            this.activeTotal,
            this.blockTotal,
            this.publicTotal,
            this.warningTotal
        );
    }
};
