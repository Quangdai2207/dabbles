import {createdFormat_II, formatNumber, formatSize, timeAgo} from "../../../utils/formatPattern.js";
import {setStatHeaderUserPayment} from "../../components/dashboard/pages/user/payment/user_payment.js";

export const userPaymentContext = {
    reset() {
        this.paymentTotal = 0;
        this.failTotal = 0;
        this.paidTotal = 0;
        this.successTotal = 0;
        this.cancelTotal = 0;
        this.pendingTotal = 0;
        this.faildedAmount = 0;
        this.pendingAmount = 0;
        this.successAmount = 0;
        this.cancelAmount = 0;
        this.lastedPayment = null;
    },

    setData(data) {
        this.reset();

        if (!Array.isArray(data)) {
            this.lastedPayment = this.lastedPayment
                ? timeAgo(this.lastedPayment)
                : null;
        } else {
            data.forEach(item => {
                const {paymentStatus, amount, paymentDate} = item;
                const latestPaymentDate = new Date(paymentDate.replace(' ', 'T') + 'Z');
                if (isNaN(latestPaymentDate.getTime())) return;

                this.paidTotal += amount;

                if (paymentStatus === 3) {
                    this.cancelTotal++;
                    this.cancelAmount += amount;
                } else if (paymentStatus === 2) {
                    this.successTotal++;
                    this.successAmount += amount;
                } else if (paymentStatus === 1) {
                    this.pendingTotal++;
                    this.pendingAmount += amount;
                } else if (paymentStatus === 0) {
                    this.failTotal++;
                    this.faildedAmount += amount;
                }

                if (!this.lastedPayment || latestPaymentDate > this.lastedPayment) {
                    this.lastedPayment = latestPaymentDate;
                }
            });

            this.paymentTotal = data.length;
            this.lastedPayment = this.lastedPayment
                ? timeAgo(this.lastedPayment)
                : null;
        }

        setStatHeaderUserPayment(
            formatNumber(this.paidTotal),
            this.paymentTotal,
            this.failTotal,
            this.successTotal,
            this.cancelTotal,
            this.pendingTotal,
            this.lastedPayment,
            this.faildedAmount,
            this.pendingAmount,
            this.successAmount,
            this.cancelAmount
        );
    }
};
