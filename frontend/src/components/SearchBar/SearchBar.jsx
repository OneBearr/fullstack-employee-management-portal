import debounce from "lodash.debounce";
import { Select, Empty, Spin } from "antd";
import { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function SearchBar() {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);
  const fetchRef = useRef(0);
  const { token } = useSelector((state) => state.user.info);
  const navigate = useNavigate();

  const onSelect = (value) => {
    navigate(`/hr-dashboard/employee-profile/${value}`);
  };

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      if (!value || !value.trim()) {
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
        if (newOptions == false) {
          setOptions([]);
        } else {
          setOptions(newOptions);
        }
        setFetching(false);
      });
    };
    return debounce(loadOptions, 1000);
  }, []);

  async function searchUserList(username) {
    return fetch(
      `http://localhost:3000/api/hrApplications/search/${username}`,
      {
        headers: {
          "x-auth-token": token,
        },
      }
    )
      .then((response) => response.json())
      .then((body) =>
        body.map((user) => {
          if (user) {
            let preferredName = "";
            if (user.preferredName) {
              preferredName = `(${user.preferredName || ""})`;
            }
            return {
              label: `${preferredName} ${user.firstName} ${
                user.middleName || ""
              } ${user.lastName}`,
              value: user.user,
            };
          }
        })
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
      notFoundContent={fetching ? <Spin size="small" /> : <Empty />}
      options={options}
    />
  );
}
