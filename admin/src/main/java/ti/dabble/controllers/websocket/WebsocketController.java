package ti.dabble.controllers.websocket;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller("Websocket")
public class WebsocketController {
    /**
     * <div style="border: 1px solid white; padding: 10px; color: white; font-family: 'tahoma'">
     *     <h3 style="font-style: bold">WebsocketController</h3>
     *     <div style="padding-left: 20px">
     *
     *         <p>
     *             The WebsocketController is responsible for recording
     *             user data from other applications when they send
     *             notifications through the Upstream channel of the
     *             admin BFF application.
     *         </p>
     *
     *         <p>
     *             If another application wants to receive real-time data,
     *             it can subscribe to the Downstream channel defined
     *             by the BFF server using the <code>@SendTo</code> mechanism.
     *         </p>
     *
     *     </div>
     * </div>
     */

    //** LOGIN
    @MessageMapping("/upstream/alert/login") // UPSTREAM thread for ROLE SUPER_ADMIN receive data
    @SendTo("/topic/SUPERADMIN/notification") // DOWNSTREAM thread from ROLE SUPER_ADMIN response data
    public Object alertLogin(Map<String, Object> data) {
        System.out.println("\n\n\nMessage socket >>> " + data.get("message") + "\n\n\n");
        return data;
    }

    @MessageMapping("/upstream/alert/logout")
    @SendTo("/topic/SUPERADMIN/notification")
    public Object alertLogout(Map<String, Object> data) {
        System.out.println("\n\n\nMessage socket >>> " + data.get("message") + "\n\n\n");
        return data;
    }
}
