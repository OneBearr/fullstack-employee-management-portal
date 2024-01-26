import { useEffect, useState, useMemo, useRef } from "react";
import { Table, Select, Empty, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import { useSelector } from "react-redux";

function DebounceSearch() {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);
  const fetchRef = useRef(0);
  const { token } = useSelector((state) => state.user.info);
  const navigate = useNavigate();

  const onSelect = (value) =>{
    console.log(value);
    navigate(`/hr-dashboard/employee-profile/${value}`);
  }

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      if(!value || !value.trim()){
        setFetching(false);
        setOptions([]);
        return;
      }
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);
      searchUserList(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }
        if(newOptions == false){
          setOptions([]);
        }
        else{
          setOptions(newOptions);
        }
        setFetching(false);
      });
    };
    return debounce(loadOptions, 800);
  }, []);

  async function searchUserList(username) {
    console.log('fetching user', username);
    return fetch(`http://localhost:3000/api/hrApplications/search/${username}`,{
      headers: {
        "x-auth-token": token,
      }
    })
      .then((response) => response.json())
      .then((body) =>
        body.map((user) => {
          if(user){
            return {
              label: `( ${user.preferredName || ""} ) ${user.firstName} ${user.middleName || "" } ${user.lastName}`,
              value: user.user,
          }
        }}),
      );
  }

  return (
    <Select
      className="w-full mt-4 mb-4"
      showSearch
      placeholder="input search name"
      filterOption={false}
      onSelect={onSelect}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> :<Empty/>}
      options={options}
    />
  );
}

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
      <DebounceSearch></DebounceSearch>
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
