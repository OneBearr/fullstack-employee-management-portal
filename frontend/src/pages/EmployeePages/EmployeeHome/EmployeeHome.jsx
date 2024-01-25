import { useSelector } from "react-redux";

export default function EmployeeHome() {
  const { username } = useSelector((state) => state.user.info);

  return (
    <div className='pt-80'>
      <div className='w-full flex items-center justify-center text-3xl font-bold pt-500'> Hi {username}</div>
      <div className='w-full flex items-center justify-center text-3xl font-bold pt-500'> Welcome to your Employee Home Page</div>
    </div>
  )
}
