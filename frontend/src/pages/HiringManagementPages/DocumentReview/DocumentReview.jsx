import { Input, Button } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {hr_RejectVisaFile, hr_ApproveVisaFile} from "../../../services/hr";
const { TextArea } = Input;

export default function DocumentReview() {
  const { token } = useSelector((state) => state.user.info);
  const location = useLocation();
  const { file } = location.state;
  const [fileSrc, setFileSrc] = useState("");
  const [feedback, setFeedback] = useState(location.state.feedback);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(file.hrAccess, {
      method: "GET",
      headers: {
        "x-auth-token": token,
      },
    })
      .then((res) => res.blob())
      .then((blob) => {
        setFileSrc(URL.createObjectURL(blob));
      });
  }, []);

  return (
    <>
      <iframe src={fileSrc} width="100%" height="550px" />
      {!location.state.approved && (
        <>
          <div className="text-xl font-bold mt-2">Feedback:</div>
          <TextArea
            className="mb-2"
            rows={4}
            placeholder={feedback}
            onChange={(e) => {
              setFeedback(e.target.value);
            }}
          ></TextArea>
          <div className="flex gap-4 mb-2">
            <Button type="primary" onClick={async () => {
              await hr_ApproveVisaFile(file.user, token);
              navigate("/hr-dashboard/visa-status-management", {state:{type:'all'}});
            }}>
              Approve
            </Button>
            <Button onClick={async () => {
              await hr_RejectVisaFile(file.user, feedback, token);
              navigate("/hr-dashboard/visa-status-management", {state:{type:'all'}});
            }}>Reject</Button>
          </div>
        </>
      )}
    </>
  );
}
