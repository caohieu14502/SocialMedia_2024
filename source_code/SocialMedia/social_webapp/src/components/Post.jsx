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
                let { data } = await authApis().post(endpoints['like'](post.id), {
                    "post": post.id
                });
                
                setIsLiked(!isLiked)
            } catch (ex) {
                console.log(ex)
            }

        }

        process();
    }

    console.log(post)

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
                    <svg xmlns="http://www.w3.org/2000/svg" fill={`${isLiked?"blue":"white"}`} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                    </svg>
                </button>
                <div className="btn" onClick={()=>document.getElementById(`modal_${post.id}`).showModal()}>
                    <svg width="40px" height="40px" viewBox="0 -0.5 25 25" fill="white" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M5.5 12.9543C5.51239 14.0398 5.95555 15.076 6.73197 15.8348C7.50838 16.5936 8.55445 17.0128 9.64 17.0003H11.646C12.1915 17.0007 12.7131 17.224 13.09 17.6183L14.159 18.7363C14.3281 18.9076 14.5588 19.004 14.7995 19.004C15.0402 19.004 15.2709 18.9076 15.44 18.7363L17.1 17.0003L17.645 16.3923C17.7454 16.2833 17.8548 16.1829 17.972 16.0923C18.9349 15.3354 19.4979 14.179 19.5 12.9543V8.04428C19.4731 5.7845 17.6198 3.97417 15.36 4.00028H9.64C7.38021 3.97417 5.5269 5.7845 5.5 8.04428V12.9543Z" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M7.5 10.5002C7.5 9.94796 7.94772 9.50024 8.5 9.50024C9.05228 9.50024 9.5 9.94796 9.5 10.5002C9.5 11.0525 9.05228 11.5002 8.5 11.5002C8.23478 11.5002 7.98043 11.3949 7.79289 11.2074C7.60536 11.0198 7.5 10.7655 7.5 10.5002Z" stroke="#000000" strokeLinecap="round" strokeLinejoin="round"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M11.5 10.5002C11.5 9.94796 11.9477 9.50024 12.5 9.50024C13.0523 9.50024 13.5 9.94796 13.5 10.5002C13.5 11.0525 13.0523 11.5002 12.5 11.5002C11.9477 11.5002 11.5 11.0525 11.5 10.5002Z" stroke="#000000" strokeLinecap="round" strokeLinejoin="round"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M15.5 10.5002C15.5 9.94796 15.9477 9.50024 16.5 9.50024C17.0523 9.50024 17.5 9.94796 17.5 10.5002C17.5 11.0525 17.0523 11.5002 16.5 11.5002C15.9477 11.5002 15.5 11.0525 15.5 10.5002Z" stroke="#000000" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <dialog id={`modal_${post.id}`} className="modal">
                        <PostDetail post={post}/>
                    </dialog>
                </div>
                <button className="btn" >
                    <svg width="40px" height="40px" viewBox="-0.5 0 25 25" fill="white" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.47 4.13998C12.74 4.35998 12.28 5.96 12.09 7.91C6.77997 7.91 2 13.4802 2 20.0802C4.19 14.0802 8.99995 12.45 12.14 12.45C12.34 14.21 12.79 15.6202 13.47 15.8202C15.57 16.4302 22 12.4401 22 9.98006C22 7.52006 15.57 3.52998 13.47 4.13998Z" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>
        </>
        
    )
}

export default Post