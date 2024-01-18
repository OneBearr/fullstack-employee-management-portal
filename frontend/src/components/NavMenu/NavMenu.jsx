import { useState } from 'react'
import { Link } from "react-router-dom";

import { Menu } from 'antd';

export default function NavMenu() {
    const [current, setCurrent] = useState('home');

    const onClick = (e) => {
        setCurrent(e.key);
    };

    const menuItems = [
        {
            key: 'home',
            label: <Link to="/">Home Page</Link>,
        },
        {
            key: 'personalInfo',
            label: <Link to="/personal-info">Personal Information</Link>,
        },
        {
            key: 'visaStatus',
            label: <Link to="/visa-status">Visa Status Management</Link>,
        },
        {
            key: 'onboarding',
            label: <Link to="/onboarding">Onboarding Application</Link>,
        },
    ];

    return (
        <div className="w-full ">
            <Menu className="flex justify-center" onClick={onClick} selectedKeys={[current]} mode="horizontal" items={menuItems} />
        </div>
    )
}
