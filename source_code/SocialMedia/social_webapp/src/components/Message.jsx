import { UserAuth } from "../context/AuthContext"

/* eslint-disable react/prop-types */
const Message = (props) => {
    console.log(props)
    const message = props.message

    const {user} = UserAuth()
    return (
        <>
            <div className={`chat ${message.user.id===user.id?"chat-end":"chat-start"}`}>
                <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                    <img alt="Tailwind CSS chat bubble component" src={message.user.avatar_url} />
                    </div>
                </div>
                <div className="chat-header">
                    {message.user.username}
                    <time className="text-xs opacity-50">{message.created_at}</time>
                </div>
                <div className="chat-bubble">{message.content}</div>
                <div className="chat-footer opacity-50">
                    Delivered
                </div>
            </div>
        </>
    )
}
export default Message