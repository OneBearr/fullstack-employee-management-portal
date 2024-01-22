import { useLocation } from "react-router-dom";
import ErrorPage from "../../ErrorPage/ErrorPage";
import { Tabs, List, Input, Button, Table } from "antd";

function Registration(props) {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Registration link",
      dataIndex: "link",
      key: "link",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
  ];
  
  const data = [];

  return (
    <>
      <div className="flex gap-4 mt-4 mb-4">
        <Input placeholder="Please input email"></Input>
        <Button type="primary">Generate token and send email</Button>
      </div>
      <p>History</p>
      <Table columns={columns} dataSource={data}></Table>
    </>
  );
}

function ReviewApplications(props) {
  const onChange = (key) => {
    console.log(key);
  };

  const pendingApplications = [
    {
      name: "Haoru Jiang",
      email: "haorujiang1997@gmail.com",
      appliction_id: "",
    },
  ];
  const rejectedApplications = [
    {
        name: "Haoru Jiang",
        email: "haorujiang1997@gmail.com",
        appliction_id: "",
      },
  ];
  const approvedApplications = [
    {
        name: "Haoru Jiang",
        email: "haorujiang1997@gmail.com",
        appliction_id: "",
      },
  ];

  const items = [
    {
      key: "1",
      label: "Pending",
      children: (
        <List
          itemLayout="horizontal"
          bordered
          dataSource={pendingApplications}
          renderItem={(item) => (
            <List.Item
              actions={[<a key="list-view-application">View Application</a>]}
            >
              <p>{item.name}</p>
              <p>{item.email}</p>
            </List.Item>
          )}
        ></List>
      ),
    },
    {
      key: "2",
      label: "Rejected",
      children: (
        <List
          itemLayout="horizontal"
          bordered
          dataSource={rejectedApplications}
          renderItem={(item) => (
            <List.Item>
              <p>{item.name}</p>
              <p>{item.email}</p>
            </List.Item>
          )}
        ></List>
      ),
    },
    {
      key: "3",
      label: "Approved",
      children: (
        <List
          itemLayout="horizontal"
          bordered
          dataSource={approvedApplications}
          renderItem={(item) => (
            <List.Item>
              <p>{item.name}</p>
              <p>{item.email}</p>
            </List.Item>
          )}
        ></List>
      ),
    },
  ];
  return <Tabs defaultActiveKey="1" items={items} onChange={onChange}></Tabs>;
}

export default function HiringManagement() {
  const location = useLocation();
  const type = location.state?.type;

  if (type === "registration") {
    return <Registration></Registration>;
  } else if (type === "review") {
    return <ReviewApplications></ReviewApplications>;
  } else {
    return <ErrorPage></ErrorPage>;
  }
}
