import { useEffect, useState } from "react";
import { Button, Descriptions, Input } from "antd";
import { useParams, useLocation } from "react-router-dom";
const { TextArea } = Input;

export default function Profile() {
  const location = useLocation();
  const { id } = useParams();
  const [feedback, setFeedback] = useState("1");
  const [items, setItems] = useState([
    {
      key: "1",
      label: "firstName",
      children: "",
    },
    {
      key: "2",
      label: "lastName",
      children: "",
    },
    {
      key: "3",
      label: "middleName",
      children: "",
    },
    {
      key: "4",
      label: "preferredName",
      children: "",
    },
    {
      key: "5",
      label: "profilePicture",
      children: "",
    },
    {
      key: "6",
      label: "email",
      children: "",
    },
    {
      key: "7",
      label: "ssn",
      children: "",
    },
    {
      key: "8",
      label: "gender",
      children: "",
    },
    {
      key: "9",
      label: "address",
      children: "",
    },
    {
      key: "10",
      label: "cellPhoneNumber",
      children: "",
    },
    {
      key: "11",
      label: "employmentDetails",
      children: "",
    },
    {
      key: "12",
      label: "documents",
      children: "",
    },
  ]);

  useEffect(() => {

  }, []);

  return (
    <>
      <h4>Employ Profile</h4>
      <Descriptions items={items} bordered></Descriptions>
      {feedback && (
        <>
          <p>Feedback</p>
          <TextArea rows={4} value={feedback}></TextArea>
          <Button>Approve</Button>
          <Button>Reject</Button>
        </>
      )}
    </>
  );
}
