import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPersonalFilesAPI } from '../../services/personalFiles';
import { hr_GetPersonalFilesAPI } from '../../services/hr';

export const fetchPersonalFiles = createAsyncThunk(
    'personalFiles/fetchPersonalFiles',
    async ({ userID, token }) => {
        const responseData = await fetchPersonalFilesAPI(userID, token);
        return responseData;
    }
);

export const hr_fetchPersonalFiles = createAsyncThunk(
    'personalFiles/hr_fetchPersonalFiles',
    async ({userID, token}) => {
        const responseData = await hr_GetPersonalFilesAPI(userID, token);
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
    reducers: {
        clearFilesError: (state) => {
            state.error = null;
        },
    },
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
            })
            .addCase(hr_fetchPersonalFiles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(hr_fetchPersonalFiles.fulfilled, (state, action) => {
                console.log(action.payload)
                if (action.payload) {
                    state.files = action.payload;
                } else {
                    state.files = initialState.files;
                }
                state.loading = false;
            })
            .addCase(hr_fetchPersonalFiles.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to fetch user files';
                state.loading = false;
            });
    },
});

export const { clearFilesError } = personalFilesSlice.actions;
export default personalFilesSlice.reducer;
