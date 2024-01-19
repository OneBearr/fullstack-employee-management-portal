import { Link, useNavigate } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";

export default function Header() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('isHR');
    // navigate(0);
  };

  return (
    <div className="flex items-center justify-around text-white bg-gray-800 h-12 w-full">
      <div className="flex items-baseline" onClick={() => navigate("/")}>
        <h2 className="text-2xl font-bold">Employeement</h2>
        <p>Chuwa</p>
      </div>
      <div className="flex items-center gap-x-3">
        <UserOutlined />
        {username ? (
          <Link to="/" onClick={handleLogout}>
            Log out
          </Link>
        ) : (
          <Link to="/login">
            Log In
          </Link>)}
        {/* <p>Sign In</p> */}
      </div>
    </div>
  );
}
