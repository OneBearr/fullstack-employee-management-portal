import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUserInfoAPI } from '../../services/login';

const removeLocalStorage = () => {
    localStorage.removeItem('user');
}

const saveToLocalStorage = (state) => {
    localStorage.setItem('user', JSON.stringify(state));
};

export const fetchUserInfo = createAsyncThunk(
    'user/fetchUserInfo',
    async (userData) => {
        const responseData = await fetchUserInfoAPI(userData);
        return responseData;
    }
);

const initialState = {
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
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logoutUser: (state) => {
            state.info = {
                token: null,
                isHR: false,
                username: "",
                userID: "",
                email: "",
                registerEmail: "",
                exp: null
            }
            state.loading = false;
            state.error = null;
            removeLocalStorage();
        },
        clearUserError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserInfo.pending, (state) => {
                state.info = {
                    token: null,
                    isHR: false,
                    username: "",
                    userID: "",
                    email: "",
                    registerEmail: "",
                    exp: null
                }
                state.loading = true;
                state.error = null;
                removeLocalStorage();
            })
            .addCase(fetchUserInfo.fulfilled, (state, action) => {
                state.info = action.payload;
                state.loading = false;
                saveToLocalStorage(state);
            })
            .addCase(fetchUserInfo.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to fetch user token';
                state.loading = false;
            });
    },
});

export const { logoutUser, clearUserError } = userSlice.actions;
export default userSlice.reducer;
