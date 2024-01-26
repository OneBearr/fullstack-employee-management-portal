import { message } from "antd";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"

export default function WelcomeHome() {
  const location = useLocation();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const { username, isHR } = useSelector((state) => state.user.info);

  useEffect(() => {
    if (username) {
      if (isHR) {
        navigate("/hr-dashboard", { replace: true });
      } else {
        navigate("/employee-dashboard", { replace: true });
      }
    }
  }, [username, isHR]);

  useEffect(() => {
    if (location.state?.message) {
      messageApi.info(location.state?.message);
    }
  }, []);

  return (
    <div id="content" className="flex flex-col items-center justify-center">
      {contextHolder}
      <div className="text-3xl font-bold">
        {" "}
        Welcome to Chuwa Employeement Management
      </div>
      {username ? (
        <div className="text-xl font-bold"> {isHR?"HR":"User"}: {username}</div>
      ) : (
        <div className="text-xl font-bold"> Please login first</div>
      )}
    </div>
  );
}
