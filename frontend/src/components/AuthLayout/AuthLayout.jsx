import { Navigate, Outlet, useLocation} from "react-router-dom";
import { useSelector } from "react-redux";

export default function AuthLayout() {
  const { userID, isHR } = useSelector((state) => state.user.info);
  const location = useLocation();

  return (
    <>
      {isHR ? <Outlet/>: (
        <Navigate to="/" state={{ from: location.pathname, message:"You have no permission!" }}></Navigate>
      )}
    </>
  );
}
