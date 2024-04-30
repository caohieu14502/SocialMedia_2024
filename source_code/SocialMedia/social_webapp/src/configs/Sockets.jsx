import cookie from "react-cookies";



export const ws_endpoints = {
    'notification': (userId) => `/notification/${userId}`,
    'chat': (groupId) => `/chat/${groupId}`
}

const ws = (endpoints) => {
    return (`ws://127.0.0.1:8000/ws${endpoints}?token=${cookie.load("token").access_token}`); 
}

export default ws