import React from 'react';
import { useSelector } from "react-redux";
import { Form } from "antd";
import { downloadPersonalFileAPI, previewPersonalFileAPI } from '../../../services/personalFiles';

export default function VisaStatusMgnt() {
  const { files } = useSelector((state) => state.personalFiles);
  const { token } = useSelector((state) => state.user.info);

  const handleFileDownload = async (accessURL) => {
    await downloadPersonalFileAPI(accessURL, token)
}

const handleFilePreview = async (accessURL) => {
    await previewPersonalFileAPI(accessURL, token)
}
  return (
    <div id="content">
      <div className='flex justify-center text-3xl font-bold'> Visa Status Page</div><br />

      {/* Uploaded Documents */}
      <div className='flex justify-center text-xl font-bold'>Uploaded Documents:</div><br />
      <div className='w-full flex justify-center'>
        <Form
          layout='vertical'
          className='w-full'
        >
          {files.map((file, index) => (
            <Form.Item
              key={index}
              label={`${file.fileType}: `}
            >
              <div className='flex justify-around'>
                <div>File: {file.originalFileName}</div>
                <div>Status: pending</div>
                <u onClick={() => handleFilePreview(file.access)}>preview</u>
                <u onClick={() => handleFileDownload(file.access)}>download</u>
              </div>
            </Form.Item>
          ))}
        </Form>
      </div>
    </div>
  )
}
