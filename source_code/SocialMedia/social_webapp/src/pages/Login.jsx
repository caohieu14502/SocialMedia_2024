import { useState } from "react";
import { UserAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom";
import Apis, { authApis, endpoints } from "../configs/Apis";
import cookie from "react-cookies"
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  
    const nav = useNavigate()
    const {user, dispatch} = UserAuth()
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    
    const loginG =  async (tokenResponse) => {
        console.log(tokenResponse)
        cookie.save("token", {access_token: tokenResponse.credential});
        let {data} = await authApis().get(endpoints['current-user']);
        cookie.save("user", data);

        dispatch({
            "type": "login",
            "payload": data
        });
      }

    const login = (evt) => {
        evt.preventDefault();

        const process = async () => {
            let res = await Apis.post(endpoints['login'], {
                "username": username,
                "password": password,
                'client_id': "SuBIKVrz8fi0vfrClK0ylXeUHRC1fYAq4ox7xKgV",
                'client_secret': "AWfxH6mPcenfgnZJnQI6HgfcSJiTXR7wWMrAduaZVu1nLlJ7DI1bHkPXQ5hHjrF6GPRqdnNgBofUGB482wcDvOKJsoZlLB8m6Fyd9SAJsH5uj83plQEORe40dGdHXKGf",
                "grant_type": "password"
            });
            cookie.save("token", res.data);

            let {data} = await authApis().get(endpoints['current-user']);
            cookie.save("user", data);

            dispatch({
                "type": "login",
                "payload": data
            });
        }
        setLoading(true)
        process();
    }   

    if(user) nav("/")


    return (
        <>
        <div className="navbar bg-base-100 flex justify-center">
          <a className="btn btn-ghost text-3xl tracking-wide text-indigo-500 underline decoration-primary">Amotion</a>
        </div>
        <div className="hero min-h-screen bg-base-200">
          <div className="hero-content flex-col lg:flex-row-reverse">
            <div className="text-center lg:text-left w-[70%]">
              <h1 className="text-5xl font-bold text-center">Login Now !!!</h1>
              <p className="py-6 text-center">Amotion là 1 mạng xã hội để chia sẻ những khoảnh khắc tuyệt đẹp mà bạn đã capture lại. Hãy để mọi người cùng tận hưởng vẻ đẹp mà bạn đã trải nghiệm</p>
              <div className="hero-content text-center">
                  <div className="max-w-md">
                  {/* <button onClick={loginG} className="btn btn-primary">Login with Google</button> */}
                  <GoogleLogin   onSuccess={loginG} />
                  </div>
              </div>
            </div>
            <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
              <form className="card-body" onSubmit={login}>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Username</span>
                  </label>
                  <input type="text" placeholder="username" className="input input-bordered" required value={username} onChange={e => setUsername(e.target.value)} />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <input type="password" placeholder="password" className="input input-bordered" required value={password} onChange={e => setPassword(e.target.value)} />
                  <div className="flex justify-end">
                    <label className="label">
                      <a onClick={()=>nav('/register')} className="label-text-alt link link-hover">Register?</a>
                    </label>
                  </div>
                </div>
                <div className="form-control mt-6 flex justify-center">
                  {loading===true?<span className="loading loading-ring loading-md"></span>:<button className="btn btn-primary">Login</button>}
                </div>
              </form>
            </div>
          </div>
        </div>
        </>
    )
}

export default Login