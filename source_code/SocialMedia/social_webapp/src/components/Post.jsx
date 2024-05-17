/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import ReactAudioPlayer from "react-audio-player"
import mp3_file from "../assets/audios/coduyenkhongno.mp3"
import video_file from "../assets/videos/react1.mp4"
import { useState } from "react"
import ws, { ws_endpoints } from "../configs/Sockets"
import { PostDetail } from "./PostDetail"
import { authApis, endpoints } from "../configs/Apis"
import Moment from 'react-moment';
import PostMedia from "./PostMedia"

const Post = ({post, user, deleteHandle}) => {
    const [isLiked, setIsLiked] = useState(post.liked)

    const reportHandle = async () => {
        console.log('Oke')
    }
    const likeHandle = () => {
        const process = async () => {
            try {
                let res= await authApis().post(endpoints['like'](post.id), {
                    "post": post.id
                });
                if (res.status === 200) setIsLiked(!isLiked)
            } catch (ex) {
                console.log(ex)
            }

        }

        process();
    }

    return (
        <>
            <hr className="bg-slate-200 my-4 w-[896px]"/>
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
                        {post.user.id===user.id?<li><a onClick={deleteHandle}>Xoá</a></li>:<li><a onClick={reportHandle}>Report</a></li>}
                        
                        <li><a>Develope later</a></li>
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
            <br/>
            <div className="flex justify-around">
                <span>{post.count_likes}
                <i className="fa-solid fa-thumbs-up text-blue-700"></i>
                </span>
                <div>.</div>
                <span>
                    {post.count_comments}
                    <i className="fa-solid fa-comment" style={{color:'white', fontSize:'20px'}}></i>
                </span>
            </div>
            <hr className="pb-4"/>
            <div className="flex justify-evenly w-[896px] border-r-amber-200">
                <button className="btn" onClick={likeHandle}>
                    <i className="fa-solid fa-thumbs-up" style={{color:`${isLiked?"blue":"white"}`, fontSize:'20px'}}></i> <span style={{color:`${isLiked?"blue":"white"}`}}>Like</span>
                </button>
                <div className="btn" onClick={()=>document.getElementById(`modal_${post.id}`).showModal()}>
                <i className="fa-solid fa-comment" style={{color:'white', fontSize:'20px'}}></i>
                    <dialog id={`modal_${post.id}`} className="modal">
                        <PostDetail post={post}/>
                    </dialog>
                    Comment
                </div>
                <button className="btn" >
                <i className="fa-regular fa-share-from-square" style={{color:'white', fontSize:'20px'}}></i> Share
                </button>
            </div>
        </>
        
    )
}

export default Post