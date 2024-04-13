/* eslint-disable react/prop-types */
import Moment from 'react-moment';

export const Comment = ({comment}) => {
    return(
        <>
            <div className="flex pb-9">
                <div className="avatar">
                <div className="w-8 rounded-full">
                    <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
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
                        <button>reply</button>
                    </div>
                </div>
            </div>
        </>
    )
}