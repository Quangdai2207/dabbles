import {createdFormat, formatSize, timeAgo} from "../../../utils/formatPattern.js";
import imageService from "../../services/image/imageService.js";
import {renderStatsUserImage} from "../../components/dashboard/pages/user/user_image.js";

export const userImageContext = {
    reset() {
        this.downloadTotal = 0;
        this.uploadTotal = 0;
        this.privateTotal = 0;
        this.publicTotal = 0;
        this.blacklistTotal = 0;
        this.filesizeTotal = 0;
        this.filesizeTotalBlacklist = 0;
        this.lastedImageDate = null;
    },

    async setData(data, auth, userId) {
        this.reset();

        if (!Array.isArray(data)) {
            this.lastedImageDate = this.lastedImageDate
                ? timeAgo(this.lastedImageDate)
                : null;
        } else {
            data.forEach(item => {
                const size = Number(item?.filesize) || 0;

                const createdAt = new Date(
                    item.createdDate.replace(' ', 'T') + 'Z'
                )

                this.filesizeTotal += size;
                item?.public ? this.publicTotal++ : this.privateTotal++;

                if (!this.lastedImageDate || createdAt > this.lastedImageDate) {
                    this.lastedImageDate = createdAt;
                }
            });

            this.uploadTotal = data.length;
            this.lastedImageDate = this.lastedImageDate
                ? timeAgo(this.lastedImageDate)
                : null;
        }

        try {
            const res = await imageService.getTotalImageDeleted(auth, userId);
            if (!res.status === Number(400)) {
                this.filesizeTotalBlacklist = 0;
                this.blacklistTotal = 0;
            }

            if (res.ok) {
                const {data} = await res.json();
                if (!Array.isArray(data)) {
                    this.filesizeTotalBlacklist = 0;
                    this.blacklistTotal = 0;
                } else {
                    this.blacklistTotal = data.length;
                    data.forEach(item => {
                        const size = Number(item?.filesize) || 0;
                        this.filesizeTotalBlacklist += size;
                    })
                }
            } else {
                console.warn("Failed to fetch deleted images");
            }
        } catch (e) {
            console.error("Error fetching deleted images:", e);
        }

        renderStatsUserImage(
            this.uploadTotal,
            this.downloadTotal,
            this.publicTotal,
            this.privateTotal,
            formatSize(this.filesizeTotal),
            this.lastedImageDate,
            this.blacklistTotal,
            formatSize(this.filesizeTotalBlacklist)
        );
    }
};
