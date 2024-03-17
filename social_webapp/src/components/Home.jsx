import { useState } from "react"
import Post from "./Post"

const Home = () => {
  const [post, setPost] = useState({
    "content": "",

  })

  const change = (e, field) => {
    setPost(current => {
        return {...current, [field]: e.target.value};
    })
  }

  return (
    <>
    <div className="px-2 containerWrap flex justify-items-center w-[60%] mt-5">
      <div className="avatar">
        <div className="w-12 rounded-full">
          <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
        </div>
      </div>
      <input type="text" value={post.content} onChange={e => change(e, "content")} className="input w-full focus:outline-none bg-gray-100 rounded-xl mx-4" placeholder="focus to open a modal" />
      <button className="btn text-xl text-white btn-primary rounded-full">Post</button>
    </div>
    <div className="containerWrap">
      <Post style={1}/>
      {/* <Post style={2}/>
      <Post style={3}/>
      <Post style={4}/> */}
    </div>
    </>
  )
}

export default Home