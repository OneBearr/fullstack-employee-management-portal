import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavMenu from "./components/NavMenu/NavMenu";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import AuthForm from "./pages/AuthForm/AuthForm";
import EmployeeHome from "./pages/EmployeeHome/EmployeeHome";
import PersonalInfo from "./pages/PersonalInfo/PersonalInfo";
import VisaStatusMgnt from "./pages/VisaStatusMgnt/VisaStatusMgnt";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import OnboardApplication from "./pages/OnboardApplication/OnboardApplication";
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <Header />
        <NavMenu />
        <Routes>
          <Route path="/" element={<EmployeeHome />} />
          <Route path="/login" element={<AuthForm type="login" />} />
          <Route path="/register" element={<AuthForm type="register" />} />
          <Route path="/onboarding" element={<OnboardApplication />} />
          <Route path="/personal-info" element={<PersonalInfo />} />
          <Route path="/visa-status" element={<VisaStatusMgnt />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
