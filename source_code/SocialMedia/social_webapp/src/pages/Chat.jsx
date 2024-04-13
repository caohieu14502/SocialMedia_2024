import { useEffect, useState } from "react"
import { authApis, endpoints } from "../configs/Apis"
import ChatRoom from "../components/ChatRoom"
const Chat = () => {
  const [groupChats, setGroupChats] = useState(null)
  const [groupChat, setGroupChat] = useState(null)

  useEffect(()=>{
    const process = async () => {
      try {
          let { data } = await authApis().get(endpoints['group_chats']);
          
          setGroupChats(data)
      } catch (ex) {
          console.log(ex)
      }
  }

  process();
  }, [])

  const chatbox_handle = (id) => {
    setGroupChat(<ChatRoom id={id}/>)
  }

  if(groupChats === null) return <span className="loading loading-ring loading-md"></span>

  return (
    <>
      <div className="flex h-full">
        <ul className="menu bg-base-200 w-56 rounded-box block h-full">
        {groupChats.map((f, index) => {
              return(<li key={index} onClick={()=>chatbox_handle(f.id)}><a>{f.name}</a></li>)
            })}
        </ul>
        {groupChat===null?"Chọn 1 người để nhắn tin":groupChat}
      </div>
    </>
  )
}

export default Chat