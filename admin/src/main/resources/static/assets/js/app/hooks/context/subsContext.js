import {setStatHeaderSubs} from "../../components/dashboard/pages/user/subsribes/user_subs.js";

export const subsContext = {
    reset() {
        this.subsTotal = 0;
        this.valueTotal = 0;
        this.activeTotal = 0;
        this.expireTotal = 0;
    },

    setData(data) {
        this.reset();

        if (Array.isArray(data) && data.length > 0) {
            this.subsTotal = data.length;
            data.forEach(item => {
                const {status, planPrice} = item;
                if (status.toLowerCase() === "active") this.activeTotal++;
                if (status.toLowerCase() === "expired") this.expireTotal++;

                this.valueTotal += planPrice
            });
        }

      setStatHeaderSubs(
          this.subsTotal,
          this.valueTotal,
          this.activeTotal,
          this.expireTotal
      )
    }
};
