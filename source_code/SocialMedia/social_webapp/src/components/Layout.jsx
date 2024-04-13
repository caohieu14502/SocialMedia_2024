import { useEffect, useState } from "react";
import Navbar from "./Navbar"
import { Notification } from "../components/Notification";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import ws, { ws_endpoints } from "../configs/Sockets";
import { UserAuth } from "../context/AuthContext";
import {Outlet} from "react-router-dom"

const Layout = () => {
    const {user} = UserAuth()
    const [notis, setNotis] = useState([])
    const { lastJsonMessage } = useWebSocket(ws(ws_endpoints["notification"](user.id)));
  
  
    useEffect(() => {
      console.log(`Got a new message: ${lastJsonMessage}`)
      console.log(lastJsonMessage)
      if(lastJsonMessage !== null && lastJsonMessage.type==="notify")
      setNotis([...notis, {...lastJsonMessage, "time-left":2}])
      console.log(notis)
    }, [lastJsonMessage])
  
  
    useEffect(() => {
      setTimeout(() => {
        if (notis.length > 0)
        setNotis([...notis.slice(1, notis.length)])
      }, 6000); 
    }, [notis])
  
    const timer_handle = (time, index) => {
        time = time - 1
        if (time === 0)
          setNotis([...notis.slice(1)])
    }

    return(
        <>
        <Navbar />
        <div className="absolute w-[100%]">
        <div className="flex items-end flex-col absolute right-4">
            {notis.length<0?"":notis.map((c, index)=>{
            return(<Notification key={index} noti_infor={c} time={3} />)
            })} 
        </div>
        </div>

        <Outlet />
        </>
    )
}

export default Layout