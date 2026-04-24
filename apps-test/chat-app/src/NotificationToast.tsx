import React, { useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

// Interface nhận callback
interface Props {
    token: string;
    onNewNotification?: () => void;
}

const getEmailFromToken = (token: string) => {
    if (!token) return null;
    try {
        const cleanToken = token.replace('Bearer ', '').trim();
        const parts = cleanToken.split('.');
        if (parts.length !== 3) return null;
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
        return JSON.parse(jsonPayload).sub;
    } catch (e) { return null; }
};

const NotificationToast: React.FC<Props> = ({ token, onNewNotification }) => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const stompClientRef = useRef<Stomp.Client | null>(null);
    const processedIdsRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        if (!token) return;
        const userEmail = getEmailFromToken(token);
        if (!userEmail) return;

        const socket = new SockJS('http://localhost:3366/ws'); // Check PORT
        const client = Stomp.over(socket);
        client.debug = () => {};

        stompClientRef.current = client;

        client.connect({}, () => {
            if (stompClientRef.current !== client) {
                client.disconnect(() => {});
                return;
            }

            console.log(`🔔 Noti Connected: ${userEmail}`);
            const topic = `/topic/notifications/${userEmail}`;

            client.subscribe(topic, (output) => {
                const noti = JSON.parse(output.body);

                // Chống trùng
                if (processedIdsRef.current.has(noti.id)) return;
                processedIdsRef.current.add(noti.id);

                // 1. HIỆN THÔNG BÁO
                const newNoti = { ...noti, key: Date.now() };
                setNotifications(prev => [...prev, newNoti]);
                setTimeout(() => {
                    setNotifications(prev => prev.filter(n => n.key !== newNoti.key));
                }, 5000);

                // 2. GỌI CALLBACK ĐỂ RELOAD LIST BÊN NGOÀI
                if (onNewNotification) {
                    onNewNotification();
                }
            });
        });

        return () => {
            if (stompClientRef.current === client) {
                stompClientRef.current = null;
                if (client.connected) client.disconnect(() => {});
                else if (socket.readyState !== WebSocket.CLOSED) socket.close();
            }
        };
    }, [token]);

    return (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999 }}>
            {notifications.map(n => (
                <div key={n.key} style={{
                    backgroundColor: '#222', color: '#fff', padding: '15px', marginBottom: '10px',
                    borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', borderLeft: '5px solid #28a745',
                    minWidth: '250px', animation: 'slideIn 0.3s ease-out'
                }}>
                    <div style={{fontWeight: 'bold', marginBottom: '5px'}}>🔔 {n.title}</div>
                    <div style={{fontSize: '13px', color: '#ccc'}}>{n.content}</div>
                </div>
            ))}
            <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
        </div>
    );
};

export default NotificationToast;