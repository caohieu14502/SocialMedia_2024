/* eslint-disable react/prop-types */
import { useState } from 'react';
import Moment from 'react-moment';
import { authApis, endpoints } from '../configs/Apis';

export const Comment = ({comment}) => {
    const [replyBox, setReplyBox] = useState(false)
    const [replies, setReplies] = useState([])
    const [content, setContent] = useState("")

    console.log(comment)

    const replyHandle = () => {
        setReplyBox(true)
    }

    const repliesHandle = () => {
        const loadReplies = async () => {
            let { data } = await authApis().get(endpoints['reply'](comment.id));
            setReplies(data);
            setContent('')
        }

        loadReplies();
    }

    const comment_handle = () => {
        const process = async () => {
            let formData = new FormData()
            formData.append("content", content)
            formData.append("comment", comment.id)
            try {
                let { data } = await authApis().post(endpoints['reply'](comment.id), formData);
                setReplies([data, ...replies])
                console.log(replies)

            } catch (ex) {
                console.log(ex)
            }

        }

        process();
    }
    return(
        <>
            <div className={`flex ${replyBox?"":"pb-9"}`}>
                <div className="avatar">
                <div className="w-8 rounded-full">
                    <img src={comment.user.avatar_url} />
                </div>
                </div>
                <div className="flex-initial w-[86%]">
                    <div className="flex flex-row pl-4 items-start">
                        <div className="text-start flex-initial inline-block">{`${comment.user.first_name} ${comment.user.last_name}` }</div>
                        <div className="pl-3 text-start">{comment.content}</div>
                    </div>
                    <div className="flex pl-4 justify-between flex-initial w-[40%] pt-1">
                        <time className="text-s opacity-50 ">
                            <Moment fromNow >
                                {comment.created_date}
                            </Moment>
                        </time>
                        <button onClick={replyHandle}>reply</button>
                    </div>
                </div>
            </div>
            {comment.count_replies < 1 || replyBox || replies.length > 0?"": <button onClick={repliesHandle}>{`View all ${comment.count_replies} replies`}</button>}
            {replies.length >0?replies.map((r)=>{
                return(      <>      
                <div className={`flex ${replyBox?"":"pb-9"} scale-75`}>
                <div className="avatar">
                <div className="w-8 rounded-full">
                    <img src={r.user.avatar_url} />
                </div>
                </div>
                <div className="flex-initial w-[86%]">
                    <div className="flex flex-row pl-4 items-start">
                        <div className="text-start flex-initial inline-block">{`${r.user.first_name} ${r.user.last_name}` }</div>
                        <div className="pl-3 text-start">{r.content}</div>
                    </div>
                    <div className="flex pl-4 justify-between flex-initial w-[40%] pt-1">
                        <time className="text-s opacity-50 ">
                            <Moment fromNow >
                                {r.created_date}
                            </Moment>
                        </time>
                    </div>
                </div>
            </div></>)
            }):""}
            {replyBox?<>                       
                <div className="flex justify-center justify-self-end items-center cursor-pointer pb-9 scale-75" >
                <input type="text" placeholder={`Reply to ${comment.user.first_name} ${comment.user.last_name}` } className="input input-bordered input-primary w-full max-w-xs" value={content} onChange={e => setContent(e.target.value)} />
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
            </div></>:""}
        </>
    )
}