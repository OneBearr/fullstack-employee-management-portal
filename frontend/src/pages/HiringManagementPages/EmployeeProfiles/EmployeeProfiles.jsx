import { useEffect, useState } from "react";
import { Input, Table } from "antd";
const { Search } = Input;
import { useNavigate } from "react-router-dom";

export default function EmployeeProfiles() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([
    {
      id: "123",
      name: "Haoru Jiang",
      ssn: "123456",
      cellPhoneNumber: "1243254356",
      email: "haorujiang1997@gmail.com",
      workAuthType: "OPT",
    },
    {
      id: "123",
      name: "Haoru Jiang",
      ssn: "123456",
      cellPhoneNumber: "1243254356",
      email: "haorujiang1997@gmail.com",
      workAuthType: "OPT",
    },
    {
      id: "123",
      name: "Haoru Jiang",
      ssn: "123456",
      cellPhoneNumber: "1243254356",
      email: "haorujiang1997@gmail.com",
      workAuthType: "OPT",
    },
  ]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
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

  useEffect(() => {}, []);

  return (
    <>
      <Search placeholder="input search text" allowClear></Search>
      <Table
        columns={columns}
        dataSource={employees}
        onRow={(record) => {
          return {
            onClick: () => {navigate(`/hr-dashboard/employ-profile/${record.id}`)}
          };
        }}
      ></Table>
    </>
  );
}
