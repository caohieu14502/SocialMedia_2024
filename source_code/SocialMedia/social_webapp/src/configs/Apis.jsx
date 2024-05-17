import axios from "axios"
import cookie from "react-cookies"

export const endpoints = {
    'posts': '/posts/',
    'postDetails': (postId) => `/posts/${postId}/`,
    'comments': (postId) => `/posts/${postId}/comments/`,
    'reply': (commentId) => `/comments/${commentId}/replies/`,
    'login': '/o/token/',
    'current-user': '/users/current_user/',
    'group_chats': '/group-chats/',
    'group_chat-messages': (groupId) => `/group-chats/${groupId}/messages/`,
    'register': '/users/',
    'like': (postId) => `/posts/${postId}/likes/`,
    'profile': (userId) => `/users/${userId}/`,
    'follow': (userId) => `/users/${userId}/follow/`,
    'userPosts': (userId) => `/users/${userId}/posts/`,
    'users': '/users/'
}

export const authApis = () => {
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