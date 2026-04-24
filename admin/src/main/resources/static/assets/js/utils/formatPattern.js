import Parameter from "./required.js";

export function dateFormat(date) {
    if (!date) return "";

    let dateSplit = date.split("-");

    const year = dateSplit[0];
    const month = dateSplit[1];
    const day = dateSplit[2];

    date = `${day}/${month}/${year}`;
    return date;
}

export function createdFormat(createdDate) {
    const created = new Date(createdDate.replace(' ', 'T') + 'Z');
    const formatDate = created.toLocaleDateString("en-GB", {
        day: "2-digit", month: "2-digit", year: "numeric"
    });
    const dateFormatSplit = formatDate.split("/")
    return `${dateFormatSplit[0]}-${dateFormatSplit[1]}-${dateFormatSplit[2]}`;
}

export function createdFormat_II(createdDate) {
    const date = new Date(createdDate?.replace(' ', 'T') + 'Z');

    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()

    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${day}-${month}-${year} ${hours}:${minutes}`
}


export function formatSize(bytes, fixed = 2) {
    if (!bytes) return "0 B";

    const units = ["B", "KB", "MB", "GB", "TB"];
    let i = 0;

    while (bytes >= 1024 && i < units.length - 1) {
        bytes /= 1024;
        i++;
    }

    return `${bytes.toFixed(fixed)} ${units[i]}`;
}

export function timeAgo(date) {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    const intervals = {
        year: 31536000,
        month: 2592000,
        day: 86400,
        hour: 3600,
        minute: 60
    };

    for (const key in intervals) {
        const value = Math.floor(seconds / intervals[key]);
        if (value >= 1) {
            return `${value} ${key}${value > 1 ? "s" : ""} ago`;
        }
    }
    return "Just now";
}

export function formatNumber(number = "0" || 0) {
    if (!Parameter.required(number, "number")) {
        console.error("Number is not valid");
        return "";
    }

    if (isNaN(number)) {
        console.error("Number is not valid");
        return "";
    }

    return number
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

