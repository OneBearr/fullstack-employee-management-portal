import { Link } from "react-router-dom";
import { Button, Result } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

export default function ErrorPage() {
  return (
    <div id="content" className="flex justify-center items-center">
      <Result
        icon={<ExclamationCircleOutlined />}
        title="Oops, something went wrong!"
        extra={
          <Link to="/">
            <Button type="primary" className="bg-blue-600">Go Home</Button>
          </Link>
        }
      />
    </div>
  );
}
