import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPersonalFilesAPI } from '../../services/personalFiles';

export const fetchPersonalFiles = createAsyncThunk(
    'personalFiles/fetchPersonalFiles',
    async ({userID, token}) => {
        const responseData = await fetchPersonalFilesAPI(userID, token);
        return responseData;
    }
);

const initialState = {
    files: [],
    loading: false,
    error: null,
};

export const personalFilesSlice = createSlice({
    name: 'personalFiles',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPersonalFiles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPersonalFiles.fulfilled, (state, action) => {
                console.log(action.payload)
                if (action.payload) {
                    state.files = action.payload;
                } else {
                    state.files = initialState.files;
                }
                state.loading = false;
            })
            .addCase(fetchPersonalFiles.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to fetch user files';
                state.loading = false;
            });
    },
});

export default personalFilesSlice.reducer;
