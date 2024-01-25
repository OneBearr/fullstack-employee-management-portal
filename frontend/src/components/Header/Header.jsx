import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { UserOutlined } from "@ant-design/icons";
import { logoutUser } from "../../redux/user/userSlice";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { username } = useSelector((state) => state.user.info);

  const handleLogout = () => {
    dispatch(logoutUser());
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
      </div>
    </div>
  );
}
