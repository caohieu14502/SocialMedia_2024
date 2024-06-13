import { useEffect, useState } from "react"
import { authApis, endpoints } from "../configs/Apis"
import ChatRoom from "../components/ChatRoom"
import { useLocation } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
const Chat = () => {
  const {state} = useLocation();
  const {user} = UserAuth()
  const [groupChats, setGroupChats] = useState(null)
  const [groupChat, setGroupChat] = useState(null)
  const [reload, setReload] = useState(false)

  useEffect(()=>{
    const process = async () => {
      try {
          let { data } = await authApis().get(endpoints['group_chats']);
          setGroupChats(data)
          console.log(data)
          if(state!==null) {
            let res = await authApis().post(endpoints['group_chats'], {
              "name": "Duo",
              "members": [
                state.messenger.id,
                user.id
              ]
            });
            setGroupChat({groupChat: <ChatRoom id={res.data.id} key={res.data.id}/>})
            setReload(true)
          }
      } catch (ex) {
          console.log(ex)
      }
  }

  process();
  }, [reload])

  const chatbox_handle = (id) => {
    console.log('running')
    if(groupChat !== null) {
      console.log('gc khac null')
      setGroupChat(null)
    }
    console.log(groupChat)
    setGroupChat({groupChat: <ChatRoom id={id} key={id}/>})
  }

  if(groupChats === null) return <span className="loading loading-ring loading-md"></span>

  return (
    <>
      <div className="flex h-full overflow-hidden">
        <ul className="menu bg-base-200 w-56 rounded-box block h-full">
        {groupChats.map((f, index) => {
              return(<li key={f.id} onClick={()=>chatbox_handle(f.id)}><a>{f.name==='Duo'?f.members_info.username:f.name}</a></li>)
            })}
        </ul>
        {groupChat===null?"Chọn 1 người để nhắn tin":groupChat['groupChat']}
      </div>
    </>
  )
}

export default Chat