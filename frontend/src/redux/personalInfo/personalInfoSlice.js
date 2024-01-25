import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { submitPersonalInfoAPI, getPersonalInfoAPI, updatePersonalInfoAPI } from '../../services/personalInfo';
import { hr_GetPersonalInfoAPI } from '../../services/hr';

export const fetchPersonalInfo = createAsyncThunk(
    'personalInfo/fetchPersonalInfo',
    async ({ userID, token }) => {
        const responseData = await getPersonalInfoAPI(userID, token);
        return responseData
    }
);

export const hr_fetchPersonalInfo = createAsyncThunk(
    'personalInfo/hr_fetchPersonalInfo',
    async ({ userID, token }) => {
        const responseData = await hr_GetPersonalInfoAPI(userID, token);
        return responseData
    }
)

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
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPersonalInfo.pending, (state) => {
                state.loading = true;
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
            })
            .addCase(updatePersonalInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(hr_fetchPersonalInfo.pending, (state) => {
                state.loading = true;
            })
            .addCase(hr_fetchPersonalInfo.fulfilled, (state, action) => {
                if (action.payload) {
                    state.info = action.payload;
                } else {
                    state.info = initialState.info;
                }
                state.loading = false;
            })
            .addCase(hr_fetchPersonalInfo.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
            })
    },
});

export default personalInfoSlice.reducer;