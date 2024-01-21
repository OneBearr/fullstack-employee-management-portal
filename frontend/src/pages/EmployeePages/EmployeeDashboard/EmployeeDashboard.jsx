import { React, useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import NavMenu from "../../../components/NavMenu/NavMenu";
import EmployeeHome from "../EmployeeHome/EmployeeHome";
import PersonalInfo from "../PersonalInfo/PersonalInfo";
import VisaStatusMgnt from "../VisaStatusMgnt/VisaStatusMgnt";
import ErrorPage from "../../ErrorPage/ErrorPage";
import OnboardApplication from "../OnboardApplication/OnboardApplication";
import { Link } from "react-router-dom";
import {menuItemsUnapproved, menuItemsApproved} from './menuItems';

export default function EmployeeDashboard() {
    const navigate = useNavigate();
    const [isApproved, setIsApproved] = useState(false);
    const { username } = useSelector((state) => state.user.info);

    // if no user in the store, redirect to the welcome home page
    useEffect(() => {
        if (!username) {
            navigate("/", { replace: true });
        }
    }, [username, navigate]);

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
