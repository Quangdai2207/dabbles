import React, { useState, useEffect, useRef, type ChangeEvent } from "react";
import axios, { type AxiosRequestConfig, AxiosError } from "axios";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

// --- 1. DEFINING INTERFACES ---

interface ApiResponse<T = any> {
    isSuccess: boolean;
    message: string;
    errorMessage: string;
    data?: T;
}

interface UserSummaryDto {
    id: string;
    name: string;
    avatar: string | null;
}

interface MessageResponseDto {
    id: string;
    content: string;
    messageType: "TEXT" | "IMAGE" | "FILE" | "SYSTEM";
    createdDate: string;
    conversationId: string;
    // [FIX] Cho phép sender có thể null (đối với tin nhắn hệ thống)
    sender: UserSummaryDto | null;
}

interface ConversationReadDto {
    conversationId: string;
    userId: string;
    lastReadAt: string;
    isRead: boolean;
}

interface ConversationResponseForChatBoxDto {
    id: string;
    name: string;
    type: "PRIVATE" | "GROUP";
    avatar: string | null;
    lastMessage: string | null;
    lastMessageAt: string | null;
    unreadMessageCount: number;
    participants: UserSummaryDto[];
}

interface TotalOfUnreadConversationAndConversationResponseForChatBoxDto {
    totalUnreadConversation: number;
    conversationResponseForChatBoxDto: ConversationResponseForChatBoxDto[];
}

interface LogEntry {
    time: string;
    title: string;
    data: any;
}

// --- 2. CONFIGURATION ---
const API_BASE_URL = "http://192.168.1.170:3366/api";
const WS_URL = "http://192.168.1.170:3366/ws";

