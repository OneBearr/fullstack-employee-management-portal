import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchEmployeeVisaStatusAPI } from '../../services/employeeVisaStatus';

export const fetchEmployeeVisaStatus = createAsyncThunk(
    'employeeVisaStatus/fetchEmployeeVisaStatus',
    async ({ userID, token }) => {
        const responseData = await fetchEmployeeVisaStatusAPI(userID, token);
        return responseData;
    }
);

const initialState = {
    visaStatus: {
        optReceipt: {
            status: 'no submit',
            file: null,
        },
        optEAD: {
            status: 'no submit',
            file: null,
        },
        I983: {
            status: 'no submit',
            file: null,
        },
        I20: {
            status: 'no submit',
            file: null,
        },
        feedback: '',
    },
    loading: false,
    error: null,
};

export const employeeVisaStatusSlice = createSlice({
    name: 'employeeVisaStatus',
    initialState,
    reducers: {
        clearVisaStatusError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEmployeeVisaStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEmployeeVisaStatus.fulfilled, (state, action) => {
                console.log(action.payload)
                if (action.payload) {
                    state.visaStatus = action.payload;
                } else {
                    state.visaStatus = initialState.visaStatus;
                }
                state.loading = false;
            })
            .addCase(fetchEmployeeVisaStatus.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to fetch employee visa status';
                state.loading = false;
            });
    },
});

export const { clearVisaStatusError } = employeeVisaStatusSlice.actions;
export default employeeVisaStatusSlice.reducer;
