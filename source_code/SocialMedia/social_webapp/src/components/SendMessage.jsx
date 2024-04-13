import { useState } from "react"
import { dbFirebase } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { UserAuth } from "../context/AuthContext";
import { authApis, endpoints } from "../configs/Apis";

const SendMessage = ({group_id}) => {
    const [value, setValue] = useState("");
    const {currentUser} = UserAuth()

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (value.trim() === "") {
            alert("You haven't type any letter yet!!")
            return
        }
        
        try {
            // const {uid, displayName, photoURL} = currentUser

            // await addDoc(collection(dbFirebase, "messages"), {
            //     text: value,
            //     name: displayName,
            //     avatar: photoURL,
            //     uid: uid,
            //     createdAt: serverTimestamp()
            // })
            await authApis().post(endpoints['group_chat-messages'](group_id), {
                "content": value,
                "group": group_id
            });

            
        } catch (error) {
            console.log(error)
        }
        setValue("");
    }

    return (
        <div className="bg-gray-200 fixed bottom-0 w-full py-10 shadow-lg">
            <form onSubmit={handleSendMessage} className="px-2 containerWrap flex">
                <input type="text" value={value} onChange={c => setValue(c.target.value)} className="input w-full focus:outline-none bg-gray-100 rounded-r-none" />
                <button type="submit" className="w-auto bg-gray-500 text-white rounded-r-lg px-5 text-sm">Send</button>
            </form>
        </div>
    )
  }
  
  export default SendMessage