import {setStatsImagePage} from "../../components/dashboard/pages/image/images.js";
import {formatNumber} from "../../../utils/formatPattern.js";

export const imageContext = {
    reset() {
        this.publicTotal = 0;
        this.privateTotal = 0;
        this.imageTotal = 0;
        this.price = 0.0;
    },

    setData(data) {
        this.reset();

        if (!Array.isArray(data)) {
            console.error("Data is null >>>");
            return;
        }

        if (Array.isArray(data)) {
            this.imageTotal = data.length;
            data.forEach(item => {
                this.price += Number(item.price);
                if (item.public) this.publicTotal++;
                else this.privateTotal++;
            })

            setStatsImagePage(
                this.imageTotal,
                this.publicTotal,
                this.privateTotal,
                formatNumber(this.price)
            )
        }
    },
}