import { Link } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";

export default function Header() {
  return (
    <div className="flex items-center justify-around text-white bg-gray-800 h-12 w-full">
      <div className="flex items-baseline ">
        <h2 className="text-2xl font-bold">Employeement</h2>
        <p>Chuwa</p>
      </div>
      <div className="flex items-center gap-x-3">
        <UserOutlined />
        <Link to="/login">
          Sign In
        </Link>
        {/* <p>Sign In</p> */}
      </div>
    </div>
  );
}
