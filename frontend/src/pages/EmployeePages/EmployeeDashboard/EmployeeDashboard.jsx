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

export default function EmployeeDashboard() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { username, userID, token } = useSelector((state) => state.user.info);
    const { status } = useSelector((state) => state.personalInfo.info.onboardingInfo ?? {});
    const [isApproved, setIsApproved] = useState(false);

    useEffect(() => {
        // if no user in the store, redirect to the welcome home page
        if (!username) {
            navigate("/", { replace: true });
        } else {
            dispatch(fetchPersonalInfo({userID, token}));
            dispatch(fetchPersonalFiles({userID, token}));
        }
    }, [dispatch, navigate, token, userID, username]);

    useEffect(() => {
        setIsApproved(status === "approved");
        if (isApproved) {
            navigate("/employee-dashboard/personal-info");
        } else {
            navigate("/employee-dashboard/onboarding");
        }
    }, [isApproved, navigate, status]);

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
