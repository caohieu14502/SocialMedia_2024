import ReactAudioPlayer from "react-audio-player"
import mp3_file from "../assets/audios/coduyenkhongno.mp3"
import video_file from "../assets/videos/react1.mp4"
import { useState } from "react"
import { w3cwebsocket } from "websocket"

const Post = ({style}) => {
    const [isLiked, setIsLiked] = useState(false)
    var user ={"id": 1} // thực ra là post.user.id
    var client = new w3cwebsocket(`ws://127.0.0.1:8000/ws/notification/${user.id}`); //gets room_name from the state and connects to the backend server 
    let image_display = "carousel-start"
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
    client.onopen = () => {
        console.log("WebSocket Post Connected");
    }

    const likeHandle = () => {
        if(!isLiked)
            client.send(JSON.stringify({
                "type": "post_noti",
                "message": "Cao Hieu has liked your post"
            }))
        setIsLiked(!isLiked)
    }

    client.onmessage = (message) => {
        const dataFromServer = JSON.parse(message.data);
        console.info(dataFromServer)
    };

    return (
        <>
            <hr className="bg-slate-200 my-4 w-[80%]"/>
            <div className="chat chat-start">
                <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                    <img alt="Tailwind CSS chat bubble component" src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                    </div>
                </div>
                <div className="chat-header">
                    Obi-Wan Kenobi
                </div>
                <time className="text-s opacity-50 pl-4">12:45</time>
            </div>
            <p className="font-mono">Màu ảnh đẹp quá nè mấy bạn ơi !!!</p>

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
            <button className="btn" onClick={likeHandle}>
                <svg xmlns="http://www.w3.org/2000/svg" fill={`${isLiked?"blue":"none"}`} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                </svg>
            </button>

        </>
        
    )
}

export default Post