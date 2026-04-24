package ti.dabble.configurations.AuthSocket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.TimeUnit;

/**
 * <div style="border: 1px solid white; padding: 10px; color: white; font-family: 'tahoma'">
 *  <h3 style="font-style: bold">Component WebsocketEventListener</h3>
 *  <div style="padding-left: 20px">
 *
 *      <p>
 *          The <span style="color: #EEEE; font-weight: bold">WebsocketEventListener</span>
 *          Component class is responsible for managing user connection sessions
 *          in the CONNECT and DISCONNECT states in a proactive manner,
 *          without relying on the Frontend.
 *      </p>
 *
 *      <p>
 *          Since my Spring frontend application
 *          <span style="font-weight: bold; color: #EEEE">admin[FE_Admin]</span>
 *          acts as a BFF (Backend For Frontend) and manages WebSocket
 *          connection sessions based on the user token, the
 *          <span style="color: #EEEE; font-weight: bold">WebsocketEventListener</span>
 *          Component class is truly useful for proactively handling
 *          Disconnect events from specific users without relying
 *          on the Frontend.
 *      </p>
 *
 *      <p>
 *          A practical use case is when the user's access token expires:
 *          the browser automatically redirects the user to the login page,
 *          while the user does not explicitly or actively perform
 *          a logout or sign-out action.
 *      </p>
 *
 *      <p>
 *          In the opposite scenario, when a user successfully logs in,
 *          the Component class automatically emits a signal indicating
 *          that the user has actively established a WebSocket connection.
 *      </p>
 *  </div>
 * </div>
 */

@Component
public class WebSocketEventListener {
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @EventListener
    public void handleDisconnect(SessionDisconnectEvent event) {
        Principal user = event.getUser();

        if (user != null) {
            //** 1. Remove ONLINE state
            stringRedisTemplate.delete("ws:online:" + user.getName());

            Map<String, Object> payload = new HashMap<>();
            payload.put("userId", user.getName());
            payload.put("event", "DISCONNECT");
            payload.put("isLogin",
                    stringRedisTemplate
                            .opsForValue()
                            .get("ws:online:" + user.getName()) != null
            );

            //** Send alert by Downstream thread with SendTo Broadcast socket's
            simpMessagingTemplate.convertAndSend("/topic/SUPERADMIN/notification", (Object) payload);
        }
    }

    @EventListener
    public void handleConnect(SessionConnectedEvent event) {
        Principal user = event.getUser();

        if (user != null) {
            //** 1. Save ONLINE state
            stringRedisTemplate.opsForValue().set("ws:online:" + user.getName(), "1");

            Map<String, Object> payload = new HashMap<>();
            payload.put("userId", user.getName());
            payload.put("event", "CONNECTED");
            payload.put("isLogin",
                    Objects.equals(stringRedisTemplate
                            .opsForValue()
                            .get("ws:online:" + user.getName()), "1")
            );

            //** Send alert by Downstream thread with SendTo Broadcast socket's
            simpMessagingTemplate.convertAndSend("/topic/SUPERADMIN/notification", (Object) payload);
        }
    }
}

