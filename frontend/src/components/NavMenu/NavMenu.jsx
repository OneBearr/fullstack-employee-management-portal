import { useState, useEffect } from 'react'
import { Link, useLocation } from "react-router-dom";

import { Menu } from 'antd';

export default function NavMenu() {
    const location = useLocation();
    const [current, setCurrent] = useState(null);

    useEffect(() => {
        const path = location.pathname;
        if (path.includes('/employee-dashboard/personal-info')) {
            setCurrent('personalInfo');
        } else if (path.includes('/employee-dashboard/visa-status')) {
            setCurrent('visaStatus');
        } else if (path.includes('/employee-dashboard/onboarding')) {
            setCurrent('onboarding');
        } else {
            setCurrent('home');
        }
    }, [location]);

    const onClick = (e) => {
        setCurrent(e.key);
    };

    const menuItems = [
        {
            key: 'home',
            label: <Link to="/employee-dashboard">My Home Page</Link>,
        },
        {
            key: 'personalInfo',
            label: <Link to="/employee-dashboard/personal-info">Personal Information</Link>,
        },
        {
            key: 'visaStatus',
            label: <Link to="/employee-dashboard/visa-status">Visa Status Management</Link>,
        },
        {
            key: 'onboarding',
            label: <Link to="/employee-dashboard/onboarding">Onboarding Application</Link>,
        },
    ];

    return (
        <div className="w-full ">
            <Menu className="flex justify-center" onClick={onClick} selectedKeys={[current]} mode="horizontal" items={menuItems} />
        </div>
    )
}
