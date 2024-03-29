import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import AuthForm from "./pages/AuthForm/AuthForm";
import WelcomeChuwa from "./pages/WelcomeChuwa/WelcomeChuwa";
import EmployeeDashboard from "./pages/EmployeePages/EmployeeDashboard/EmployeeDashboard";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import HrDashboard from "./pages/HiringManagementPages/HrDashboard/HrDashboard";
import AuthLayout from "./components/AuthLayout/AuthLayout";
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<WelcomeChuwa />} />
          <Route path="/login" element={<AuthForm type="login" />} />
          <Route path="/register/:token" element={<AuthForm type="register" />} />
          <Route path="/employee-dashboard/*" element={<EmployeeDashboard />} />
          <Route element={<AuthLayout></AuthLayout>}>
            <Route path="/hr-dashboard/*" element={<HrDashboard />}/>
          </Route>
          <Route path="*" element={<ErrorPage />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
