import React, { useState, useEffect } from 'react';

// ! ========================================================================
// ! Client ID của bạn
// ! ========================================================================
const GOOGLE_CLIENT_ID = "354001535629-966snb2gtpics3tis6c17nfshkusc5b3.apps.googleusercontent.com";

function App() {
    // State để lưu trữ idToken trực tiếp từ Google
    const [idToken, setIdToken] = useState(null);

    /**
     * Hàm callback được Google gọi sau khi đăng nhập thành công.
     * Phản hồi 'response' chứa trường 'credential', đó chính là idToken (JWT).
     */
    const handleGoogleLogin = (response) => {
        console.log('Google Response:', response);
        // Lấy trực tiếp credential (idToken) từ Google và lưu vào state
        const token = response.credential;
        setIdToken(token);
    };

    /**
     * useEffect này sẽ chạy một lần khi component được tải.
     * Nó có nhiệm vụ:
     * 1. Tải script Google Identity Services (GSI) từ CDN.
     * 2. Khởi tạo GSI client với Client ID của bạn.
     * 3. Hiển thị nút đăng nhập Google vào div#google-login-button-container.
     */
    useEffect(() => {
        // Kiểm tra xem script đã tồn tại chưa để tránh tải lại
        if (document.getElementById('google-gsi-script')) {
            return;
        }

        // Tạo thẻ <script>
        const script = document.createElement('script');
        script.id = 'google-gsi-script';
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        
        // Gắn callback 'onload' để chạy khi script tải xong
        script.onload = () => {
            if (!window.google) {
                console.error("Google script not loaded");
                return;
            }

            // 1. Khởi tạo Google ID với Client ID và hàm callback
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleGoogleLogin, // Hàm sẽ được gọi khi đăng nhập thành công
            });

            // 2. Hiển thị nút đăng nhập vào div bên dưới
            window.google.accounts.id.renderButton(
                document.getElementById('google-login-button-container'),
                { 
                    theme: 'outline', 
                    size: 'large', 
                    text: 'signin_with', // Hiển thị "Sign in with Google"
                    shape: 'rectangular',
                    logo_alignment: 'left'
                }
            );
        };
        script.onerror = () => {
            console.error("Failed to load Google GSI script");
        };
        
        // Thêm script vào <body>
        document.body.appendChild(script);

        // Cleanup: gỡ script nếu component bị unmount
        return () => {
            const scriptTag = document.getElementById('google-gsi-script');
            if (scriptTag) {
                // Bạn có thể cân nhắc việc không gỡ bỏ nếu nó không gây lỗi
                // document.body.removeChild(scriptTag);
            }
        };
    }, []); // Mảng rỗng đảm bảo useEffect chỉ chạy 1 lần

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Đăng nhập với Google</h1>
                
                {idToken ? (
                    // 2. Giao diện KHI ĐÃ ĐĂNG NHẬP (Hiển thị Token Google)
                    <div className="text-left">
                        <h2 className="text-2xl font-semibold text-green-600 mb-4">Đăng nhập Google thành công!</h2>
                        <p className="text-gray-700 mb-2 font-medium">Đây là ID Token từ Google:</p>
                        <pre className="bg-gray-900 text-white p-4 rounded-md overflow-x-auto text-xs break-all">
                            {idToken}
                        </pre>
                        <button 
                            onClick={() => setIdToken(null)}
                            className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                        >
                            Đăng xuất (Xóa Token)
                        </button>
                    </div>
                ) : (
                    // 1. Giao diện KHI CHƯA ĐĂNG NHẬP
                    <div>
                        <p className="text-gray-600 mb-6">Vui lòng đăng nhập để lấy ID Token.</p>
                        
                        {/* Container cho nút Google */}
                        <div id="google-login-button-container" className="flex justify-center">
                            {/* Nút Google sẽ được render ở đây bằng script */}
                        </div>
                        
                        {GOOGLE_CLIENT_ID.includes("YOUR_CLIENT_ID") && (
                            <div className="mt-6 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 text-left">
                                <p className="font-bold">Chưa cấu hình!</p>
                                <p className="text-sm">
                                    Bạn cần thay thế <code>YOUR_CLIENT_ID...</code> trong code bằng Google Client ID thật của bạn để nút đăng nhập hoạt động.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;