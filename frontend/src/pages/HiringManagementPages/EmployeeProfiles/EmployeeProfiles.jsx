import { useEffect, useState } from "react";
import { Table } from "antd";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SearchBar from "../../../components/SearchBar/SearchBar";

export default function EmployeeProfiles() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const { token } = useSelector((state) => state.user.info);
  const [loading, setLoading] = useState(true);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "SSN",
      dataIndex: "ssn",
      key: "ssn",
    },
    {
      title: "Work Authorization Title",
      dataIndex: "workAuthType",
      key: "workAuthType",
    },
    {
      title: "Phone Number",
      dataIndex: "cellPhoneNumber",
      key: "cellPhoneNumber",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
  ];

  useEffect(() => {
    fetch("http://localhost:3000/api/hrApplications", {
      headers: {
        "x-auth-token": token,
      }
    })
      .then((res) => res.json())
      .then((data) => {
        const filteredData = data.filter((item)=>(item.onboardingInfo.status==="approved"));
        setEmployees(
          filteredData.map((item) => {
            return {
              id: item.user,
              name: `${item.firstName} ${item.middleName || ""} ${item.lastName}`,
              ssn: item.ssn,
              cellPhoneNumber: item.cellPhoneNumber,
              email: item.email,
              workAuthType: item.workAuth.isCitizen
                ? "Citizen"
                : item.workAuth.workAuthType,
            };
          })
        );
        setLoading(false);
      });
  }, []);

  return (
    <>
      <SearchBar></SearchBar>
      <Table
        loading={loading}
        columns={columns}
        dataSource={employees}
        onRow={(record) => {
          return {
            onClick: () => {
              navigate(`/hr-dashboard/employee-profile/${record.id}`);
            },
          };
        }}
      ></Table>
    </>
  );
}
