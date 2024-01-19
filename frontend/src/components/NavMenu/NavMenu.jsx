import { useState } from 'react'
import { Menu } from 'antd';

export default function NavMenu(props) {
    const [current, setCurrent] = useState('home');
    const { menuItems } = props;

    const onClick = (e) => {
        setCurrent(e.key);
    };

    return (
        <div className="w-full ">
            <Menu className="flex justify-center" onClick={onClick} selectedKeys={[current]} mode="horizontal" items={menuItems} />
        </div>
    )
}
