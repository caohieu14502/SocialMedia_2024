import { useEffect } from "react";
import { UserAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom";
// import { w3cwebsocket } from "websocket";

const Login = () => {
    const nav = useNavigate()
    const {currentUser, signInWithGoogle} = UserAuth()

    // var client = new w3cwebsocket('ws://127.0.0.1:8000/ws/notification/'); //gets room_name from the state and connects to the backend server 
    
    // useEffect(() => {
    //     client.onopen = () => {
    //         console.log("WebSocket Client Connected");
    //     };
    //     client.onmessage = (message) => {
    //         const dataFromServer = JSON.parse(message.data);
    //         console.info(dataFromServer)
    //     };
    // }, [])
    
    
    const handleLogin = async () => {
      try {
        await signInWithGoogle();
      } catch (err) {
        console.log(err)
      }
    }

    useEffect(() => {
      if(currentUser) nav("/chat")
    }, [currentUser])

    return (
        <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
            <div className="max-w-md">
            <h1 className="text-5xl font-bold">Hello there</h1>
            <p className="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
            <button onClick={handleLogin} className="btn btn-primary">Login with Google</button>
            </div>
        </div>
        </div>
    )
}

export default Login