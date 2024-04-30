import { Navigate, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { authApis, endpoints } from "../configs/Apis";

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({children}) => {
    const {user, dispatch} = UserAuth()
    const nav = useNavigate();

    if (user === null)
        return <Navigate to='/login' replace={true}/>
    
    const res = authApis().get(endpoints['current-user']);
    if(res.status === 401 )
        dispatch({
            type: "logout",
        });
        nav("/login");
    
    return children
}
export default ProtectedRoute