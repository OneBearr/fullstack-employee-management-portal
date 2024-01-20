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
            key: "home",
            label: <Link to="/hr-dashboard">My Home Page</Link>,
          },
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
            label: "Employee Visa Status Management",
            children: [
              {
                key: "visaStatusManagement/all",
                label: (              
                  <Link to="/hr-dashboard/visa-status-management" state={{type:'all'}}>
                    All
                  </Link>
                )
              },
              {
                key: "visaStatusManagement/inProgress",
                label: (              
                  <Link to="/hr-dashboard/visa-status-management" state={{type:'in-progress'}}>
                    In Progress
                  </Link>
                )
              },
            ],
          },
          {
            key: "hiringManagement",
            label: "Hiring Management",
            children: [
              {
                key: "hiringManagement/registration",
                label: (              
                  <Link to="/hr-dashboard/hiring-management" state={{type:'registration'}}>
                    Registration Token
                  </Link>
                )
              },
              {
                key: "hiringManagement/review",
                label: (              
                  <Link to="/hr-dashboard/hiring-management" state={{type:'review'}}>
                    Onboarding Application Review
                  </Link>
                )
              },
            ],
          },
        ]}
      />
      <Routes>
        {/* /hr-dashboard/* */}
        <Route path="/" element={<div id="content" className='flex items-center justify-center text-3xl font-bold'> Welcome to your Hiring Management Home Page</div>} />
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
