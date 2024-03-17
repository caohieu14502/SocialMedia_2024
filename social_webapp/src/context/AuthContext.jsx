import { createContext, useContext, useEffect, useState } from "react";
import { GoogleAuthProvider, onAuthStateChanged, signInWithRedirect, signOut } from "firebase/auth";
import { authFirebase } from "../firebase";

const AuthContext = createContext()

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);


    // sign in with Google
    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        signInWithRedirect(authFirebase, provider)
    }

    const signOutFireBase = () => signOut(authFirebase)

    const value = {
        currentUser,
        setCurrentUser,
        signInWithGoogle,
        signOutFireBase
    }

    // set current user
    useEffect(() => {
        const unSubcribe = onAuthStateChanged(authFirebase, (user) => {
            setCurrentUser(user)
            setLoading(false)
        })
        return unSubcribe
    }, [])


    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export const UserAuth = () => {
    return useContext(AuthContext)
}