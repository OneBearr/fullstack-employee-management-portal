import { Link } from 'react-router-dom';

export const menuItemsUnapproved = [
    {
        key: "home",
        label: <Link to="/employee-dashboard">My Home Page</Link>,
    },
    {
        key: "visaStatus",
        label: <Link to="/employee-dashboard/visa-status">Visa Status Management</Link>,
    },
    {
        key: "onboarding",
        label: <Link to="/employee-dashboard/onboarding">Onboarding Application</Link>,
    },
];

export const menuItemsApproved = [
    {
        key: "home",
        label: <Link to="/employee-dashboard">My Home Page</Link>,
    },
    {
        key: "personalInfo",
        label: <Link to="/employee-dashboard/personal-info">Personal Information</Link>,
    },
    {
        key: "visaStatus",
        label: <Link to="/employee-dashboard/visa-status">Visa Status Management</Link>,
    },
];
