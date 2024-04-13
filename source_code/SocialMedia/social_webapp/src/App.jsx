import { Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import { AuthProvider } from "./context/AuthContext"
import Home from "./pages/Home"
import Register from "./pages/Register"
import ProtectedRoute from "./routes/ProtectedRoute"
import Layout from "./components/Layout"
import Chat from "./pages/Chat"

function App() {
    return (
      // <MyUserContext.Provider value={[user, dispatch]}>
      <AuthProvider>
        <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }> 
              <Route path="" element={<Home />} />
              <Route path="/posts/:postId" element={<Home />} />
              <Route path="/chat" element={ <Chat/> } />
            </Route>
          <Route path="/login" element={<Login />}  />
          <Route path="/register" element={<Register />} />
        </Routes>
      </AuthProvider>
      // </MyUserContext.Provider>
    )
}

export default App
