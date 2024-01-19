import { Routes, Route } from "react-router-dom";
import NavMenu from "../../../components/NavMenu/NavMenu";
import ErrorPage from "../../ErrorPage/ErrorPage";
import HiringManagement from "../HiringManagement/HiringManagement";
import HrVisaStatusManagement from "../HrVisaStatusManagement/HrVisaStatusManagement";
import EmployeeProfiles from "../EmployeeProfiles/EmployeeProfiles";
import { Link } from "react-router-dom";

export default function HrDashboard() {
  return (
    <div id="content" className="w-1/2">
      <NavMenu
        menuItems={[
          {
            key: "profiles",
            label: (
              <Link to="/hr-dashboard/employee-profiles">
                Employee Profiles
              </Link>
            ),
          },
          {
            key: "visaStatusManagement",
            label: (
              <Link to="/hr-dashboard/visa-status-management">
                Employee Visa Status Management
              </Link>
            ),
          },
          {
            key: "hiringManagement",
            label: (
              <Link to="/hr-dashboard/hiring-management">
                Hiring Management
              </Link>
            ),
          },
        ]}
      />
      <Routes>
        {/* /hr-dashboard/* */}
        <Route path="/" element={<></>} />
        <Route path="/employee-profiles" element={<EmployeeProfiles />} />
        <Route
          path="/visa-status-management"
          element={<HrVisaStatusManagement />}
        />
        <Route path="/hiring-management" element={<HiringManagement />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
}
