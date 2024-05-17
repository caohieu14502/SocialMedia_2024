import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { authApis, endpoints } from "../configs/Apis"
import Post from "../components/Post"

const Searching = () => {
    const {state} = useLocation()
    const [tab, setTab] = useState('posts')
    const [search, setSearch] = useState(null)
    const [show, setShow] = useState('Không tìm thấy kết quả')
    const [loading, setLoading] = useState(true)
    const nav = useNavigate()
    const [keyword, setKeyword] = useState(state.keyword)

    const loadSearch = async () => {
        try {
            let e = endpoints[tab];
            e = `${e}?kw=${keyword}`;
  
            let res = await authApis().get(e);
            setSearch(res.data.results)
            setLoading(false)
        } catch (ex) {
            console.error(ex);
        }
    }

    const searchHandle = (e) => {
        e.preventDefault()
        setLoading(true)
        loadSearch();
      }
  

    useEffect(()=>{setLoading(true);loadSearch()}, [tab])

    useEffect( () => {
        
        if(search !==null)
        switch (tab) {
            case 'posts':
                if(search.length === 0) {
                    setShow('Không tìm thấy kết quả')
                    break;
                }
                setShow(search.map(p =>
                    <Post key={p.id} style={1} post={p} />
                  ));
                  break;
            case 'users':
                if(search.length === 0) {
                    setShow('Không tìm thấy kết quả')
                    break;
                }
                setShow(search.map(u =>
                    <>
                    <div className="navbar bg-base-100" key={u.id}>
                        <div className="flex-1">
                            <a className="btn btn-ghost text-xl" onClick={()=>nav(`/profile/${u.id}`)}>{u.username}</a>
                        </div>
                        <div className="flex-none">
                            <button className="btn btn-square btn-ghost">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>
                            </button>
                        </div>
                    </div>
                    </>
                  ));
                  break;
        }
    }, [search])

    return(
        <>
        <div className="flex justify-center items-center flex-col mt-6 mb-2">
            <div className="form-control">
                <form onSubmit={searchHandle}>
                <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" value={keyword} onChange={e => setKeyword(e.target.value)} />
                <button type="submit">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </button>
                </form>
            </div>
            <div className="flex">
            <ul className="menu bg-base-200 lg:menu-horizontal rounded-box">
                <li>
                    <a onClick={()=>setTab('posts')}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    Posts
                    <span className="badge badge-sm">99+</span>
                    </a>
                </li>
                <li>
                    <a onClick={()=>setTab('users')}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Users
                    <span className="badge badge-sm badge-warning">NEW</span>
                    </a>
                </li>
                <li>
                    <a>
                    Tags
                    <span className="badge badge-xs badge-info"></span>
                    </a>
                </li>
            </ul>
        </div>

        </div>
        {/* CONTENT PARTITION */}
        <div className="containerWrap">
            {loading?<><span className="loading loading-bars loading-lg"></span></>:show}
        </div>
        </>
    )
}

export default Searching