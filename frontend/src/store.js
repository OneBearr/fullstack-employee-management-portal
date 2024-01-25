import { configureStore } from '@reduxjs/toolkit';
import userReducer from './redux/user/userSlice';
import personalInfoReducer from './redux/personalInfo/personalInfoSlice';
import personalFilesReducer from './redux/personalFiles/personalFilesSlice';
import employeeVisaStatusReducer from './redux/employeeVisaStatus/employeeVisaStatus';

const preloadedState = {
    user: JSON.parse(localStorage.getItem('user')) || {
        info: {
            token: null,
            isHR: false,
            username: "",
            userID: "",
            email: "",
            registerEmail: "",
            exp: null
        },
        loading: false,
        error: null,
    },
};

export const store = configureStore({
    reducer: {
        user: userReducer,
        personalInfo: personalInfoReducer,
        personalFiles: personalFilesReducer,
        employeeVisaStatus: employeeVisaStatusReducer
    },
    preloadedState
});