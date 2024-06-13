import { useEffect } from "react";
import Navbar from "./Navbar"
import useWebSocket from 'react-use-websocket';
import ws, { ws_endpoints } from "../configs/Sockets";
import { UserAuth } from "../context/AuthContext";
import {Outlet} from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = () => {
    const {user} = UserAuth()
    const { lastJsonMessage } = useWebSocket(ws(ws_endpoints["notification"](user.id)));

    useEffect(() => {
      if(lastJsonMessage !== null && lastJsonMessage.type==="notify")
        toast(lastJsonMessage.message.content);
    }, [lastJsonMessage])
    return(
        <>
          <Navbar />
          <div>
            <ToastContainer />
          </div>
          <Outlet />
        </>
    )
}

export default Layout