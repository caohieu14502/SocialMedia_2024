/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import video_file from "../assets/videos/react1.mp4"
import  {Comment} from "./Comment"
import { authApis, endpoints } from "../configs/Apis";

export const PostDetail = ({post}) => {
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState("")

    useEffect(() => {

        const loadComments = async () => {
            let { data } = await authApis().get(endpoints['comments'](post.id));
            setComments(data);
        }

        loadComments();
    }, []);

    const comment_handle = () => {
        const process = async () => {
            let formData = new FormData()
            formData.append("content", content)
            formData.append("post", post.id)
            try {
                let { data } = await authApis().post(endpoints['comments'](post.id), formData);
                
                setComments([data, ...comments])
            } catch (ex) {
                console.log(ex)
            }

        }

        process();
    }
    
    return(
        <>
        {/* You can open the modal using document.getElementById('ID').showModal() method */}
            <div className="modal-box cursor-default w-11/12 max-w-5xl h-5/6">
                <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <div className="flex flex-row max-w-full max-h-full">
                    <div className="basis-1/2 flex justify-center h-[572px] items-center flex-initial">
                        <div className="w-full">
                            <video src={video_file} className="rounded-3xl w-[98%]" controls/>
                        </div>
                    </div>
                    <div className="basis-1/2">
                        <div>
                            <div className="chat chat-start">
                                <div className="chat-image avatar">
                                    <div className="w-10 rounded-full">
                                    <img alt="Tailwind CSS chat bubble component" src={post.user.avatar_url} />
                                    </div>
                                </div>
                                <div className="chat-header">
                                    {post.user.username}
                                </div>
                                <time className="text-s opacity-50 pl-4">12:45</time>
                            </div>
                            <div></div>
                            <p className="font-mono text-left">{post.content}</p>
                            <hr className="bg-slate-200 my-4 w-[80%]"/>
                        </div>
                        {comments===null?"":comments.map(c => {
                                return(<Comment key={c.id} comment={c}/>)
                        })}

                        <div className="flex justify-center justify-self-end items-center cursor-pointer">
                            <input type="text" placeholder="Drop your comment" className="input input-bordered input-primary w-full max-w-xs" value={content} onChange={e => setContent(e.target.value)} />
                            <div className="pl-4" onClick={comment_handle}>
                                <svg fill="blue"  height="30px" width="30px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" 
                                    viewBox="0 0 512.001 512.001" xmlSpace="preserve">
                                <path d="M1.398,431.634l21.593-89.001c3.063-12.622,11.283-23.562,22.554-30.015l83.684-47.915
                                    c6.723-3.849,6.738-13.546,0-17.403l-83.685-47.915c-11.271-6.453-19.491-17.392-22.554-30.014L1.398,80.368
                                    C-7.908,42.012,30.961,9.702,66.967,25.834l416.96,186.83c37.455,16.782,37.407,69.913,0.001,86.675L66.967,486.168
                                    C30.933,502.312-7.892,469.921,1.398,431.634z"/>
                                <path d="M483.927,212.665L256.011,110.541v290.923L483.929,299.34
                                    C521.334,282.578,521.383,229.446,483.927,212.665z"/>
                                <path d="M186.997,329.76c-4.231-9.44-0.006-20.523,9.434-24.752l109.37-49.006l-109.37-49.006
                                    c-9.44-4.229-13.665-15.312-9.434-24.752c4.229-9.44,15.309-13.666,24.752-9.434l147.519,66.1c14.727,6.598,14.739,27.583,0,34.186
                                    l-147.519,66.1C202.311,343.423,191.229,339.205,186.997,329.76z"/>
                                <path d="M359.268,238.908L256.01,192.64v41.05l49.791,22.311l-49.791,22.311v41.05l103.258-46.268
                                    C374.006,266.491,373.995,245.507,359.268,238.908z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}