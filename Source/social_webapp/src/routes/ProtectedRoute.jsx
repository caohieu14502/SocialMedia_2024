import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { authApis, endpoints } from "../configs/Apis";
import { useEffect } from "react";

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({children}) => {
    const {user, dispatch} = UserAuth()
    const nav = useNavigate();
    const { pathname } = useLocation();

    useEffect(()=>{

        if (user !== null)

        authApis().get(endpoints['current-user']).catch((err)=> {
            if(err.response.status === 401 ) {
                console.log('alo')
                dispatch({
                    type: "logout",
                });
                alert("Login session time out!!!");
                nav("/login");
            }
        })

    },[pathname])

    if (user === null)
        return <Navigate to='/login' replace={true}/>
    
    return children
}
export default ProtectedRoute