import { useEffect, useRef, useState } from "react";
import Message from "./Message"
import { collection, query, onSnapshot, orderBy, limit } from "firebase/firestore";
import { dbFirebase } from "../firebase";

const ChatBox = () => {
    const [messages, setMessages] = useState([])
    const messagesEndRef = useRef()

    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({behavior: "smooth"})
    }

    useEffect(scrollToBottom, [messages])

    useEffect(() => {
        const q = query(
            collection(dbFirebase, "messages"), // messages la collection id
            orderBy("createdAt"),
            limit(50)
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const messages = [];
            querySnapshot.forEach((doc) => {
                messages.push({...doc.data(), id: doc.id});
            });
            setMessages(messages)
        });

        return () => unsubscribe
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