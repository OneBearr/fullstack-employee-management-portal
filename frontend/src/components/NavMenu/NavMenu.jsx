import { useState, useEffect } from 'react'
import { useLocation } from "react-router-dom";

import { Menu } from 'antd';

export default function NavMenu(props) {
    const { menuItems } = props;
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
        } else if (path.includes('/employee-dashboard')) {
            setCurrent('home');
        }
    }, [location]);

    const onClick = (e) => {
        setCurrent(e.key);
    };

    return (
        <div className="w-full ">
            <Menu className="flex justify-center" onClick={onClick} selectedKeys={[current]} mode="horizontal" items={menuItems} />
        </div>
    )
}
