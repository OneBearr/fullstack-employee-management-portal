import { UserOutlined } from "@ant-design/icons";

export default function Header() {
  return (
    <div className="flex items-center justify-around text-white bg-gray-800 h-12 w-full">
      <div className="flex items-center ">
        <h2>Employeement</h2>
        <p>Chuwa</p>
      </div>
      <div className="flex items-center gap-x-3">
        <UserOutlined />
        <p>Sign In</p>
      </div>
    </div>
  );
}
