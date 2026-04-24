/**
 * <div>
 *   <h3 style="color: white">SocketContext Object</h3>
 *
 *   <p style="color: white">
 *     The <strong>SocketContext</strong> object is responsible for listening to
 *     real-time events related to user connection sessions.
 *     This object mainly works with two core parameters:
 *     <strong style="color: #EEEE">userId</strong> and
 *     <strong style="color: #EEEE">event</strong>.
 *   </p>
 *   <p style="color: white">
 *     <strong>SocketContext</strong> consists of the following fields:
 *   </p>
 *   <ul style="margin-left: 20px; color: white">
 *     <li>
 *       <strong style="color: #EEEE">onlineUsers</strong>
 *       <p>
 *         Uses a <strong style="color: orange">HashMap</strong> to store user
 *         connection information in the form:
 *         <code>{ userId : event }</code>.
 *       </p>
 *     </li>
 *     <li>
 *       <strong style="color: #EEEE">listeners</strong>
 *       <p>
 *         A list of UI components that are listening for real-time changes
 *         in users' online status.
 *       </p>
 *     </li>
 *     <li>
 *       <strong style="color: #EEEE">setStatus</strong>
 *       <p>
 *         Updates the internal state and handles connection events
 *         received from the socket.
 *       </p>
 *     </li>
 *     <li>
 *       <strong style="color: #EEEE">isOnline</strong>
 *       <p>
 *         Allows the UI to query the current online status of a user.
 *       </p>
 *     </li>
 *     <li>
 *       <strong style="color: #EEEE">subscribe</strong>
 *       <p>
 *         Allows UI components to register themselves as event listeners.
 *       </p>
 *     </li>
 *   </ul>
 *   <div>
 *     <h4 style="color: white">Execution Flow</h4>
 *     <ul style="color: white">
 *       <li>
 *         <p>
 *           <strong style="color:#EEEE">setStatus</strong> is used to receive
 *           and process user connection events.
 *           It is placed inside the socket subscription channel that receives
 *           data from the BFF or server.
 *           In this context, it is defined in
 *           <span style="color: #EEEE; font-style: italic">main.js</span>
 *           within <strong style="color: orange">stormClient.subscribe()</strong>.
 *         </p>
 *         <p>
 *           <strong>setStatus</strong> processes events sequentially as follows:
 *         </p>
 *         <ol>
 *           <li>Determine whether the event is CONNECTED or DISCONNECTED</li>
 *           <li>Update the event information in the <code>onlineUsers</code> HashMap</li>
 *           <li>
 *             Iterate through all registered UI listeners and trigger updates
 *             for each of them
 *           </li>
 *         </ol>
 *       </li>
 *       <li>
 *         <p>
 *           After <strong>setStatus</strong> finishes updating the internal state,
 *           <strong>isOnline</strong> returns the user's connection status
 *           in real time.
 *         </p>
 *       </li>
 *       <li>
 *         <p>
 *           <strong>subscribe</strong> is used to register UI components that need
 *           to react whenever a connection event is triggered.
 *         </p>
 *       </li>
 *     </ul>
 *   </div>
 *   <div>
 *     <h4 style="color: white">Test Logic</h4>
 *     <p style="color: white">
 *       To understand the execution flow in detail, refer to the following files:
 *     </p>
 *     <ol style="color: white">
 *       <li><strong>setStatus</strong>: defined in <strong>main.js</strong></li>
 *       <li><strong>subscribe</strong>: defined in <strong>user.js</strong></li>
 *       <li><strong>isOnline</strong>: defined in <strong>user.js</strong></li>
 *     </ol>
 *   </div>
 * </div>
 */

export const socketContext = {
    onlineUsers: new Map(),
    listeners: [],

    setStatus(userId, event) {
        const isOnline = event === "CONNECTED";
        this.onlineUsers.set(userId, isOnline);

        this.listeners.forEach(cb => cb(userId, isOnline));
    },

    isOnline(user) {
        return this.onlineUsers.get(user.email) === true;
    },

    subscribe(cb) {
        this.listeners.push(cb);
    }
};
