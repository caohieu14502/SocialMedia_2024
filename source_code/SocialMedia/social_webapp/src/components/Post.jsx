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

const Post = ({style, post}) => {
    const [isLiked, setIsLiked] = useState(post.liked)
    var user = post.user // thực ra là 
    let image_display = "carousel-start"
    let message= "";
    switch(style) {
        case 1:
            image_display = "carousel-vertical h-96";
            break;
        case 2:
            image_display = "carousel-center";
            break;
        case 3:
            image_display = "carousel-center max-w-md p-4 space-x-4 bg-neutral";
            break;
        }

    // const likeHandle = async () => {
        // var client = await ws(ws_endpoints["notification"](user))
        // if(!isLiked)
        //    client.onopen = () => client.send(JSON.stringify({
        //         "type": "post_noti",
        //         "message": " has liked your post"
        //     }))
        // setIsLiked(!isLiked)
    // }
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
            <hr className="bg-slate-200 my-4 w-[80%]"/>
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
            <p className="font-mono">{post.content}</p>

            {/* <div className={`carousel ${image_display} rounded-box`}>
                <div className="carousel-item">
                    <img src="https://daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.jpg" alt="Drink" />
                </div> 
                <div className="carousel-item">
                    <img src="https://daisyui.com/images/stock/photo-1565098772267-60af42b81ef2.jpg" alt="Drink" />
                </div> 
                <div className="carousel-item">
                    <img src="https://daisyui.com/images/stock/photo-1572635148818-ef6fd45eb394.jpg" alt="Drink" />
                </div> 
                <div className="carousel-item">
                    <img src="https://daisyui.com/images/stock/photo-1494253109108-2e30c049369b.jpg" alt="Drink" />
                </div> 
                <div className="carousel-item">
                    <img src="https://daisyui.com/images/stock/photo-1550258987-190a2d41a8ba.jpg" alt="Drink" />
                </div> 
                <div className="carousel-item">
                    <img src="https://daisyui.com/images/stock/photo-1559181567-c3190ca9959b.jpg" alt="Drink" />
                </div> 
                <div className="carousel-item">
                    <img src="https://daisyui.com/images/stock/photo-1601004890684-d8cbf643f5f2.jpg" alt="Drink" />
                </div>
            </div> */}
            {/* <ReactAudioPlayer src={mp3_file} controls autoPlay /> */}
            <div>
                <video src={video_file} className="rounded-3xl w-[80%]" controls/>
            </div>
            <div className="flex justify-evenly w-[80%]">
                <button className="btn" onClick={likeHandle}>
                    <i className="fa-solid fa-thumbs-up" style={{color:`${isLiked?"blue":"white"}`, fontSize:'24px'}}></i>
                </button>
                <div className="btn" onClick={()=>document.getElementById(`modal_${post.id}`).showModal()}>
                <i className="fa-solid fa-comment" style={{color:'white', fontSize:'24px'}}></i>
                    <dialog id={`modal_${post.id}`} className="modal">
                        <PostDetail post={post}/>
                    </dialog>
                </div>
                <button className="btn" style={{color:'white', fontSize:'24px'}}>
                <i className="fa-regular fa-share-from-square"></i>
                </button>
            </div>
        </>
        
    )
}

export default Post