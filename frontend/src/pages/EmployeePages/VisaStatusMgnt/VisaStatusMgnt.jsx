import { useState } from 'react';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, Upload, Button, message } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import { downloadPersonalFileAPI, previewPersonalFileAPI } from '../../../services/personalFiles';
import { submitOptReceiptAPI } from '../../../services/document';

export default function VisaStatusMgnt() {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.user.info);
  const { files } = useSelector((state) => state.personalFiles);
  const { visaStatus } = useSelector((state) => state.employeeVisaStatus);
  const [fileList, setFileList] = useState([]);

  const optReceiptFile = visaStatus.optReceipt.file ? files.find(file => file._id === visaStatus.optReceipt.file) : {};
  const optEADFile = visaStatus.optEAD.file ? files.find(file => file._id === visaStatus.optEAD.file) : {};
  const I983File = visaStatus.I983.file ? files.find(file => file._id === visaStatus.I983.file) : {};
  const I20File = visaStatus.I20.file ? files.find(file => file._id === visaStatus.I20.file) : {};


  const handleFileDownload = async (accessURL) => {
    await downloadPersonalFileAPI(accessURL, token)
  }

  const handleFilePreview = async (accessURL) => {
    await previewPersonalFileAPI(accessURL, token)
  }

  const handleSubmit = async (fileType) => {
    if (fileList.length === 0) {
      message.error('Please upload a file first!');
      return;
    }
    try {
      const response = await submitOptReceiptAPI(fileList[0].originFileObj, token, fileType);
      console.log(response)
      message.success('Document submitted successfully!');
      navigate(0);
    } catch (error) {
      message.error('Document submitted failed!');
    }
    setFileList([]);
  };

  return (
    <div id="content"  className="pt-2">
      <div className='flex justify-center text-3xl font-bold'> Visa Status Page</div><br />
      
      {/* Uploaded Documents */}
      <div className='flex justify-center text-xl font-bold'>Uploaded Documents:</div><br />
      <div className='w-full flex justify-center'>
        <Form
          layout='vertical'
          className='w-full'
        >
          {/* OPT Receipt */}
          {visaStatus.optReceipt.file &&
            <Form.Item
              label={<span className='font-bold'>OPT Receipt: </span>}
            >
              <div className='flex justify-between mb-2'>
                <div>File Name: {optReceiptFile.originalFileName}</div>
                <div>Status: {visaStatus.optReceipt.status}</div>
                <u onClick={() => handleFilePreview(optReceiptFile.access)}>preview</u>
                <u onClick={() => handleFileDownload(optReceiptFile.access)}>download</u>
              </div>
              <div className='flex justify-around font-bold mt-5 mb-3'>
                {visaStatus.optReceipt.status == "pending" && <div>Waiting for HR to approve your OPT Receipt</div>}
                {visaStatus.optReceipt.status == "rejected" && <div>Feedback: {visaStatus.feedback}</div>}
                {visaStatus.optReceipt.status == "approved" && !visaStatus.optEAD.file &&
                  <div>Please upload a copy of your OPT EAD</div>}
              </div>
              {visaStatus.optReceipt.status == "rejected" &&
                <div className='flex justify-around'>
                  <Upload
                    beforeUpload={() => false}
                    onChange={({ fileList }) => setFileList(fileList)}
                    fileList={fileList}
                    maxCount={1}
                  >
                    <Button icon={<UploadOutlined />}>Select your updated OPT Receipt</Button>
                  </Upload>
                  {fileList[0] &&
                    <Button type="primary" onClick={() => handleSubmit('optReceipt')}>
                      Save and Submit
                    </Button>}
                </div>
              }
            </Form.Item>
          }
          {/* Upload next document: OPT EAD */}
          {(!visaStatus.optEAD.file && visaStatus.optReceipt.status == "approved") &&
            <Form.Item
              label={<span className='font-bold'>OPT EAD: </span>}
            >
              <div className='flex justify-around'>
                <Upload
                  beforeUpload={() => false}
                  onChange={({ fileList }) => setFileList(fileList)}
                  fileList={fileList}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Select your OPT EAD</Button>
                </Upload>
                {fileList[0] &&
                  <Button type="primary" onClick={() => handleSubmit('optEAD')}>
                    Save and Submit
                  </Button>}
              </div>
            </Form.Item>
          }

          {/* OPT EAD */}
          {visaStatus.optEAD.file &&
            <Form.Item
              label={<span className='font-bold'>OPT EAD: </span>}
            >
              <div className='flex justify-between mb-2'>
                <div>File Name: {optEADFile.originalFileName}</div>
                <div>Status: {visaStatus.optEAD.status}</div>
                <u onClick={() => handleFilePreview(optEADFile.access)}>preview</u>
                <u onClick={() => handleFileDownload(optEADFile.access)}>download</u>
              </div>
              <div className='flex justify-around font-bold mt-5 mb-3'>
                {visaStatus.optEAD.status == "pending" && <div>Waiting for HR to approve your OPT EAD</div>}
                {visaStatus.optEAD.status == "rejected" && <div>Feedback: {visaStatus.feedback}</div>}
                {visaStatus.optEAD.status == "approved" && !visaStatus.I983.file &&
                  <div>Please download and fill out the I-983 form</div>}
              </div>
              {visaStatus.optEAD.status == "rejected" &&
                <div className='flex justify-around'>
                  <Upload
                    beforeUpload={() => false}
                    onChange={({ fileList }) => setFileList(fileList)}
                    fileList={fileList}
                    maxCount={1}
                  >
                    <Button icon={<UploadOutlined />}>Select your updated OPT EAD</Button>
                  </Upload>
                  {fileList[0] &&
                    <Button type="primary" onClick={() => handleSubmit('optEAD')}>
                      Save and Submit
                    </Button>}
                </div>
              }
            </Form.Item>
          }
          {/* Upload next document: I983 */}
          {(!visaStatus.I983.file && visaStatus.optEAD.status == "approved") &&
            <Form.Item
              label={<span className='font-bold'>I983: </span>}
            >
              <div>
                <div className='flex justify-around'>
                  <u>Download I983 Empty Template</u>
                  <u>Download I983 Sample Template</u>
                </div>
                <div className='flex justify-around mt-5'>
                <Upload
                    beforeUpload={() => false}
                    onChange={({ fileList }) => setFileList(fileList)}
                    fileList={fileList}
                    maxCount={1}
                  >
                    <Button icon={<UploadOutlined />}>Select your I983</Button>
                  </Upload>
                  {fileList[0] &&
                    <Button type="primary" onClick={() => handleSubmit('I983')}>
                      Save and Submit
                    </Button>}
                </div>
              </div>

            </Form.Item>
          }

          {/* I983 */}
          {visaStatus.I983.file &&
            <Form.Item
              label={<span className='font-bold'>I983: </span>}
            >
              <div className='flex justify-between mb-2'>
                <div>File Name: {I983File.originalFileName}</div>
                <div>Status: {visaStatus.I983.status}</div>
                <u onClick={() => handleFilePreview(I983File.access)}>preview</u>
                <u onClick={() => handleFileDownload(I983File.access)}>download</u>
              </div>
              <div className='flex justify-around font-bold mt-5 mb-3'>
                {visaStatus.I983.status == "pending" && <div>Waiting for HR to approve and sign your I983</div>}
                {visaStatus.I983.status == "rejected" && <div>Feedback: {visaStatus.feedback}</div>}
                {visaStatus.I983.status == "approved" && !visaStatus.I20.file &&
                  <div>Please send the I-983 along with all necessary documents to your school and upload the new I-20</div>}
              </div>
              {visaStatus.I983.status == "rejected" &&
                <div className='flex justify-around'>
                  <Upload
                    beforeUpload={() => false}
                    onChange={({ fileList }) => setFileList(fileList)}
                    fileList={fileList}
                    maxCount={1}
                  >
                    <Button icon={<UploadOutlined />}>Select your updated I983</Button>
                  </Upload>
                  {fileList[0] &&
                    <Button type="primary" onClick={() => handleSubmit('I983')}>
                      Save and Submit
                    </Button>}
                </div>
              }
            </Form.Item>
          }
          {/* Upload next document: I20 */}
          {(!visaStatus.I20.file && visaStatus.I983.status == "approved") &&
            <Form.Item
              label={<span className='font-bold'>I20: </span>}
            >
              <div className='flex justify-around'>
                <Upload
                  beforeUpload={() => false}
                  onChange={({ fileList }) => setFileList(fileList)}
                  fileList={fileList}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Select your I20</Button>
                </Upload>
                {fileList[0] &&
                  <Button type="primary" onClick={() => handleSubmit('I20')}>
                    Save and Submit
                  </Button>}
              </div>
            </Form.Item>
          }

          {/* I20 */}
          {visaStatus.I20.file &&
            <Form.Item
              label={<span className='font-bold'>I20: </span>}
            >
              <div className='flex justify-between mb-2'>
                <div>File Name: {I20File.originalFileName}</div>
                <div>Status: {visaStatus.I20.status}</div>
                <u onClick={() => handleFilePreview(I20File.access)}>preview</u>
                <u onClick={() => handleFileDownload(I20File.access)}>download</u>
              </div>
              <div className='flex justify-around font-bold mt-5 mb-3'>
                {visaStatus.I20.status == "pending" && <div>Waiting for HR to approve your I20</div>}
                {visaStatus.I20.status == "rejected" && <div>Feedback: {visaStatus.feedback}</div>}
                {visaStatus.I20.status == "approved" && <div>Congratulation! All documents have been approved.</div>}
              </div>
              {visaStatus.I20.status == "rejected" &&
                <div className='flex justify-around'>
                  <Upload
                    beforeUpload={() => false}
                    onChange={({ fileList }) => setFileList(fileList)}
                    fileList={fileList}
                    maxCount={1}
                  >
                    <Button icon={<UploadOutlined />}>Select your updated I20</Button>
                  </Upload>
                  {fileList[0] &&
                    <Button type="primary" onClick={() => handleSubmit('I20')}>
                      Save and Submit
                    </Button>}
                </div>
              }
            </Form.Item>
          }
        </Form>
      </div>
    </div>
  )
}
