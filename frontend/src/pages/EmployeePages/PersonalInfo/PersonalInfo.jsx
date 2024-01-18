import React, { useState } from "react";
import { Form, Input, Button, Modal, DatePicker } from "antd";
import moment from 'moment';

export default function PersonalInfo() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "Ethan",
    lastName: "Yi",
    middleName: "",
    preferredName: "",
    email: "yxs@gmail.com",
    SSN: "321123321",
    dob: moment("2010-01-01"),
    gender: "male",
    buildingAptNum: "2101",
    streetName: "1st St",
    city: "San Jose",
    state: "CA",
    zip: "95112",
    cellNumber: "4081234567",
    workNumber: "4087654321",
    visaTitle: "F1",
    startDate: moment("2024-01-01"),
    endDate: moment("2027-01-01"),
    emergencyContact: {
      firstName: "Xiongsheng",
      lastName: "Yi",
      middleName: "",
      phoneNumber: "4089874567",
      email: "emergency@gmail.com",
      relationship: "friend"
    },
  });
  const [tempFormData, setTempFormData] = useState({ ...formData });
  const [dob, setDob] = useState(tempFormData.dob);
  const [startDate, setStartDate] = useState(tempFormData.startDate);
  const [endDate, setEndDate] = useState(tempFormData.endDate);

  const handleEdit = () => {
    setTempFormData({ ...formData });
    setIsEditing(true);
  };

  const handleCancel = () => {
    Modal.confirm({
      title: 'Discard Changes?',
      content: 'Do you want to discard all of your changes?',
      onOk: () => {
        setTempFormData({ ...formData });
        setIsEditing(false);
      },
    });
  };

  const handleSave = () => {
    setFormData({ ...tempFormData });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setTempFormData({ ...tempFormData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (val, fieldName) => {
    if (fieldName === "dob") {
      setDob(val);
    } else if (fieldName === "startDate") {
      setStartDate(val);
    }else if (fieldName === "endDate") {
      setEndDate(val);
    }
    setTempFormData({ ...tempFormData, [fieldName]: val });
  }

  return (
    <div id="content">
      <div className='flex justify-center text-3xl font-bold mb-5'>Personal Information Page</div>
      <div className="flex justify-end">
        {isEditing ? (
          <div>
            <Button onClick={handleSave} type="primary" >
              Save
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </div>
        ) : (
          <Button onClick={handleEdit}>Edit</Button>
        )}
      </div>
      <div className=''>
        <Form layout="vertical">
          <Form.Item label="First Name:">
            {isEditing ? (
              <Input
                name="firstName"
                value={tempFormData.firstName}
                onChange={handleChange}
              />
            ) : (
              <span>{formData.firstName}</span>
            )}
          </Form.Item>
          <Form.Item label="Last Name:">
            {isEditing ? (
              <Input
                name="lastName"
                value={tempFormData.lastName}
                onChange={handleChange}
              />
            ) : (
              <span>{formData.lastName}</span>
            )}
          </Form.Item>
          <Form.Item label="Middle Name:">
            {isEditing ? (
              <Input
                name="middleName"
                value={tempFormData.middleName}
                onChange={handleChange}
              />
            ) : (
              <span>{formData.middleName}</span>
            )}
          </Form.Item>
          <Form.Item label="Preferred Name:">
            {isEditing ? (
              <Input
                name="preferredName"
                value={tempFormData.preferredName}
                onChange={handleChange}
              />
            ) : (
              <span>{formData.preferredName}</span>
            )}
          </Form.Item>
          <Form.Item label="Email:">
            {isEditing ? (
              <Input
                name="email"
                value={tempFormData.email}
                onChange={handleChange}
              />
            ) : (
              <span>{formData.email}</span>
            )}
          </Form.Item>
          <Form.Item label="SSN:">
            {isEditing ? (
              <Input
                name="SSN"
                value={tempFormData.SSN}
                onChange={handleChange}
              />
            ) : (
              <span>{formData.SSN}</span>
            )}
          </Form.Item>
          <Form.Item label="Date of Birth">
            {isEditing ? (
              <DatePicker value={dob} onChange={(val) => handleDateChange(val, "dob")}/>
            ) : (
              <span>{formData.dob.format('YYYY-MM-DD')}</span>
            )} 
          </Form.Item>
          <Form.Item label="Gender:">
            {isEditing ? (
              <Input
                name="gender"
                value={tempFormData.gender}
                onChange={handleChange}
              />
            ) : (
              <span>{formData.gender}</span>
            )}
          </Form.Item>

          <Form.Item label="Bld Apt Number:">
            {isEditing ? (
              <Input
                name="buildingAptNum"
                value={tempFormData.buildingAptNum}
                onChange={handleChange}
              />
            ) : (
              <span>{formData.buildingAptNum}</span>
            )}
          </Form.Item>
          
          <Form.Item label="Street:">
            {isEditing ? (
              <Input
                name="streetName"
                value={tempFormData.streetName}
                onChange={handleChange}
              />
            ) : (
              <span>{formData.streetName}</span>
            )}
          </Form.Item>
          <Form.Item label="City:">
            {isEditing ? (
              <Input
                name="city"
                value={tempFormData.city}
                onChange={handleChange}
              />
            ) : (
              <span>{formData.city}</span>
            )}
          </Form.Item>
          <Form.Item label="State:">
            {isEditing ? (
              <Input
                name="state"
                value={tempFormData.state}
                onChange={handleChange}
              />
            ) : (
              <span>{formData.state}</span>
            )}
          </Form.Item>
          <Form.Item label="Zip:">
            {isEditing ? (
              <Input
                name="zip"
                value={tempFormData.zip}
                onChange={handleChange}
              />
            ) : (
              <span>{formData.zip}</span>
            )}
          </Form.Item>

          <Form.Item label="Cell Number:">
            {isEditing ? (
              <Input
                name="cellNumber"
                value={tempFormData.cellNumber}
                onChange={handleChange}
              />
            ) : (
              <span>{formData.cellNumber}</span>
            )}
          </Form.Item>
          <Form.Item label="Work Number:">
            {isEditing ? (
              <Input
                name="workNumber"
                value={tempFormData.workNumber}
                onChange={handleChange}
              />
            ) : (
              <span>{formData.workNumber}</span>
            )}
          </Form.Item>

          <Form.Item label="Visa Title:">
            {isEditing ? (
              <Input
                name="visaTitle"
                value={tempFormData.visaTitle}
                onChange={handleChange}
              />
            ) : (
              <span>{formData.visaTitle}</span>
            )}
          </Form.Item>
          <Form.Item label="Start Date:">
            {isEditing ? (
              <DatePicker value={startDate} onChange={(val) => handleDateChange(val, "startDate")}/>
            ) : (
              <span>{formData.startDate.format('YYYY-MM-DD')}</span>
            )} 
          </Form.Item>
          <Form.Item label="End Date:">
            {isEditing ? (
              <DatePicker value={endDate} onChange={(val) => handleDateChange(val, "endDate")}/>
            ) : (
              <span>{formData.endDate.format('YYYY-MM-DD')}</span>
            )} 
          </Form.Item>

        </Form>
      </div>

    </div>
  );
}
