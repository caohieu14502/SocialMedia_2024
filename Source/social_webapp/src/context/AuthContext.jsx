import { createContext, useContext, useReducer } from "react";
import MyUserReducer from "../reducers/MyUserReducer";
import cookie from "react-cookies";

const AuthContext = createContext()

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({children}) => {
    //new
    const [user, dispatch] = useReducer(MyUserReducer, cookie.load("user") || null);

    return (
        <AuthContext.Provider value={{user, dispatch}}>
            {children}
        </AuthContext.Provider>
    )
}

export const UserAuth = () => {
    return useContext(AuthContext)
}