import ChatBox from "../components/ChatBox"
import SendMessage from "../components/SendMessage"
const ChatRoom = ({id}) => {
  return (
    <>
        <div className="flex-1">
        <div>
          <ChatBox group_id={id}/>
          <SendMessage group_id={id} />
        </div>
      </div>
    </>
  )
}

export default ChatRoom