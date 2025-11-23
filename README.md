## 💬 Chat App – Realtime Fullstack with Socket.IO

Ứng dụng Chat App là một hệ thống nhắn tin realtime được xây dựng trên nền tảng MERN Stack + Socket.IO, hỗ trợ chat thời gian thực, kiểm tra trạng thái online, gửi ảnh, cập nhật thông tin tài khoản và giao diện hiện đại

## ✨ Tính năng nổi bật
### 💬 1. Chat realtime (Socket.IO)

Tin nhắn gửi/nhận không cần reload trang

Tin nhắn được cập nhật liên tục giữa các người dùng đang online

### 🟢 2. Kiểm tra trạng thái online / offline

Hiển thị ai đang hoạt động theo thời gian thực

Cập nhật ngay khi người dùng đóng trình duyệt hoặc đăng nhập lại

### 🖼️ 3. Gửi ảnh trong cuộc trò chuyện

Upload ảnh tin nhắn

Lưu trữ trên Cloudinary

Xem ảnh trong UI chat

### 📝 4. Nhắn tin cá nhân (private chat)

Chat 1–1 giữa các người dùng

Lưu lại lịch sử tin nhắn

### 👤 5. Chỉnh sửa thông tin tài khoản

Đổi avatar

Đổi tên hiển thị

Cập nhật thông tin cá nhân

Cập nhật ảnh đại diện (upload Cloudinary)

### 🎨 6. Giao diện người dùng hiện đại

TailwindCSS v4 + DaisyUI

UI theo kiểu Messenger / Zalo

Responsive trên mobile & desktop

Dark/Light mode (nếu bạn muốn thêm)

### 🔐 7. Hệ thống xác thực

Đăng ký / đăng nhập

Hash mật khẩu bằng bcryptjs

Lưu token bằng cookie (HTTP-only)

Middleware bảo vệ route backend


---
## 🔧 Cài đặt & chạy dự án
---
### 1️⃣ Backend

- cd backend
- npm install
- npm run dev

#### Tạo file .env:

PORT=5000
MONGO_URL=your-mongodb-url
JWT_SECRET=your-secret
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
CLIENT_URL=http://localhost:5173

---
### 2️⃣ Frontend

- cd frontend
- npm install
- pm run dev

#### end!