import React from 'react'
import { Form, Input, Button, DatePicker, Select, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
const { Option } = Select;

export default function OnboardApplication() {

    const onFinish = (values) => {
        console.log('Received values of form: ', values);
    };

    return (
        <div id="content" className='w-full flex-col p-5'>
            <div className='flex justify-center text-3xl font-bold mb-5'>Onboarding Application Page</div>
            <div className='flex justify-center text-xl font-bold mb-5'>Current Status: Not submitted yet</div>
            <div className='w-full flex justify-center'>
                <Form
                    name="onboardingForm"
                    className="w-1/3 "
                    onFinish={onFinish}
                    layout="vertical"
                >
                    {/* Name */}
                    <Form.Item
                        name="firstName"
                        label="First Name"
                        rules={[{ required: true, message: 'Please input your first name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="lastName"
                        label="Last Name"
                        rules={[{ required: true, message: 'Please input your last name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="middleName" label="Middle Name">
                        <Input />
                    </Form.Item>
                    <Form.Item name="preferredName" label="Preferred Name">
                        <Input />
                    </Form.Item>

                    {/* Profile Picture */}
                    <Form.Item name="profilePicture" label="Profile Picture">
                        <Upload name="profilePicture" listType="picture">
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>

                    </Form.Item>

                    <div>Current Address:</div><br />
                    {/* Address */}
                    <Form.Item
                        name="buildingAptNumber"
                        label="Building/Apt #"
                        rules={[{ required: true, message: 'Please input your building or apartment number!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="streetName"
                        label="Street Name"
                        rules={[{ required: true, message: 'Please input your street name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="city"
                        label="City"
                        rules={[{ required: true, message: 'Please input your city!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="state"
                        label="State"
                        rules={[{ required: true, message: 'Please select your state!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="zip"
                        label="Zip"
                        rules={[{ required: true, message: 'Please input your zip code!' }]}
                    >
                        <Input />
                    </Form.Item>

                    {/* Phone Number */}
                    <Form.Item
                        name="cellPhone"
                        label="Cell Phone Number"
                        rules={[{ required: true, message: 'Please input your cell phone number!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="workPhone" label="Work Phone Number">
                        <Input />
                    </Form.Item>

                    {/* Email */}
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, message: 'Please input your email!' }]}
                    >
                        <Input />
                    </Form.Item>

                    {/* SSN, Date of Birth and Gender */}
                    <Form.Item
                        name="ssn"
                        label="Social Security Number"
                        rules={[{ required: true, message: 'Please input your SSN!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="dob"
                        label="Date of Birth"
                        rules={[{ required: true, message: 'Please input your date of birth!' }]}
                    >
                        <DatePicker />
                    </Form.Item>
                    <Form.Item
                        name="gender"
                        label="Gender"
                        rules={[{ required: true, message: 'Please select your gender!' }]}
                    >
                        <Select placeholder="Select your gender">
                            <Option value="male">Male</Option>
                            <Option value="female">Female</Option>
                            <Option value="notSpecified">I do not wish to answer</Option>
                        </Select>
                    </Form.Item>

                    {/* Permanent resident or citizen */}
                    <Form.Item name="usResidentOrCitizen" label="Permanent resident or citizen of the U.S.?" rules={[{ required: true }]}>
                        <Select>
                            <Option value="yes">Yes</Option>
                            <Option value="no">No</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        shouldUpdate={(prevValues, currentValues) => prevValues.usResidentOrCitizen !== currentValues.usResidentOrCitizen}
                        noStyle
                    >
                        {({ getFieldValue }) => {
                            if (getFieldValue('usResidentOrCitizen') === 'yes') {
                                return (
                                    <Form.Item
                                        name="residentStatus"
                                        label="Please select your status"
                                        rules={[{ required: true }]}
                                    >
                                        <Select>
                                            <Option value="greenCard">Green Card</Option>
                                            <Option value="citizen">Citizen</Option>
                                        </Select>
                                    </Form.Item>
                                );
                            }
                            // work authorization
                            if (getFieldValue('usResidentOrCitizen') === 'no') {
                                return (
                                    <Form.Item
                                        name="workAuthorization"
                                        label="What is your work authorization?"
                                        rules={[{ required: true }]}
                                    >
                                        <Select>
                                            <Option value="H1B">H1-B</Option>
                                            <Option value="L2">L2</Option>
                                            <Option value="F1CPTOPT">F1 (CPT/OPT)</Option>
                                            <Option value="H4">H4</Option>
                                            <Option value="other">Other</Option>
                                        </Select>
                                    </Form.Item>
                                );
                            }
                            return null;
                        }
                        }
                    </Form.Item>

                    <Form.Item
                        shouldUpdate={(prevValues, currentValues) => prevValues.workAuthorization !== currentValues.workAuthorization
                            || prevValues.usResidentOrCitizen !== currentValues.usResidentOrCitizen}
                        noStyle
                    >
                        {({ getFieldValue }) => {
                            if (getFieldValue('usResidentOrCitizen') === 'no' && getFieldValue('workAuthorization') === 'F1CPTOPT') {
                                return (
                                    <Form.Item
                                        name="optReceipt"
                                        label="Upload your OPT Receipt"
                                        // valuePropName="fileList"
                                        // getValueFromEvent={normFile}
                                        rules={[{ required: true, message: 'Please upload you OPT receipt!' }]}
                                    >
                                        <Upload name="optReceipt" listType="text"  >
                                            <Button icon={<UploadOutlined />}>Click to upload</Button>
                                        </Upload>
                                    </Form.Item>
                                );
                            }

                            if (getFieldValue('usResidentOrCitizen') === 'no' && getFieldValue('workAuthorization') === 'other') {
                                return (
                                    <Form.Item
                                        name="otherVisaTitle"
                                        label="Specify your Visa Title"
                                        rules={[{ required: true, message: 'Please specify your visa title!' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                );
                            }
                            return null;
                        }}
                    </Form.Item>

                    <Form.Item
                        shouldUpdate={(prevValues, currentValues) => prevValues.usResidentOrCitizen !== currentValues.usResidentOrCitizen}
                        noStyle
                    >
                        {({ getFieldValue }) => {
                            if (getFieldValue('usResidentOrCitizen') === 'no') {
                                return (
                                    <Form.Item
                                        name="startDate"
                                        label="Start Date"
                                        rules={[{ required: true, message: 'Please select your start date!' }]}
                                    >
                                        <DatePicker />
                                    </Form.Item>

                                );
                            }
                            return null;
                        }}
                    </Form.Item>

                    <Form.Item
                        shouldUpdate={(prevValues, currentValues) => prevValues.usResidentOrCitizen !== currentValues.usResidentOrCitizen}
                        noStyle
                    >
                        {({ getFieldValue }) => {
                            if (getFieldValue('usResidentOrCitizen') === 'no') {
                                return (
                                    <Form.Item
                                        name="endDate"
                                        label="End Date"
                                        rules={[{ required: true, message: 'Please select your end date!' }]}
                                    >
                                        <DatePicker />
                                    </Form.Item>
                                );
                            }
                            return null;
                        }}
                    </Form.Item>

                    {/* Referrer */}
                    <Form.Item
                        name="referralFirstName"
                        label="Referral First Name"
                        rules={[{ required: true, message: 'Please input referral first name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="referralLastName"
                        label="Referral Last Name"
                        rules={[{ required: true, message: 'Please input referral last name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="referralMiddleName" label="Referral Middle Name">
                        <Input />
                    </Form.Item>
                    <Form.Item name="referralPhone" label="Referral Phone">
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="referralEmail"
                        label="Referral Email"
                        rules={[{ type: 'email', message: 'Please input a valid email!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="referralRelationship"
                        label="Relationship with Referral"
                        rules={[{ required: true, message: 'Please input your relationship with the referral!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}
