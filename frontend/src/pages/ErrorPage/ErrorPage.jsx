import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button, Result } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { logoutUser } from "../../redux/user/userSlice";

export default function ErrorPage() {
  const dispatch = useDispatch();

  return (
    <div id="content" className="flex justify-center items-center">
      <Result
        icon={<ExclamationCircleOutlined />}
        title="Oops, something went wrong, please come back later!"
        extra={
          <Link to="/">
            <Button type="primary" onClick={() => dispatch(logoutUser())}>Go Home</Button>
          </Link>
        }
      />
    </div>
  );
}
