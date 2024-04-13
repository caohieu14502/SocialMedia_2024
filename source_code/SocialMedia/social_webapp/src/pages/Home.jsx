import { useEffect, useState } from "react"
import Post from "../components/Post"
import { useSearchParams } from "react-router-dom";
import { authApis, endpoints } from "../configs/Apis";
import { CreatePost } from "../components/CreatePost";
import { UserAuth } from "../context/AuthContext";

const Home = () => {
  const {user, } = UserAuth();
  const [posts, setPosts] = useState(null)
  const [q] = useSearchParams();


  useEffect(() => {
    const loadPosts = async () => {
      try {
          let e = endpoints['posts'];

          let tagId = q.get("tagId");
          if (tagId !== null && tagId !== "") {
              e = `${e}?tagId=${tagId}`;
          } else {
              let kw = q.get("kw");
              if (kw !== null && kw !== "") 
                  e = `${e}?kw=${kw}`;
          }

          let res = await authApis().get(e);
          setPosts(res.data.results)
      } catch (ex) {
          console.error(ex);
      }
  }

  loadPosts();
  }, [q])
  
  if(posts === null) 
    return <><div>Bạn chưa follow ai cả! Hãy follow để xem bài viết của họ!</div></>

  const modal_handle = (e) => {
    e.preventDefault();
    document.getElementById('my_modal_3').showModal()
  }


  return (
    <>
    <div className="px-2 containerWrap flex justify-items-center w-[60%] mt-5">
      <div className="avatar">
        <div className="w-12 rounded-full">
          <img src={user.avatar_url} />
        </div>
      </div>
      <input id="create_post" type="text"
              // onChange={e => change(e, "content")}
              onClick={modal_handle}
              className="input w-full focus:outline-none bg-gray-100 rounded-xl mx-4" placeholder={`Hey ${user.first_name}, What are you thinking?`} />
        <dialog id="my_modal_3" className="modal">
          <CreatePost/>
        </dialog>
    </div>
    <div className="containerWrap">
      {posts.map(p =>
        <Post key={p.id} style={1} post={p} />
      )}
    </div>
    </>
  )
}

export default Home