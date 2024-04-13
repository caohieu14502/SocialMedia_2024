import { Navigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({children}) => {
    const {user} = UserAuth()
    if (user === null)
        return <Navigate to='/login' replace={true}/>
    return children
}
export default ProtectedRoute