import { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { authApis, endpoints } from "../configs/Apis"
import Post from "../components/Post"
import { UserAuth } from "../context/AuthContext"

const Profile = () => {
    const {user} = UserAuth()
    const [userProfile, setUserProfile] = useState(null)
    const [posts, setPosts] = useState([])
    const params = useParams()
    const location = useLocation()
    const nav = useNavigate()

    useEffect(()=>{
        const process = async () => {
          try {
              let resUserProfile = await authApis().get(endpoints['profile'](params.userId));
              setUserProfile(resUserProfile.data)
              let resPost = await authApis().get(endpoints['userPosts'](params.userId));
              await setPosts(resPost.data)
          } catch (ex) {
              console.log(ex)
          }
      }
    
        process();
    }, [location])

    const followHandle = () => {
        const process = async () => {
            try {
                let res = await authApis().post(endpoints['follow'](params.userId), {
                    "user": params.userId
                });
                if(res.status === 200) 
                setUserProfile({...userProfile, 'followed': !userProfile.followed})
                
            } catch (ex) {
                console.log(ex)
            }

        }

        process();
    }
    const posts_view = posts.map((p, index) =>{
        return(<Post key={p.id} style={1} post={p} user={user} />);
    })

    const mesHandle = () => {
        nav('/chat',{ state: {messenger: userProfile}})
    }

    if(userProfile === null )
        return <span className="loading loading-bars loading-lg"></span>

    return(
        <>
        <div className="p-16 flex flex-col items-center">
            <div className="bg-indigo-300 rounded-t-3xl w-[80%]">
                <img className="object-none object-center w-full h-[300px] rounded-3xl " src="https://daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.jpg"/>
            </div>
            <div className="p-8 bg-white shadow rounded-b-3xl w-[80%]">
            <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="grid grid-cols-3 text-center order-last md:order-first mt-20 md:mt-0">
                <div>
                    <p className="font-bold text-gray-700 text-xl">{userProfile.total_followers}</p>
                    <p className="text-gray-400">Followers</p>
                </div>
                <div>
                    <p className="font-bold text-gray-700 text-xl">{userProfile.total_followings}</p>
                    <p className="text-gray-400">Followings</p>
                </div>
                    <div>
                    <p className="font-bold text-gray-700 text-xl">{userProfile.total_posts}</p>
                    <p className="text-gray-400">Posts</p>
                </div>
                </div>
                <div className="relative">
                <div className="w-48 h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500">
                {userProfile.avatar_url !== ""?
                <div className="avatar w-[100%]">
                <div className="w-[100%] rounded-full">
                    <img src={userProfile.avatar_url} />
                </div>
                </div>:            
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>}

                </div>
                </div>
            {user.id === userProfile.id?"":
                <div className="space-x-8 flex justify-between mt-32 md:mt-0 md:justify-center">
                    <button className={`${userProfile.followed?"bg-gray-400 hover:bg-gray-500":'bg-blue-400 hover:bg-blue-500'} text-white py-2 px-4 uppercase rounded shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5`} onClick={followHandle} >
                        {userProfile.followed?"Following": "Follow"}
                    </button>
                    <button className="text-white py-2 px-4 uppercase rounded bg-violet-700 hover:bg-violet-800 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5" onClick={mesHandle} > Message </button>
                </div>
            }
            </div>

            <div className="mt-20 text-center border-b pb-12">
                <h1 className="text-4xl font-medium text-gray-700">{userProfile.first_name + userProfile.last_name}</h1>
                <p className="font-light text-gray-600 mt-3">Bucharest, Romania</p>

                {/* <p className="mt-8 text-gray-500">Solution Manager - Creative Tim Officer</p> */}
                {/* <p className="mt-2 text-gray-500">University of Computer Science</p> */}
            </div>

            </div>

            <div className="containerWrap">
            {posts.length===0?"Chưa có bài viết nào":posts_view}
            </div>
        </div>
        </>
    )
}

export default Profile