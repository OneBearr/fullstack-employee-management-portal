import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { hr_GetAllPersonalInfoAPI, hr_GetTokenHistory } from "../../services/hr";

const initialState = {
    applications: [],
    tokenHistory:[],
    loading: false,
    error: null,
};

export const hr_fetchPersonalFiles = createAsyncThunk(
    'hr/fetchApplications',
    async ({token}) => {
        const responseData = await hr_GetAllPersonalInfoAPI(token);
        return responseData;
    }
);

export const hr_fetchTokenHistory = createAsyncThunk(
    'hr/TokenHistory',
    async ({token}) => {
        const responseData = await hr_GetTokenHistory(token);
        return responseData;
    }
);

export const hrSlice = createSlice({
    name: 'hr',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(hr_fetchPersonalFiles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(hr_fetchPersonalFiles.fulfilled, (state, action) => {
                if (action.payload) {
                    state.applications = action.payload;
                } else {
                    state.applications = initialState.applications;
                }
                state.loading = false;
            })
            .addCase(hr_fetchPersonalFiles.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to fetch data';
                state.loading = false;
            })

            .addCase(hr_fetchTokenHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(hr_fetchTokenHistory.fulfilled, (state, action) => {
                if (action.payload) {
                    state.tokenHistory = action.payload;
                } else {
                    state.tokenHistory = initialState.tokenHistory;
                }
                state.loading = false;
            })
            .addCase(hr_fetchTokenHistory.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to fetch data';
                state.loading = false;
            })
    },
});

export default hrSlice.reducer;