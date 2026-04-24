import React from 'react';
import TestDashboard from './TestDashboard'; // Đảm bảo file TestDashboard.tsx nằm trong cùng thư mục src

const App: React.FC = () => {
    return (
        // Không cần thêm class layout ở đây vì TestDashboard đã tự quản lý layout của nó
        <>
            <TestDashboard />
        </>
    );
};

export default App;