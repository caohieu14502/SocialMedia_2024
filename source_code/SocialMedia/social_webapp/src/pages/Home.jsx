import { useEffect, useRef, useState } from "react"
import Post from "../components/Post"
import { authApis, endpoints } from "../configs/Apis";
import { CreatePost } from "../components/CreatePost";
import { UserAuth } from "../context/AuthContext";
import InfiniteScroll from "react-infinite-scroll-component";

const Home = () => {
  const {user, } = UserAuth();
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(null)
  const endPage = useRef()
  const [isBottom, setIsBottom] = useState(false)

  const deleteHandle = async (id, index) => {
    if(confirm('Bạn có chắc muốn xoá?') == true) {
      let res= await authApis().delete(endpoints['postDetails'](id), {
          "post": id
      });
      if (res.status === 204) {
        setPosts([...posts.slice(0,index), ...posts.slice(index+1)])
      }
    }
}

  const loadPosts = async (url) => {
    try {
        let res = await authApis().get(url);
        let {results, ...rest} = res.data;
        setPage({page, ...rest})
        console.log(page)
        setPosts([...posts, ...results])
        if(page !== null)
        if(page.previous !== null)
          setIsBottom(true)
      } catch (ex) {
        console.error(ex);
    }
}
  useEffect(() => {
    let e = `${endpoints['posts']}?page=1`;
    loadPosts(e);
  }, [])

  const scrollToBottom = () => {
    if(page !== null)
    endPage.current.scrollIntoView({behavior: "smooth"})
  }

  useEffect(scrollToBottom, [isBottom])
  
  if(posts.length === 0) 
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
    <div className="containerWrap z-10">
    <InfiniteScroll
        dataLength={posts.length}
        next={()=>loadPosts(page.next)}
        hasMore={page.next!==null}
        loader={<h4>Loading...</h4>}
        endMessage={<>
          <br/>
          <div className="py-8 text-center">Bạn đã xem hết bài viết</div>
        </>}
      >
            {posts.map((p, index) =>{
              return(<Post key={p.id} post={p} user={user} deleteHandle={()=> deleteHandle(p.id, index)} />)
            }
            )}
    </InfiniteScroll>
    <div ref={endPage}></div>
    </div>
    </>
  )
}

export default Home