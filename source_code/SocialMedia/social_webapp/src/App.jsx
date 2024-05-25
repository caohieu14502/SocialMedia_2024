import { Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import { AuthProvider } from "./context/AuthContext"
import Home from "./pages/Home"
import Register from "./pages/Register"
import ProtectedRoute from "./routes/ProtectedRoute"
import Layout from "./components/Layout"
import Chat from "./pages/Chat"
import Profile from "./pages/Profile"
import { GoogleOAuthProvider } from '@react-oauth/google';
import MyComponent from "./pages/Testing"
import Searching from "./pages/Searching"
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import PostDetail from "./pages/PostDetail"
import Report from "./pages/Report"


function App() {

    return (
      <AuthProvider>
        <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }> 
              <Route path="" element={<Home />} />
              <Route path="/posts/:postId" element={<PostDetail />} />
              <Route path="/chat" element={ <Chat/> } />
              <Route path="/searching" element={ <Searching /> } />
              <Route path="/testing" element={ <MyComponent/> } />
              <Route path="/report" element={ <Report/> } />
              <Route path="/profile/:userId" element={ <Profile/> } />
            </Route>
          <Route path="/login" element={
            <GoogleOAuthProvider clientId="611265397810-sg0qqdi3ik2rqvrsvbuq2e3adv014apt.apps.googleusercontent.com">
              <Login />
            </GoogleOAuthProvider>
          }  />
          <Route path="/register" element={<Register />} />
        </Routes>
      </AuthProvider>
    )
}

export default App
