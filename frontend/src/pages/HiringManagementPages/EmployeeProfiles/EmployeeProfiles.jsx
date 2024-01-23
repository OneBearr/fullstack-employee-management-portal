import { useEffect, useState, useMemo } from "react";
import { Table, Select, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";

function DebounceSearch(props) {
  const data = props.data.map((item)=>{
    return {
      label: `${item.name}`,
      value: `${item.id}`,
    }
  });

  const onSelect = (value) =>{
    console.log(value);
  }

  const filterOption = (input, option) => (option.label.includes(input));

  return (
    <Select
      showSearch
      placeholder="input search text"
      filterOption={filterOption}
      onSelect={onSelect}
      notFoundContent={<Empty/>}
      options={data}
    />
  );
}

export default function EmployeeProfiles() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);

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

  useEffect(() => {
    fetch("http://localhost:3000/api/applications/")
      .then((res) => res.json())
      .then((data) => {
        setEmployees(
          data.map((item) => {
            return {
              id: item._id,
              name: `( ${item.preferredName} ) ${item.firstName} ${item.middleName} ${item.lastName}`,
              ssn: item.ssn,
              cellPhoneNumber: item.cellPhoneNumber,
              email: item.email,
              workAuthType: item.workAuth.isCitizen
                ? "Citizen"
                : item.workAuth.workAuthType,
            };
          })
        );
      });
  }, []);

  return (
    <>
      <DebounceSearch data={employees}></DebounceSearch>
      <Table
        columns={columns}
        dataSource={employees}
        onRow={(record) => {
          return {
            onClick: () => {
              navigate(`/hr-dashboard/employ-profile/${record.id}`);
            },
          };
        }}
      ></Table>
    </>
  );
}
