'use strict';

import index from "./index.js";
import {socketContext} from "./hooks/context/socketContext.js";

export let stompClient = null;

/**
 * <p style="color: white; border: 1px solid white; padding: 10px">
 * Kết nối WebSocket + STOMP with authentication param
 * </p>
 * @param authentication
 */
export function connectWS(authentication) {
    if (!authentication) {
        console.error("Not yet authentication in this session access");
        return;
    }

    const socket = new SockJS("/ws"); //** connection on user http://localhost:8668/ws
    stompClient = Stomp.over(socket);

    // stompClient.debug = () => {};

    if (!stompClient) {
        console.error("STOMP client chưa khởi tạo!");
        return;
    }

    //** Pass Token for BFF when user login success
    stompClient.connect({Authorization: `Bearer ${authentication.token}`}, onConnected, onError);

    /** ---------------- SUB FUNCTION ---------------- */
    function onConnected(frame) {
        const topic = `/topic/${authentication.role}/notification`;
        switch (topic) {
            case "/topic/SUPERADMIN/notification":
                console.log("Socket Frame: ", frame);
                stompClient.subscribe(topic, onMessageReceived);
                break;
            case "/topic/admin/notification":
                break;
            default:
                break;
        }
        console.log("WS CONNECTED OK");
    }

    function onMessageReceived(res) {
        console.log(JSON.parse(res.body));
        const {userId, event} = JSON.parse(res.body);
        console.log(userId, event);
        socketContext.setStatus(userId, event);
    }

    function onError(error) {
        console.error("WS Connection Error:", error);
        // Có thể retry kết nối nếu muốn
    }
}

$(document).ready(function () {
    index();
});
