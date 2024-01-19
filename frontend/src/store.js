import { configureStore } from '@reduxjs/toolkit';
import userReducer from './redux/user/userSlice';

const preloadedState = {
    user: JSON.parse(localStorage.getItem('user')) || {
        info: {
            token: null,
            isHR: false,
            username: "",
            userID: "",
            email: "",
            exp: null
        },
        loading: false,
        error: null,
    },
};

export const store = configureStore({
    reducer: {
        user: userReducer
    },
    preloadedState
});