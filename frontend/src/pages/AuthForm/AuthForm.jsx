import {
    LockOutlined,
    MailOutlined,
    CloseOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchUserInfo } from '../../redux/user/userSlice';
import { registerUser } from '../../services/register';

const AuthForm = (props) => {
    const { type } = props;
    const { token } = useParams();
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isHR } = useSelector((state) => state.user.info);

    useEffect(() => {
        if (type === "register" && !isJWT(token)) {
            navigate("/");
        }
    }, [type, token, navigate]);

    function isJWT(token) {
        if (!token) {
            return false;
        }
        const parts = token.split('.');
        return parts.length === 3 && 
               parts.every(part => part.length > 0);
    }

    const onFinish = async (values) => {
        const { username, password } = values;

        if (type === 'login') {
            try {
                await dispatch(fetchUserInfo({ username, password })).unwrap();
                if (!isHR) navigate("/employee-dashboard");
                // else go to HR dashboard
            } catch (error) {
                alert(error.message);
            }
        } else if (type === "register") {
            const { email } = values;
            try {
                await registerUser(username, password, email, token);
                message.success('Employee created successfully, redirecting to the login page.');
                navigate("/login");
            } catch (error) {
                alert(error.message);
            }
        }
        form.resetFields();     // reset form inputs
    };
    return (
        <div id="content" className="flex items-center justify-center w-full">
            <Form
                form={form}
                name="normal_login"
                className="w-1/4 min-w-80 p-4 shadow-[0_0_1vw_gray] rounded-md"
                onFinish={onFinish}
            >
                <Link to="/">
                    <div className="text-end m-0">
                        <CloseOutlined />
                    </div>
                </Link>
                <h2 className="mt-0 mb-5 font-medium text-2xl text-center">
                    {type === "login" && "Log in to your account"}
                    {type === "register" && "Register an account"}
                </h2>
                {(type === "login" || type === "register") && (
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: "Please input your username!",
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Username" />
                    </Form.Item>
                )}
                {type === "register" && (
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: "Please input your email!",
                            },
                        ]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Email" />
                    </Form.Item>
                )}
                {(type === "login" || type === "register") && (
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Please input your password!",
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                )}
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="w-full"
                    >
                        {type === "login" && "Log In"}
                        {type === "register" && "Register"}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};
export default AuthForm;
