import { React, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

export default function WelcomeHome() {
    const navigate = useNavigate();

    return (
        <div id="content" className='flex flex-col items-center justify-center'>
            <div className='text-3xl font-bold'> Welcome to Chuwa Employeement Management</div>
            <div className='text-xl font-bold'> Please login first</div>
        </div>
    )
}
