import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { submitPersonalInfoAPI, getPersonalInfoAPI, updatePersonalInfoAPI } from '../../services/personalInfo';

export const fetchPersonalInfo = createAsyncThunk(
    'personalInfo/fetchPersonalInfo',
    async ({ userID, token }) => {
        const responseData = await getPersonalInfoAPI(userID, token);
        return responseData
    }
);

export const submitPersonalInfo = createAsyncThunk(
    'personalInfo/submitPersonalInfo',
    async ({ personalInfoData, userID, token }) => {
        const responseData = await submitPersonalInfoAPI(personalInfoData, userID, token);
        return responseData
    }
);

export const updatePersonalInfo = createAsyncThunk(
    'personalInfo/updatePersonalInfo',
    async ({ personalInfoData, userID, token }) => {
        const responseData = await updatePersonalInfoAPI(personalInfoData, userID, token);
        return responseData
    }
);

const initialState = {
    info: {
        firstName: "",
        lastName: "",
        middleName: "",
        preferredName: "",
        profilePictureURL: "",
        address: {
            unitNumber: "",
            streetName: "",
            city: "",
            state: "",
            zip: ""
        },
        cellPhoneNumber: "",
        workPhoneNumber: "",
        email: "",
        ssn: "",
        dob: "",
        gender: "",
        emergencyContacts: [
            {
                firstName: "",
                lastName: "",
                middleName: "",
                phone: "",
                email: "",
                relationship: ""
            }
        ],
        reference: {
            firstName: "",
            lastName: "",
            phone: "",
            email: "",
            relationship: ""
        },
        workAuth: {
            isCitizen: false,
            citizenType: "",
            workAuthType: ""
        },
        employmentDetails: {
            visaTitle: "",
            startDate: "",
            endDate: ""
        },
        onboardingInfo: {
            status: "",
            feedback: ""
        }
    },
    loading: false,
    error: null,
};

export const personalInfoSlice = createSlice({
    name: 'personalInfo',
    initialState,
    reducers: {
        clearInfoError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPersonalInfo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPersonalInfo.fulfilled, (state, action) => {
                if (action.payload) {
                    state.info = action.payload;
                } else {
                    state.info = initialState.info;
                }
                state.loading = false;
            })
            .addCase(fetchPersonalInfo.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
            })
            .addCase(submitPersonalInfo.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.info = action.payload;
                }
            })
            .addCase(submitPersonalInfo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitPersonalInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updatePersonalInfo.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.info = action.payload;
                }
            })
            .addCase(updatePersonalInfo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePersonalInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});

export const { clearInfoError } = personalInfoSlice.actions;
export default personalInfoSlice.reducer;