import {
    LockOutlined,
    MailOutlined,
    CloseOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const AuthForm = (props) => {
    const { type } = props;
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        console.log("Received values of form: ", values);
        const { username, password } = values;

        if (type === 'login') {
            if (username === 'ethan' && password === '123') {
                localStorage.setItem('username', username);
                localStorage.setItem('isHR', false);
                navigate("/employee-dashboard");
            }
        }
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