const TestDashboard: React.FC = () => {
    // --- STATE MANAGEMENT ---

    // Ref để quản lý subscription của phòng chat hiện tại (để hủy khi đổi phòng)
    const currentSubscriptionRef = useRef<any>(null);

    const [token, setToken] = useState<string>("");
    const [currentUserEmail, setCurrentUserEmail] = useState<string>("");
    const [currentUserId, setCurrentUserId] = useState<string>("");

    const [conversations, setConversations] = useState<ConversationResponseForChatBoxDto[]>([]);
    const [totalUnread, setTotalUnread] = useState<number>(0);

    const [selectedConv, setSelectedConv] = useState<ConversationResponseForChatBoxDto | null>(null);
    const [messages, setMessages] = useState<MessageResponseDto[]>([]);
    const [lastReadByPartners, setLastReadByPartners] = useState<Record<string, string>>({});

    const [msgContent, setMsgContent] = useState<string>("");
    const [logs, setLogs] = useState<LogEntry[]>([]);

    // Refs
    const stompClientRef = useRef<Stomp.Client | null>(null);
    const selectedConvRef = useRef<ConversationResponseForChatBoxDto | null>(null);

    useEffect(() => {
        selectedConvRef.current = selectedConv;
    }, [selectedConv]);

    // --- HANDLERS ---
    const addLog = (title: string, data: any) => {
        setLogs((prev) => [
            { time: new Date().toLocaleTimeString(), title, data },
            ...prev,
        ]);
    };

    const apiCall = async <T,>(
        method: "GET" | "POST" | "PUT" | "DELETE",
        endpoint: string,
        data: any = null
    ): Promise<ApiResponse<T> | null> => {
        try {
            const config: AxiosRequestConfig = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            };
            const url = `${API_BASE_URL}${endpoint}`;
            let response;
            switch (method) {
                case "GET":
                    response = await axios.get<ApiResponse<T>>(url, config);
                    break;
                case "POST":
                    response = await axios.post<ApiResponse<T>>(url, data, config);
                    break;
            }
            if (response && response.data) return response.data;
            return null;
        } catch (error) {
            const err = error as AxiosError<ApiResponse<any>>;
            addLog(`ERROR [${method}]`, err.response?.data || err.message);
            return null;
        }
    };

    // --- WEBSOCKET ---

    const connectWebSocket = () => {
        if (!token || !currentUserId) {
            alert("Cần nhập Token và User ID trước!");
            return;
        }
        if (stompClientRef.current && stompClientRef.current.connected) return;

        const socket = new SockJS(WS_URL);
        const client = Stomp.over(socket);

        client.connect(
            { Authorization: `Bearer ${token}` },
            () => {
                addLog("WS", "Connected Successfully");
                stompClientRef.current = client;

                // 1. KÊNH CHAT UPDATES (Nhận tin nhắn & Read Receipt)
                const userTopic = `/user/queue/chat-updates`;
                client.subscribe(userTopic, (message) => {
                    const payload = JSON.parse(message.body);
                    if (payload.isRead === true) {
                        handleReadReceipt(payload);
                    } else {
                        handleIncomingMessage(payload);
                    }
                });

                // 2. KÊNH LỖI
                client.subscribe(`/user/queue/errors`, (message) => {
                    const errorPayload = JSON.parse(message.body);
                    addLog("WS ERROR RECV", errorPayload);
                    alert("Lỗi từ Socket: " + JSON.stringify(errorPayload));
                });

                addLog("WS", `Subscribed: ${userTopic}`);
            },
            (error) => {
                addLog("WS Error", error);
            }
        );
    };

    const disconnectWebSocket = () => {
        if (stompClientRef.current) {
            stompClientRef.current.disconnect(() => {});
            stompClientRef.current = null;
            addLog("WS", "Disconnected");
        }
    };

    // --- HANDLERS SOCKET ---

    const handleReadReceipt = (readDto: ConversationReadDto) => {
        addLog("WS READ", `User ${readDto.userId} đã xem`);
        if (selectedConvRef.current?.id === readDto.conversationId) {
            setLastReadByPartners((prev) => ({
                ...prev,
                [readDto.userId]: readDto.lastReadAt,
            }));
        }
        setConversations((prevConvs) => {
            const targetConv = prevConvs.find((c) => c.id === readDto.conversationId);
            if (readDto.userId === currentUserId) {
                if (targetConv && targetConv.unreadMessageCount > 0) {
                    setTotalUnread((prev) =>
                        Math.max(0, prev - targetConv.unreadMessageCount)
                    );
                }
                return prevConvs.map((c) =>
                    c.id === readDto.conversationId
                        ? { ...c, unreadMessageCount: 0 }
                        : c
                );
            }
            return prevConvs;
        });
    };

    const handleIncomingMessage = (newMessage: MessageResponseDto) => {
        if (selectedConvRef.current?.id === newMessage.conversationId) {
            setMessages((prev) => {
                if (prev.some((m) => m.id === newMessage.id)) return prev;
                return [...prev, newMessage];
            });
        }
        setConversations((prevConvs) => {
            const convIndex = prevConvs.findIndex(
                (c) => c.id === newMessage.conversationId
            );
            let updatedConv: ConversationResponseForChatBoxDto;

            // [FIX] Check null an toàn
            const senderId = newMessage.sender?.id;
            const isMyMessage = senderId === currentUserId;

            const isChattingThisConv =
                selectedConvRef.current?.id === newMessage.conversationId;

            if (convIndex !== -1) {
                const existingConv = prevConvs[convIndex];
                const newUnreadCount =
                    isChattingThisConv || isMyMessage
                        ? existingConv.unreadMessageCount
                        : existingConv.unreadMessageCount + 1;
                if (!isChattingThisConv && !isMyMessage)
                    setTotalUnread((prev) => prev + 1);
                updatedConv = {
                    ...existingConv,
                    lastMessage: newMessage.content,
                    lastMessageAt: newMessage.createdDate,
                    unreadMessageCount: newUnreadCount,
                };
                const newList = [...prevConvs];
                newList.splice(convIndex, 1);
                newList.unshift(updatedConv);
                return newList;
            } else {
                loadConversations();
                return prevConvs;
            }
        });
    };

    // --- ACTIONS (FULL SOCKET) ---

    const selectConversation = (conv: ConversationResponseForChatBoxDto) => {
        setSelectedConv(conv);
        setLastReadByPartners({});
        loadMessages(conv.id);

        // [SOCKET SEND] MARK AS READ
        if (conv.unreadMessageCount > 0 && stompClientRef.current?.connected) {
            const payload = { conversationId: conv.id };
            stompClientRef.current.send(
                "/app/chat.markAsRead",
                {},
                JSON.stringify(payload)
            );
        }

        if (stompClientRef.current?.connected) {
            // [FIX] HỦY SUBSCRIPTION CŨ TRƯỚC KHI TẠO CÁI MỚI (Tránh duplicate)
            if (currentSubscriptionRef.current) {
                currentSubscriptionRef.current.unsubscribe();
                currentSubscriptionRef.current = null;
            }

            const topic = `/topic/conversation/${conv.id}`;
            // [FIX] Lưu subscription mới vào ref
            currentSubscriptionRef.current = stompClientRef.current.subscribe(
                topic,
                (message) => {
                    const msgDto = JSON.parse(message.body);
                    if (!msgDto.isRead) handleIncomingMessage(msgDto);
                }
            );
        }
    };

    const sendMessage = () => {
        if (!selectedConv || !msgContent.trim()) return;

        if (stompClientRef.current && stompClientRef.current.connected) {
            const payload = {
                conversationId: selectedConv.id,
                content: msgContent,
            };
            stompClientRef.current.send(
                "/app/chat.sendMessage",
                {},
                JSON.stringify(payload)
            );

            addLog("WS SEND", `Msg: ${msgContent}`);
            setMsgContent("");
        } else {
            alert("Socket chưa kết nối!");
        }
    };

    const loadConversations = async () => {
        const res =
            await apiCall<TotalOfUnreadConversationAndConversationResponseForChatBoxDto>(
                "GET",
                "/conversation/conversation-of-user"
            );
        if (res?.isSuccess && res.data) {
            setConversations(res.data.conversationResponseForChatBoxDto);
            setTotalUnread(res.data.totalUnreadConversation);
        }
    };
    const loadMessages = async (convId: string) => {
        const res = await apiCall<MessageResponseDto[]>(
            "GET",
            `/chat/message-of-conversation?conversationId=${convId}`
        );
        if (res?.isSuccess && res.data) setMessages(res.data);
    };

    // Input Handlers
    const handleTokenChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
        setToken(e.target.value);
    const handleUserIdChange = (e: ChangeEvent<HTMLInputElement>) =>
        setCurrentUserId(e.target.value);
    const handleMsgContentChange = (e: ChangeEvent<HTMLInputElement>) =>
        setMsgContent(e.target.value);

    // [FIX] Hàm check đã xem an toàn
    const getReadStatus = (msg: MessageResponseDto) => {
        // Check sender tồn tại trước khi lấy id
        if (!msg.sender || msg.sender.id !== currentUserId) return null;

        const readers = Object.entries(lastReadByPartners)
            .filter(
                ([userId, time]) =>
                    userId !== currentUserId &&
                    new Date(time) >= new Date(msg.createdDate)
            )
            .map(([userId]) => userId);

        return readers.length > 0 ? (
            <span className="text-[10px] text-gray-400 mt-1 block text-right">
        ✓ Đã xem
      </span>
        ) : null;
    };

    return (
        <div className="p-4 bg-slate-100 min-h-screen font-sans text-sm">
            <h1 className="text-2xl font-bold mb-4 text-blue-700">
                Dabble Real-time (FULL SOCKET - SAFE MODE)
            </h1>

            <div className="grid grid-cols-12 gap-4">
                {/* CONFIG */}
                <div className="col-span-12 md:col-span-3 bg-white p-4 rounded shadow">
                    <h2 className="font-bold border-b mb-2 text-indigo-600">1. Config</h2>
                    <div className="mb-2">
                        <label className="block text-xs font-bold">JWT Token</label>
                        <textarea
                            className="w-full border p-1 h-12 text-xs rounded"
                            value={token}
                            onChange={handleTokenChange}
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-xs font-bold text-red-600">
                            User ID
                        </label>
                        <input
                            className="w-full border p-1 border-red-300 bg-red-50 rounded"
                            value={currentUserId}
                            onChange={handleUserIdChange}
                        />
                    </div>
                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={connectWebSocket}
                            className="flex-1 bg-blue-600 text-white py-1 rounded"
                        >
                            Connect WS
                        </button>
                        <button
                            onClick={disconnectWebSocket}
                            className="flex-1 bg-gray-500 text-white py-1 rounded"
                        >
                            Disconnect
                        </button>
                    </div>
                    <button
                        onClick={loadConversations}
                        className="w-full bg-green-600 text-white py-2 rounded font-bold"
                    >
                        Load Conversations (API)
                    </button>
                </div>

                {/* LIST */}
                <div className="col-span-12 md:col-span-3 bg-white p-4 rounded shadow flex flex-col h-[85vh]">
                    <div className="flex justify-between items-center border-b pb-2 mb-2">
                        <h2 className="font-bold text-indigo-600">Inbox</h2>
                        {totalUnread > 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {totalUnread} Unread
              </span>
                        )}
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {conversations.map((conv) => (
                            <div
                                key={conv.id}
                                onClick={() => selectConversation(conv)}
                                className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                                    selectedConv?.id === conv.id
                                        ? "bg-blue-50 border-l-4 border-blue-500"
                                        : ""
                                }`}
                            >
                                <div className="flex justify-between">
                  <span
                      className={`truncate w-3/4 ${
                          conv.unreadMessageCount > 0 ? "font-bold" : ""
                      }`}
                  >
                    {conv.name}
                  </span>
                                    {conv.unreadMessageCount > 0 && (
                                        <span className="text-[10px] bg-red-500 text-white px-1.5 rounded-full">
                      {conv.unreadMessageCount}
                    </span>
                                    )}
                                </div>
                                <div className="text-xs text-gray-500 truncate">
                                    {conv.lastMessage}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CHAT BOX */}
                <div className="col-span-12 md:col-span-3 bg-white p-4 rounded shadow flex flex-col h-[85vh]">
                    <h2 className="font-bold border-b pb-2 mb-2 text-indigo-600">
                        {selectedConv ? selectedConv.name : "Chat Box"}
                    </h2>
                    {selectedConv ? (
                        <>
                            <div className="flex-1 overflow-y-auto bg-gray-50 border rounded p-3 mb-3 space-y-2">
                                {messages.map((msg, idx) => {
                                    // [FIX] QUAN TRỌNG: Check null ở đây để tránh crash
                                    const senderId = msg.sender?.id;
                                    const isMe = senderId === currentUserId;

                                    return (
                                        <div
                                            key={idx}
                                            className={`flex flex-col ${
                                                msg.messageType === "SYSTEM"
                                                    ? "items-center"
                                                    : isMe
                                                        ? "items-end"
                                                        : "items-start"
                                            }`}
                                        >
                                            {msg.messageType === "SYSTEM" ? (
                                                <span className="text-[10px] bg-gray-200 px-2 rounded-full">
                          {msg.content}
                        </span>
                                            ) : (
                                                <div className="max-w-[85%] flex flex-col items-end">
                                                    <div
                                                        className={`p-2 rounded-lg text-sm ${
                                                            isMe
                                                                ? "bg-blue-500 text-white"
                                                                : "bg-white border"
                                                        }`}
                                                    >
                                                        {msg.content}
                                                    </div>
                                                    {getReadStatus(msg)}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    className="flex-1 border p-2 rounded"
                                    value={msgContent}
                                    onChange={handleMsgContentChange}
                                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                    placeholder="Type via socket..."
                                />
                                <button
                                    onClick={sendMessage}
                                    className="bg-blue-600 text-white px-4 rounded font-bold"
                                >
                                    Send
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-400">
                            Select conversation
                        </div>
                    )}
                </div>

                {/* LOGS */}
                <div className="col-span-12 md:col-span-3 bg-slate-900 text-green-400 p-3 rounded shadow font-mono text-xs overflow-y-auto h-[85vh]">
                    <div className="flex justify-between border-b border-gray-700 pb-2 mb-2">
                        <h2 className="font-bold text-white">Logs</h2>
                        <button
                            onClick={() => setLogs([])}
                            className="text-[10px] bg-gray-700 px-2 rounded text-white"
                        >
                            Clear
                        </button>
                    </div>
                    {logs.map((log, index) => (
                        <div key={index} className="mb-2 border-b border-gray-800 pb-1">
                            <span className="text-gray-500">[{log.time}]</span>{" "}
                            <span className="font-bold text-yellow-300">{log.title}</span>
                            {log.data && (
                                <pre className="text-gray-300 ml-2 overflow-hidden">
                  {JSON.stringify(log.data, null, 2)}
                </pre>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TestDashboard;