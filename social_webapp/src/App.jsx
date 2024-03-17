import { Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import Login from "./pages/Login"
import PrivateRoute from "./routes/PrivateRoute"
import ChatRoom from "./pages/ChatRoom"
import { AuthProvider } from "./context/AuthContext"
import Home from "./components/Home"
import { w3cwebsocket } from "websocket"
import { Notification } from "./components/Notification"
import { useEffect } from "react"

function App() {
    const user = {"id": 1}
    var client = new w3cwebsocket(`ws://127.0.0.1:8000/ws/notification/${user.id}`); //gets room_name from the state and connects to the backend server 
    const notis = []

    client.onmessage = (message) => {
        const dataFromServer = JSON.parse(message.data);
        console.log(dataFromServer)
        notis.push(dataFromServer)
    };

    // useEffect(() => {
    //   setTimeout(() => {
    //     notis.pop()
    //   }, 2000); 
    // }, [notis])

    return (
      <AuthProvider>
        <Navbar />
        <Routes>
          {notis.map((c)=>{
            <Notification noti_infor={c} />
          })}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chat" element={
            <PrivateRoute >
              <ChatRoom/>
            </PrivateRoute>
          } />
        </Routes>
      </AuthProvider>
    )
}

export default App
