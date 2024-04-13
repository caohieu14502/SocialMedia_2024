import axios from "axios"
import cookie from "react-cookies"

export const endpoints = {
    'posts': '/posts/',
    'postDetails': (postId) => `/posts/${postId}/`,
    'comments': (postId) => `/posts/${postId}/comments/`,
    'login': '/o/token/',
    'current-user': '/users/current_user/',
    'group_chats': '/group-chats/',
    'group_chat-messages': (groupId) => `/group-chats/${groupId}/messages/`,
    'register': '/users/',
    'like': (postId) => `/posts/${postId}/likes/`
}

export const authApis = () => {
    console.log(cookie.load("token"))
    return axios.create({
        baseURL: "http://localhost:8000",
        headers: {
            "Authorization": `Bearer ${cookie.load("token").access_token}` //
        }
    })
}

export default axios.create({
    baseURL: "http://localhost:8000",
})