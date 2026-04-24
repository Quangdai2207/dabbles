export default function reloadCaptcha() {
    const wrapper = $("#turnstile-wrapper");
    wrapper.empty().html('<div id="cf-turnstile"></div>')
    turnstile.render("#cf-turnstile", {
        sitekey: "0x4AAAAAABHQ6Ou0TPewsB45",
        callback: onTurnstileVerify,
        "expired-callback": onTurnstileExpire,
        "error-callback": onTurnstileExpire,
        theme: "dark",
        size: "flexible"
    });
}