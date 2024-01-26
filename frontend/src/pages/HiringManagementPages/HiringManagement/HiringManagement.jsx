import { Link, useLocation } from "react-router-dom";
import ErrorPage from "../../ErrorPage/ErrorPage";
import { Tabs, List, Input, Button, Table, Tag } from "antd";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form"

function Registration() {
  const { token } = useSelector((state) => state.user.info);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
    },
  })

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ellipsis: true
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ellipsis: true
    },
    {
      title: "Registration link",
      dataIndex: "link",
      key: "link",
      ellipsis: true
    },
    {
      title: "Status",
      key: "status",
      render: (_, {status, exp}) => {
        if(status){
          return <Tag color="green">Submitted</Tag>
        }
        else{
          if(Date.parse(exp) < Date.parse(Date.now())){
            return <Tag color="yellow">Waiting</Tag>
          }
          else{
            return <Tag color="red">Expired</Tag>
          }
        }
      }
    },
  ];
  
  const [data, setData] = useState([]);

  const onSubmit = ({email}) => {
    fetch("http://localhost:3000/auth/request-register", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        "x-auth-token": token,
      },
      body: JSON.stringify({
        email: email
      }),
    })
    .then((res)=>res.json())
    .then((data)=>{
      console.log(data);
    })
  };

  useEffect(()=>{
    fetch("http://localhost:3000/api/registrations/")
    .then((res)=>res.json())
    .then((items)=>{
      setData(items.map((item)=>{
        return {
          name: item.name,
          email: item.email,
          link: item.link,
          status: item.submitted,
          exp: item.expiration
        }
      }))
    })
  },[]);

  return (
    <>
      <div>
        <form className="flex gap-4 mt-4 mb-4">
            <Controller
            name="email"
            control={control}
            render={({ field }) => <Input placeholder="Please input email" {...field} />}
          />
          <Button type="primary" onClick={handleSubmit(onSubmit)}>Generate token and send email</Button>
        </form>
      </div>
      <p>History</p>
      <Table className="max-w-full" columns={columns} dataSource={data}></Table>
    </>
  );
}

function ReviewApplications() {
  const { token } = useSelector((state) => state.user.info);

  const onChange = (key) => {

  };

  const [pendingApplications, setPendingApplications] = useState([]);
  const [rejectedApplications, setRejectedApplications] = useState([]);
  const [approvedApplications, setApprovedApplications] = useState([]);

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
              actions={[<Link key="list-view-application" to={`/hr-dashboard/application/${item.user}`} target="_blank">View Application</Link>]}
            >
              <p>{item.firstName} {item.middleName} {item.lastName}</p>
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
              <p>{item.firstName} {item.middleName} {item.lastName}</p>
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
              <p>{item.firstName} {item.middleName} {item.lastName}</p>
              <p>{item.email}</p>
            </List.Item>
          )}
        ></List>
      ),
    },
  ];

  useEffect(()=>{
    fetch("http://localhost:3000/api/hrApplications", {
      headers: {
          "x-auth-token": token,
      }
    })
    .then((res)=>res.json())
    .then((data)=>{
      const approvedList = [];
      const rejectedList = [];
      const pendingList = [];
      data.forEach(element => {
        if(element.onboardingInfo?.status === "approved"){
          approvedList.push(element);
        }
        else if (element.onboardingInfo?.status === "pending") {
          pendingList.push(element);
        }
        else if (element.onboardingInfo?.status === "rejected") {
          rejectedList.push(element);
        }
      });
      setPendingApplications(pendingList);
      setRejectedApplications(rejectedList);
      setApprovedApplications(approvedList);
    })
  },[]);

  return <Tabs defaultActiveKey="1" items={items} onChange={onChange}></Tabs>;
}

export default function HiringManagement() {
  const location = useLocation();
  const type = location.state?.type || 'review';

  if (type === "registration") {
    return <Registration></Registration>;
  } else if (type === "review") {
    return <ReviewApplications></ReviewApplications>;
  } else {
    return <ErrorPage></ErrorPage>;
  }
}
