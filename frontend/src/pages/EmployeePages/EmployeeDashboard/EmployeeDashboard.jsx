import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import NavMenu from "../../../components/NavMenu/NavMenu";
import EmployeeHome from "../EmployeeHome/EmployeeHome";
import PersonalInfo from "../PersonalInfo/PersonalInfo";
import VisaStatusMgnt from "../VisaStatusMgnt/VisaStatusMgnt";
import ErrorPage from "../../ErrorPage/ErrorPage";
import OnboardApplication from "../OnboardApplication/OnboardApplication";
import { menuItemsUnapproved, menuItemsApproved } from './menuItems';
import { fetchPersonalInfo } from '../../../redux/personalInfo/personalInfoSlice';
import { fetchPersonalFiles } from '../../../redux/personalFiles/personalFilesSlice';
import { fetchEmployeeVisaStatus } from '../../../redux/employeeVisaStatus/employeeVisaStatus';
import { clearUserError } from "../../../redux/user/userSlice";
import { clearInfoError } from "../../../redux/personalInfo/personalInfoSlice";
import { clearFilesError } from "../../../redux/personalFiles/personalFilesSlice";
import { clearVisaStatusError } from "../../../redux/employeeVisaStatus/employeeVisaStatus";

export default function EmployeeDashboard() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { username, userID, token } = useSelector((state) => state.user.info);
    const { status } = useSelector((state) => state.personalInfo.info.onboardingInfo ?? {});
    const [isApproved, setIsApproved] = useState(false);
    const { error: userEroor } = useSelector((state) => state.user);
    const { loading, error: infoError } = useSelector((state) => state.personalInfo);
    const { error: filesError } = useSelector((state) => state.personalFiles);
    const { error: visaStatusError } = useSelector((state) => state.employeeVisaStatus);

    useEffect(() => {
        // if no user in the store, redirect to the welcome home page
        if (!username) {
            navigate("/", { replace: true });
        } else {
            dispatch(fetchPersonalInfo({ userID, token }));
            dispatch(fetchPersonalFiles({ userID, token }));
            dispatch(fetchEmployeeVisaStatus({ userID, token }));
        }
    }, [token, userID, username]);

    useEffect(() => {
        const path = location.pathname;
        setIsApproved(status === "approved");
        if (path === '/employee-dashboard/visa-status') {
            navigate("/employee-dashboard/visa-status");
        } else if (isApproved) {
            navigate("/employee-dashboard/personal-info");
        } else {
            navigate("/employee-dashboard/onboarding");
        }
    }, [isApproved, status]);

    useEffect(() => {
        if (userEroor || infoError || filesError || visaStatusError) {
            navigate("/error");
            dispatch(clearUserError());
            dispatch(clearInfoError());
            dispatch(clearFilesError());
            dispatch(clearVisaStatusError());
        }
    }, [filesError, infoError, userEroor, visaStatusError]);

    if (loading) {
        return <div id="content" className='flex justify-center pt-80'>Loading, hold on tight...</div>;
    }
    return (
        <div id='content' className='w-1/2'>
            <NavMenu
                menuItems={isApproved ? menuItemsApproved : menuItemsUnapproved}
            />
            <Routes>
                {/* /employee-dashboard/* */}
                <Route path="/" element={<EmployeeHome />} />
                <Route path="/personal-info" element={<PersonalInfo />} />
                <Route path="/visa-status" element={<VisaStatusMgnt />} />
                <Route path="/onboarding" element={<OnboardApplication />} />
                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </div>
    )
}
