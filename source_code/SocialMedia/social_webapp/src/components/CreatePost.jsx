import { useRef, useState } from "react";
import { authApis, endpoints } from "../configs/Apis";

export const CreatePost = () => {
    const [images, setImages] = useState([])
    const [video, setVideo] = useState(null)
    const uploaded_image = useRef();
    const [file, setFile] = useState(null)
    const [post, setPost] = useState({
        "content": "",
        "media_type": "Images",
    });
    // const avatar = useRef();
    const [loading, setLoading] = useState(false);

    const onImageChange = (event) => {
        const files = event.target.files 
        let extension = files[0].type
        let new_images = [] 
        let new_files = []
        if (files)
            Array.from(files).forEach(f => { 
        new_images.push(URL.createObjectURL(f))
        new_files.push(f)
        })
        setFile(files)
        console.log(extension)
        if(extension === "video/mp4") {
            setPost({...post, media_type: "Video"})
            setVideo(new_images[0])
        }
        else
            setImages([...images, ...new_images]); 
    }

    const preview = (
        <section>
          {video===null?images.map((img, index) =>
              <img src={img} key={index} />
          ):
          <>
            <video src={video} className="rounded-3xl w-full" controls type="video/mp4"/>
            <div id="my-video-player"></div>
          </>
          }
        </section>
    )

    const clearHandle = () => {
        setImages([])
        setVideo(null)
        setPost({
        "content": "",
        "media_type": "Images",
    })
        setLoading(false)
    }

    const post_handle = (e) => {
        e.preventDefault();
        const process = async () => {
            let formData = new FormData();
            
            for (let field in post)
                formData.append(field, post[field]);

            
            Array.from(file).forEach(f => { 
                formData.append("uploaded_images", f);
            })

            console.log(formData)

            setLoading(true)
            let res = await authApis().post(endpoints['posts'], formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res.status === 201) {
                document.getElementById('close').click()
            }
        }
        process();
    }

    return(
        <>
        {/* You can open the modal using document.getElementById('ID').showModal() method */}
        <div className="modal-box" overflow='scroll'>
            <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" id="close">✕</button>
            </form>
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-12" onClick={clearHandle}>Clear</button>
            <h3 className="font-bold text-lg">Create New Post</h3>
            <form className="p-4 md:p-5">
                <div className="grid gap-4 mb-4 grid-cols-2">
                    <div className="col-span-2">
                        <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Content</label>
                        <textarea id="description" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={post.content} onChange={e => setPost({...post, content: e.target.value})} placeholder="Write your caption here!"></textarea>                    
                    </div>
                </div>
                {preview}
                <div className="flex justify-between">
                    <label htmlFor="upload-photo" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                        Add new images
                    </label>
                    <input type="file" id="upload-photo" multiple onChange={onImageChange} ref={uploaded_image} className="opacity-0 absolute -z-1" accept="image/png, image/gif, image/jpeg"/>
                    <label htmlFor="upload-video" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                        Add new Video
                    </label>
                    <input type="file" id="upload-video" onChange={onImageChange} ref={uploaded_image} className="opacity-0 absolute -z-1" accept="video/mp4"/>
                </div>
                <div></div>
                <div className="p-4">
                    {loading===true?<span className="loading loading-ring loading-md"></span>:<button className="btn btn-primary absolute right-[3rem] min-w-[100px] text-lg" onClick={post_handle} >Post</button>}
                </div>
            </form>
        </div>
        </>
    )
}