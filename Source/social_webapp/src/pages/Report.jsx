import Moment from "react-moment";
import PostMedia from "../components/PostMedia";
import { useEffect, useState } from "react";
import { authApis, endpoints } from "../configs/Apis";

const Report = () => {
    const [posts, setPosts] = useState(null)

    const process = async () => {
      try {
          let {data} = await authApis().get(`${endpoints['posts']}?status=report`);
          setPosts(data.results)
          console.log(data)
      } catch (ex) {
          console.log(ex)
      }
  }
    useEffect(()=>{
        process();
    }, [])

    const reportHandle = async (decs, id) => {
        let form = new FormData()
        form.append('desc', decs)
        let res= await authApis().post(endpoints['report'](id), form);
        if (res.status === 200) {
            process();
        }
    }

    if (posts === null) return('Loading')
    if (posts.length === 0) return('Không có bài báo cáo nào')


    return (
        <> 
        <div className="containerWrap">
        {
            posts.map((post) => {
                return(<>
                <hr className="bg-slate-200 my-4 w-[896px]"/>
                <div className="flex flex-col w-full pb-4">
                    <div className="grid h-20 card bg-base-300 rounded-box place-items-center">{post.status}</div> 
                </div>
            <div className="chat chat-start">
                <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                    <img alt="Tailwind CSS chat bubble component" src={post.user.avatar_url||"https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"} />
                    </div>
                </div>
                <div className="chat-header">
                    {post.user.username}
                </div>
                <time className="text-s opacity-50">
                    <Moment fromNow >
                    {post.created_date}
                    </Moment>
                    </time>
            </div>
            <div className="relative w-full z-10">
                <div className="dropdown dropdown-bottom dropdown-end absolute right-0 bottom-0 z-10">
                    <div tabIndex={0} role="button" className="btn m-1">...</div>
                    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                        <li><a onClick={()=>reportHandle('Del', post.id)}>Xoá</a></li>
                        <li><a onClick={()=>reportHandle('Skip', post.id)}>Bỏ qua</a></li>
                    </ul>
                </div>
            </div>
            <p className="font-mono">{post.content}</p>

            {post.post_media.length!==0 && post.media_type==="Video"?<><div>
                <video src={`${post.post_media[0].full_url}/${post.post_media[0].media_url}`} className="rounded-3xl w-[896px]" controls type="video/mp4"/>
                <div id="my-video-player"></div>

            </div></>:
                <PostMedia post_media={post.post_media}/>
            }
                </>)
            })
        }</div>
        </>
        
    )
}

export default Report