import Env from "./env";

export const BASE_URL = Env.BACKEND_URL;
export const API_URL = BASE_URL + "/api";
export const LOGIN_URL = API_URL + "/auth/login";
export const CHAT_GROUP_URL = API_URL + "/chat-group";
export const CHAT_GROUP_USER_URL = API_URL + "/chat-group-users";
export const CHATS_URL = API_URL + "/chats";

if (process.env.NODE_ENV === 'development') {
  console.log('API URLs:', {
    BASE_URL,
    LOGIN_URL,
    CHAT_GROUP_URL
  });
}