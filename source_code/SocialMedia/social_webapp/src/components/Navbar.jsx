import { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext"
import { useLocation, useNavigate } from "react-router-dom";
import { authApis, endpoints } from "../configs/Apis";

const Navbar = () => {
    const [keyword, setKeyword] = useState("");
    const {user, dispatch} = UserAuth();
    const [notis, setNotis] = useState(null)
    const location = useLocation();
    const nav = useNavigate();
    const handleLogout = async () => {
      try {
        if(user)
            dispatch({
              type: "logout",
            });
            nav("/login");
      } catch (err) {
        console.log(err)
      }
    }

    const loadNotis = async () => {
      try {
        let res = await authApis().get(endpoints['notifies']);
        setNotis(res.data);
      } catch (ex) {
        console.error(ex);
    }
    }

    useEffect(()=> {
      loadNotis();
    }, [])

    const searchHandle = (e) => {
      e.preventDefault()
      setKeyword('')
      nav('/searching', { state: { keyword: keyword } });
    }

    const postNoti = async (n) => {
      console.log(n)
      let res = await authApis().patch(endpoints['notifyDetail'](n.id), {
        'seen':true
      });
      console.log(res)
      setNotis(null)
      loadNotis();
      if (location.pathname.includes('/posts/')) // Already at desired post
      nav(location.pathname.substring(0, -1)+n.post.id)
      nav(`/posts/${n.post.id}`)
    }

    return (
      <div className="sticky top-0 z-10 navbar bg-base-100">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li><a>Hi, {user.username}</a></li>
              <li onClick={()=>nav(`/profile/${user.id}`)}><a>Portfolio</a></li>
              <li><a onClick={()=>nav("/chat")}>Chattin</a></li>
              {user.username==='admin'?<li><a onClick={()=>nav("/report")}>View Reports</a></li>:""}
              <li>{user?<button onClick={handleLogout}>Log out</button>:""}</li>
            </ul>
          </div>
        </div>
        <div className="navbar-center" onClick={()=>nav("/")}>
          <a className="btn btn-ghost text-3xl tracking-wide text-indigo-500 underline decoration-primary" >Amotion</a>
        </div>
        <div className="navbar-end">
          <div className="form-control">
            <form onSubmit={searchHandle}>
              <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" value={keyword} onChange={e => setKeyword(e.target.value)} />
              <button type="submit">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
            </form>
          </div>
          <div className="dropdown dropdown-end">
          <button tabIndex={0} className="btn btn-ghost btn-circle">
            <div className="indicator">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span className="badge badge-xs badge-primary indicator-item"></span>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-64 mt-8">
                {notis===null?'Loading':notis.length===0?'Chưa có thông báo':
                  notis.map((n)=> {
                    console.log(n)
                    return(
                      <li key={n.id} ><a className={n.seen===true?``:"bg-slate-500"} onClick={()=>postNoti(n)}>{`Có ${n.count} tương tác trên bài viết '${n.post.content}'`}</a></li>
                  )
                  })
                }
              </ul>
            </div>
          </button>
            </div>
        </div>
      </div>
    )
}

export default Navbar