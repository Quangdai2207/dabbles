package ti.dabble.configurations.AuthSocket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;
import ti.dabble.models.principal.UserPrincipal;
import ti.dabble.services.proxy.IAuthProxyService;

/**
 * <div style="border: 1px solid white; padding: 10px; color: white; font-family: 'tahoma'">
 *  <h3 style="font-style: bold">WsAuthInterceptor Class</h3>
 *  <div style="padding-left: 20px">
 *      <p>
 *          This interceptor class is responsible for identifying and authenticating
 *          users who access the application through WebSocket connections.
 *          Since my Spring Frontend with service at dir <span style="font-weight: bold; color: #EEEE">
 *          admin [FE_Admin]</span> application acts as a BFF (Backend For Frontend), the
 *          <span style="color: #EEEE; font-weight: bold">WsAuthInterceptor</span>
 *          performs this responsibility and can accurately determine which
 *          WebSocket session belongs to which user.
 *      </p>
 *
 *      <p>
 *          Normally, the identity of a user accessing a WebSocket application
 *          is stored within the connection frame. The frontend can verify this
 *          information immediately when the WebSocket connection is established,
 *          as the <code>frame</code> parameter contains the user-related data
 *          returned from the socket connection.
 *      </p>
 *
 *      <p>
 *          If the WebSocket connection is opened directly on the core Spring Backend
 *          (server [dabble]), this interceptor may not be required.
 *      </p>
 *  </div>
 * </div>
 */

@Component
public class WsAuthInterceptor implements ChannelInterceptor {
    @Autowired
    private IAuthProxyService authProxyService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {

            String auth = accessor.getFirstNativeHeader("Authorization");

            if (auth != null && auth.startsWith("Bearer ")) {

                String token = auth.substring(7);

                UserPrincipal user = authProxyService.verify(token);

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                user.getId(),
                                null,
                                user.getAuthorities()
                        );

                accessor.setUser(authentication);
            }
        }
        System.out.println("Message interceptor >>> " + message);
        return message;
    }
}




