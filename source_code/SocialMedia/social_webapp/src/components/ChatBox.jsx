import { useEffect, useRef, useState } from "react";
import Message from "./Message"
import { authApis, endpoints } from "../configs/Apis";
import useWebSocket from "react-use-websocket";
import ws, { ws_endpoints } from "../configs/Sockets";

const ChatBox = ({group_id}) => {
    const [messages, setMessages] = useState([])
    const messagesEndRef = useRef()
    const { lastJsonMessage } = useWebSocket(ws(ws_endpoints["chat"](group_id)));
  
    useEffect(()=>{
        const process = async () => {
          try {
              let { data } = await authApis().get(endpoints['group_chat-messages'](group_id));
              setMessages(data)
          } catch (ex) {
              console.log(ex)
          }
      }
    
        process();
    }, [])
  
    useEffect(() => {
      if(lastJsonMessage !== null && lastJsonMessage.type==="chat") {
          setMessages([...messages, lastJsonMessage.message])
          console.log(messages)
      }
    }, [lastJsonMessage])
  
  
    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({behavior: "smooth"})
    }

    useEffect(scrollToBottom, [messages])

    return (
        <div className="pb-36 pt-20 h-[600px] mx-5 overflow-auto">
            {messages.map((mes) =>
                <Message key={mes.id} message={mes}/>
            )}
            <div ref={messagesEndRef}></div>
        </div>
    )
  }
  
  export default ChatBox