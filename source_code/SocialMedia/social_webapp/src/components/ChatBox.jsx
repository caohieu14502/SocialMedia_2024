import { useEffect, useRef, useState } from "react";
import Message from "./Message"
import { authApis, endpoints } from "../configs/Apis";

const ChatBox = ({group_id}) => {
    const [messages, setMessages] = useState([])
    const messagesEndRef = useRef()

    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({behavior: "smooth"})
    }

    useEffect(scrollToBottom, [messages])

    // useEffect(() => {
    //     const q = query(
    //         collection(dbFirebase, "messages"), // messages la collection id
    //         orderBy("createdAt"),
    //         limit(50)
    //     );
    //     const unsubscribe = onSnapshot(q, (querySnapshot) => {
    //         const messages = [];
    //         querySnapshot.forEach((doc) => {
    //             messages.push({...doc.data(), id: doc.id});
    //         });
    //         setMessages(messages)
    //     });

    //     return () => unsubscribe
    // }, [])

    useEffect(()=>{
        const process = async () => {
          try {
              let { data } = await authApis().get(endpoints['group_chat-messages'](group_id));
              
              setMessages(data)
              console.log(data)
          } catch (ex) {
              console.log(ex)
          }
    
      }
    
      process();
      }, [])

    return (
        <div className="pb-4 pt-20 containerWrap">
            {messages.map((mes) =>
                <Message key={mes.id} message={mes}/>
            )}
            <div ref={messagesEndRef}></div>
        </div>
    )
  }
  
  export default ChatBox