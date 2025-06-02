# 🎥 WebRTC Video Call App

A simple peer-to-peer video calling app built using **React**, **Socket.IO**, and **WebRTC**, now fully Dockerized for easy setup and deployment.

---

## 🚀 Features

- One-on-one video calling
- Real-time signaling with Socket.IO
- WebRTC offer/answer and negotiation handling
- Dockerized frontend and backend
- Uses Vite for fast React development

---

## 🐳 Getting Started (with Docker)

### 1. **Clone the Repository**

```bash
git clone https://github.com/your-username/video-call-app.git
cd video-call-app
```

### 2. **Project Structure**

```
video-call-app/
├── client/             # React + Vite frontend
│   └── Dockerfile
├── server/             # Node.js + Socket.IO backend
│   └── Dockerfile
├── docker-compose.yml
```

---

### 3. **Run the App**

```bash
docker-compose up --build
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:8800](http://localhost:8800) (Socket.IO server)

---

### 4. **Usage**

1. Open [http://localhost:3000](http://localhost:3000)
2. Enter a user ID and room ID in the URL (e.g., `/video/123/room456`)
3. Share the URL with someone else using a different user ID
4. One user clicks "Call Others" to start the video call

---

## 🛠 Tech Stack

- **Frontend:** React, Vite, React Player, TailwindCSS
- **Backend:** Node.js, Socket.IO
- **P2P Engine:** WebRTC
- **Containerization:** Docker, Docker Compose

---

## 📦 Environment Notes

- No `.env` file is needed by default.
- Modify `client/src/hooks/useSocket.js` to point to Docker service name:

```js
// client/src/hooks/useSocket.js
export const socket = io('http://server:8800');
```

---

## 🧱 Future Enhancements

- ✅ Group video calling (SFU or mesh network)
- ✅ In-call chat
- ✅ Screen sharing
- ✅ User auth (JWT/Firebase)
- ✅ Call recording

---

## 🧼 Cleanup

To stop and remove containers:

```bash
docker-compose down
```

---

## 📝 License

MIT © 2025

---

Let me know if you’d like badges, CI/CD setup, or a deploy button added!
