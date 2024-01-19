import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavMenu from "../../../components/NavMenu/NavMenu";
import EmployeeHome from "../EmployeeHome/EmployeeHome";
import PersonalInfo from "../PersonalInfo/PersonalInfo";
import VisaStatusMgnt from "../VisaStatusMgnt/VisaStatusMgnt";
import ErrorPage from "../../ErrorPage/ErrorPage";
import OnboardApplication from "../OnboardApplication/OnboardApplication";
import { Link } from "react-router-dom";

export default function EmployeeDashboard() {
  return (
    <div id="content" className="w-1/2">
      <NavMenu
        menuItems={[
          {
            key: "home",
            label: <Link to="/employee-dashboard">My Home Page</Link>,
          },
          {
            key: "personalInfo",
            label: (
              <Link to="/employee-dashboard/personal-info">
                Personal Information
              </Link>
            ),
          },
          {
            key: "visaStatus",
            label: (
              <Link to="/employee-dashboard/visa-status">
                Visa Status Management
              </Link>
            ),
          },
          {
            key: "onboarding",
            label: (
              <Link to="/employee-dashboard/onboarding">
                Onboarding Application
              </Link>
            ),
          },
        ]}
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
  );
}
