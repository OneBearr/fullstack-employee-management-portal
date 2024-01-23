import { Document, Page } from "react-pdf";
import { Input, Button } from "antd";
const { TextArea } = Input;

export default function DocumentReview() {
  const options = {
    httpHeaders: {
      "x-auth-token":
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjVhOWYyZjc4MTFiMDU5ZDhkNmMwNGJjIn0sImlhdCI6MTcwNTk1MzE2MywiZXhwIjoxNzA4NTQ1MTYzfQ.9W9J5rPXNAmaRPeOOPBBDpCBlW6n3eXZrCCXPjNWygI",
    },
  };
  return (
    <>
      <Document
        file="http://localhost:3000/api/hrDownload/opt-1705741110625-8.pdf"
        options={options}
      >
        <Page />
      </Document>
      <h4>Feedback</h4>
      <TextArea></TextArea>
      <Button>Approve</Button>
      <Button>Reject</Button>
    </>
  );
}
