import { UserAuth } from "../context/AuthContext"

/* eslint-disable react/prop-types */
const Message = ({ message }) => {
    const {currentUser} = UserAuth()
    return (
        <>
            <div className={`chat ${message.uid===currentUser.uid?"chat-end":"chat-start"}`}>
                <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                    <img alt="Tailwind CSS chat bubble component" src={message.avatar} />
                    </div>
                </div>
                <div className="chat-header">
                    {message.name}
                    <time className="text-xs opacity-50">12:45</time>
                </div>
                <div className="chat-bubble">{message.text}</div>
                <div className="chat-footer opacity-50">
                    Delivered
                </div>
            </div>
        </>
    )
}
export default Message