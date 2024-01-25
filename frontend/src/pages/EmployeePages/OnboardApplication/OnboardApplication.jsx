import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Button, DatePicker, Select, Upload, Space, Avatar, message } from 'antd';
import { UploadOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { submitPersonalInfo, updatePersonalInfo } from '../../../redux/personalInfo/personalInfoSlice';
import { submitOptReceiptAPI } from '../../../services/document';
import { downloadPersonalFileAPI, previewPersonalFileAPI } from '../../../services/personalFiles';
const { Option } = Select;

export default function OnboardApplication() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { registerEmail, userID, token } = useSelector((state) => state.user.info);
    const { status, feedback } = useSelector((state) => state.personalInfo.info.onboardingInfo ?? {});
    const { info, loading } = useSelector((state) => state.personalInfo ?? {});
    const { files } = useSelector((state) => state.personalFiles);
    const isFormDisabled = status === 'pending';
    const defaultAvatarUrl = 'https://www.pngitem.com/pimgs/m/137-1370051_avatar-generic-avatar-hd-png-download.png';

    useEffect(() => {
        if (status === 'approved') {
            navigate("/employee-dashboard/personal-info", { replace: true });
        }
    }, [status]);

    const onFinish = async (values) => {
        if (values.emergencyContacts.length < 1) {
            alert('At least one emergency contact!');
            return;
        }
        const trimmedValues = Object.keys(values).reduce((acc, key) => {
            acc[key] = typeof values[key] === 'string' ? values[key].trim() : values[key];
            return acc;
        }, {});
        const personalInfoData = {
            ...trimmedValues,
            dob: trimmedValues.dob.format('YYYY-MM-DD'),
            employmentDetails: {
                ...trimmedValues.employmentDetails,
                startDate: trimmedValues.employmentDetails.startDate.format('YYYY-MM-DD'),
                endDate: trimmedValues.employmentDetails.endDate.format('YYYY-MM-DD')
            },
            profilePictureURL: defaultAvatarUrl
        };
        if (status === "rejected") {
            personalInfoData.onboardingInfo = info.onboardingInfo;
            try {
                await dispatch(updatePersonalInfo({ personalInfoData, userID, token })).unwrap();
                if (trimmedValues.optReceipt[0]) {
                    await submitOptReceiptAPI(trimmedValues.optReceipt[0].originFileObj, token, 'optReceipt');
                }
                message.success('Onboarding application updated successfully!');
            } catch (error) {
                message.error(`Submission failed: ${error.message}`);
            }
        } else {
            try {
                await dispatch(submitPersonalInfo({ personalInfoData, userID, token })).unwrap();
                await submitOptReceiptAPI(trimmedValues.optReceipt[0].originFileObj, token, 'optReceipt');
                message.success('Onboarding application submitted successfully!');
            } catch (error) {
                message.error(`Submission failed: ${error.message}`);
            }
        }
        console.log(personalInfoData);
        navigate(0);
    };

    const handleFileDownload = async (accessURL) => {
        await downloadPersonalFileAPI(accessURL, token)
    }

    const handleFilePreview = async (accessURL) => {
        await previewPersonalFileAPI(accessURL, token)
    }

    const initialValues = useMemo(() => {
        if (status === 'pending' || status === 'rejected') {
            return {
                email: registerEmail,
                firstName: info.firstName,
                lastName: info.lastName,
                middleName: info.middleName,
                preferredName: info.preferredName,
                address: info.address,
                cellPhoneNumber: info.cellPhoneNumber,
                workPhoneNumber: info.workPhoneNumber,
                ssn: info.ssn,
                dob: moment.utc(info.dob),
                gender: info.gender,
                emergencyContacts: info.emergencyContacts,
                reference: info.reference,
                workAuth: {
                    isCitizen: info.workAuth.isCitizen ? "yes" : "no",
                    workAuthType: info.workAuth.workAuthType
                },
                employmentDetails: {
                    visaTitle: info.employmentDetails.visaTitle,
                    startDate: moment.utc(info.employmentDetails.startDate),
                    endDate: moment.utc(info.employmentDetails.endDate)
                }
            };
        } else {
            return {
                email: registerEmail,
                emergencyContacts: [{}]
            };
        }
    }, [registerEmail, status, info]);

    if (loading) {
        return <div className='flex justify-center pt-80'>Loading...</div>;
    }
    return (
        <div id="content" className='w-full flex-col pt-2'>
            <div className='flex justify-center text-3xl font-bold mb-5'>Onboarding Application Page</div>
            <div className='flex justify-center text-xl font-bold mb-5'>Current Status: {status ? status : "Never submitted"}</div>
            {status === "rejected" && <div className='flex justify-center text-xl font-bold mb-5'>Feedback: {feedback}</div>}
            {status === "pending" && <div className='flex justify-center text-xl font-bold mb-5'>Please wait for HR to review your application</div>}
            <div className='w-full flex justify-center'>
                <Form
                    name="onboardingForm"
                    className="w-1/2 "
                    onFinish={onFinish}
                    layout="vertical"
                    initialValues={initialValues}
                >
                    {/* Basic Info */}
                    <div className='text-xl font-bold'>Basic Info:</div><br />
                    <Form.Item
                        name="firstName"
                        label="First Name"
                        rules={[{
                            required: true,
                            whitespace: true, message: 'Please input your first name!'
                        }]}
                    >
                        <Input disabled={isFormDisabled} />
                    </Form.Item>
                    <Form.Item
                        name="lastName"
                        label="Last Name"
                        rules={[{
                            required: true,
                            whitespace: true, message: 'Please input your last name!'
                        }]}
                    >
                        <Input disabled={isFormDisabled} />
                    </Form.Item>
                    <Form.Item name="middleName" label="Middle Name">
                        <Input disabled={isFormDisabled} />
                    </Form.Item>
                    <Form.Item name="preferredName" label="Preferred Name">
                        <Input disabled={isFormDisabled} />
                    </Form.Item>

                    {/* Profile Picture */}
                    <Form.Item name="profilePicture" label="Default Profile Picture:">
                        <Avatar size={64} src={defaultAvatarUrl} />
                    </Form.Item>

                    <div className='text-xl font-bold'>Address:</div><br />
                    {/* Address */}
                    <Form.Item
                        name={['address', 'unitNumber']}
                        label="Building/Apt #"
                        rules={[{
                            required: true,
                            whitespace: true, message: 'Please input your building or apartment number!'
                        }]}
                    >
                        <Input disabled={isFormDisabled} />
                    </Form.Item>

                    <Form.Item
                        name={['address', 'streetName']}
                        label="Street Name"
                        rules={[{
                            required: true,
                            whitespace: true, message: 'Please input your street name!'
                        }]}
                    >
                        <Input disabled={isFormDisabled} />
                    </Form.Item>

                    <Form.Item
                        name={['address', 'city']}
                        label="City"
                        rules={[{
                            required: true,
                            whitespace: true, message: 'Please input your city!'
                        }]}
                    >
                        <Input disabled={isFormDisabled} />
                    </Form.Item>

                    <Form.Item
                        name={['address', 'state']}
                        label="State"
                        rules={[{
                            required: true,
                            whitespace: true, message: 'Please select your state!'
                        }]}
                    >
                        <Input disabled={isFormDisabled} />
                    </Form.Item>

                    <Form.Item
                        name={['address', 'zip']}
                        label="Zip"
                        rules={[{
                            required: true,
                            whitespace: true, message: 'Please input your zip code!'
                        }]}
                    >
                        <Input disabled={isFormDisabled} />
                    </Form.Item>

                    {/* Phone Numbers */}
                    <div className='text-xl font-bold'>Contact Info:</div><br />
                    <Form.Item
                        name="cellPhoneNumber"
                        label="Cell Phone Number"
                        rules={[{
                            required: true,
                            whitespace: true, message: 'Please input your cell phone number!'
                        }]}
                    >
                        <Input disabled={isFormDisabled} />
                    </Form.Item>
                    <Form.Item name="workPhoneNumber" label="Work Phone Number">
                        <Input disabled={isFormDisabled} />
                    </Form.Item>

                    {/* Email */}
                    <Form.Item
                        name="email"
                        label="Default Email"
                        rules={[{
                            required: true,
                            message: 'Please input your email!'
                        }]}
                    >
                        <Input disabled />
                    </Form.Item>

                    {/* SSN, Date of Birth and Gender */}
                    <div className='text-xl font-bold'>Identity Info:</div><br />
                    <Form.Item
                        name="ssn"
                        label="Social Security Number"
                        rules={[{
                            required: true,
                            whitespace: true, message: 'Please input your SSN!'
                        }]}
                    >
                        <Input disabled={isFormDisabled} />
                    </Form.Item>
                    <Form.Item
                        name="dob"
                        label="Date of Birth"
                        rules={[{
                            required: true,
                            message: 'Please input your date of birth!'
                        }]}
                    >
                        <DatePicker disabled={isFormDisabled} />
                    </Form.Item>
                    <Form.Item
                        name="gender"
                        label="Gender"
                        rules={[{
                            required: true,
                            whitespace: true, message: 'Please select your gender!'
                        }]}
                    >
                        <Select placeholder="Select your gender" disabled={isFormDisabled}>
                            <Option value="Male">Male</Option>
                            <Option value="Female">Female</Option>
                            <Option value="notSpecified">I do not wish to answer</Option>
                        </Select>
                    </Form.Item>

                    {/* Permanent resident or citizen */}
                    <Form.Item name={['workAuth', 'isCitizen']} label="Permanent resident or citizen of the U.S.?" rules={[{ required: true }]}>
                        <Select disabled={isFormDisabled}>
                            <Option value="yes">Yes</Option>
                            <Option value="no">No</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        shouldUpdate={(prevValues, currentValues) => prevValues.workAuth?.isCitizen !== currentValues.workAuth?.isCitizen}
                        noStyle
                    >
                        {({ getFieldValue }) => {
                            if (getFieldValue(['workAuth', 'isCitizen']) === 'yes') {
                                return (
                                    <Form.Item
                                        name={['workAuth', 'citizenType']}
                                        label="Please select your status"
                                        rules={[{ required: true }]}
                                    >
                                        <Select disabled={isFormDisabled}>
                                            <Option value="greenCard">Green Card</Option>
                                            <Option value="citizen">Citizen</Option>
                                        </Select>
                                    </Form.Item>
                                );
                            }
                            // work authorization
                            if (getFieldValue(['workAuth', 'isCitizen']) === 'no') {
                                return (
                                    <Form.Item
                                        name={['workAuth', 'workAuthType']}
                                        label="What is your work authorization?"
                                        rules={[{ required: true }]}
                                    >
                                        <Select disabled={isFormDisabled}>
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
                        shouldUpdate={(prevValues, currentValues) => prevValues.workAuth?.workAuthType !== currentValues.workAuth?.workAuthType
                            || prevValues.workAuth?.isCitizen !== currentValues.workAuth?.isCitizen}
                        noStyle
                    >
                        {({ getFieldValue }) => {
                            if (getFieldValue(['workAuth', 'isCitizen']) === 'no' && getFieldValue(['workAuth', 'workAuthType']) === 'F1CPTOPT' && !isFormDisabled) {
                                return (
                                    <Form.Item
                                        name="optReceipt"
                                        label="Your OPT Receipt:"
                                        valuePropName="fileList"
                                        getValueFromEvent={(e) => {
                                            if (Array.isArray(e)) {
                                                return e;
                                            }
                                            return e && e.fileList;
                                        }}
                                        rules={[{ required: !(files.some(file => file.fileType === 'optReceipt')), message: 'Please upload your OPT receipt!' }]}
                                    >
                                        <Upload beforeUpload={() => false} listType="text " maxCount={1}>
                                            <Button icon={<UploadOutlined />}>Click to upload</Button>
                                        </Upload>
                                    </Form.Item>
                                );
                            }
                            if (getFieldValue(['workAuth', 'isCitizen']) === 'no' && getFieldValue(['workAuth', 'workAuthType']) === 'other') {
                                return (
                                    <Form.Item
                                        name={['employmentDetails', 'visaTitle']}
                                        label="Specify your Visa Title"
                                        rules={[{
                                            required: true,
                                            whitespace: true, message: 'Please specify your visa title!'
                                        }]}
                                    >
                                        <Input disabled={isFormDisabled} />
                                    </Form.Item>
                                );
                            }
                            return null;
                        }}
                    </Form.Item>

                    <Form.Item
                        shouldUpdate={(prevValues, currentValues) => prevValues.workAuth?.isCitizen !== currentValues.workAuth?.isCitizen}
                        noStyle
                    >
                        {({ getFieldValue }) => {
                            if (getFieldValue(['workAuth', 'isCitizen']) === 'no') {
                                return (
                                    <Form.Item
                                        name={['employmentDetails', 'startDate']}
                                        label="Start Date"
                                        rules={[{
                                            required: true,
                                            message: 'Please select your start date!'
                                        }]}
                                    >
                                        <DatePicker disabled={isFormDisabled} />
                                    </Form.Item>
                                );
                            }
                            return null;
                        }}
                    </Form.Item>

                    <Form.Item
                        shouldUpdate={(prevValues, currentValues) => prevValues.workAuth?.isCitizen !== currentValues.workAuth?.isCitizen}
                        noStyle
                    >
                        {({ getFieldValue }) => {
                            if (getFieldValue(['workAuth', 'isCitizen']) === 'no') {
                                return (
                                    <Form.Item
                                        name={['employmentDetails', 'endDate']}
                                        label="End Date"
                                        rules={[{
                                            required: true,
                                            message: 'Please select your end date!'
                                        }]}
                                    >
                                        <DatePicker disabled={isFormDisabled} />
                                    </Form.Item>
                                );
                            }
                            return null;
                        }}
                    </Form.Item>

                    {/* Referrer */}
                    <div className='text-xl font-bold'>Reference:</div>
                    <Form.Item
                        name={['reference', 'firstName']}
                        label="First Name"
                        rules={[{
                            required: true,
                            whitespace: true, message: 'Please input the first name!'
                        }]}
                    >
                        <Input disabled={isFormDisabled} />
                    </Form.Item>
                    <Form.Item
                        name={['reference', 'lastName']}
                        label="Last Name"
                        rules={[{
                            required: true,
                            whitespace: true, message: 'Please input the last name!'
                        }]}
                    >
                        <Input disabled={isFormDisabled} />
                    </Form.Item>
                    <Form.Item
                        name={['reference', 'phone']}
                        label="Phone"
                        rules={[{
                            required: true,
                            whitespace: true, message: 'Please input the phone number!'
                        }]}
                    >
                        <Input disabled={isFormDisabled} />
                    </Form.Item>
                    <Form.Item
                        name={['reference', 'email']}
                        label="Email"
                        rules={[{
                            required: true,
                            whitespace: true, message: 'Please input the email address!'
                        }]}
                    >
                        <Input disabled={isFormDisabled} />
                    </Form.Item>
                    <Form.Item
                        name={['reference', 'relationship']}
                        label="Relationship"
                        rules={[{
                            required: true,
                            whitespace: true, message: 'Please input the relationship!'
                        }]}
                    >
                        <Input disabled={isFormDisabled} />
                    </Form.Item>
                    {/* Emergency Contacts */}
                    <label className='text-xl font-bold'>Emergency Contacts</label><br /><br />
                    <Form.List
                        name="emergencyContacts"
                    >
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Space key={key} direction="vertical" style={{ marginBottom: 10 }} >
                                        <label className='text-lg'>Emergency Contact</label>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'firstName']}
                                            label="First Name"
                                            rules={[{
                                                required: true,
                                                whitespace: true, message: 'First name is required'
                                            }]}
                                            className='mb-2'
                                        >
                                            <Input disabled={isFormDisabled} />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'lastName']}
                                            label="Last Name"
                                            rules={[{
                                                required: true,
                                                whitespace: true, message: 'Last name is required'
                                            }]}
                                            className='mb-2'
                                        >
                                            <Input disabled={isFormDisabled} />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            label="Middle Name"
                                            name={[name, 'middleName']}
                                            className='mb-2'
                                        >
                                            <Input disabled={isFormDisabled} />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'phone']}
                                            label="Phone"
                                            rules={[{
                                                required: true,
                                                whitespace: true, message: 'Phone is required'
                                            }]}
                                            className='mb-2'
                                        >
                                            <Input disabled={isFormDisabled} />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'email']}
                                            label="Email"
                                            rules={[{
                                                required: true,
                                                whitespace: true, message: 'Email is required'
                                            }]}
                                            className='mb-2'
                                        >
                                            <Input disabled={isFormDisabled} />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'relationship']}
                                            label="Relationship"
                                            rules={[{
                                                required: true,
                                                whitespace: true, message: 'Relationship is required'
                                            }]}
                                            className='mb-0'
                                        >
                                            <Input disabled={isFormDisabled} />
                                        </Form.Item>
                                        {fields.length > 1 && !isFormDisabled && <MinusCircleOutlined onClick={() => remove(name)} />}
                                    </Space>
                                ))}
                                {!isFormDisabled &&
                                    <Form.Item>
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            Add Emergency Contact
                                        </Button>
                                    </Form.Item>
                                }

                            </>
                        )}
                    </Form.List>

                    {/* Uploaded Documents */}
                    <div className='text-xl font-bold'>Uploaded Documents:</div><br />
                    {files.map((file, index) => (
                        <Form.Item
                            key={index}
                        >
                            <div className='flex justify-between'>
                                <span>{file.originalFileName}</span>
                                <u onClick={() => handleFilePreview(file.access)}>preview</u>
                                <u onClick={() => handleFileDownload(file.access)}>download</u>
                            </div>
                        </Form.Item>
                    ))}

                    {!isFormDisabled &&
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                {status === "rejected" ? "Resubmit" : "Submit"}
                            </Button>
                        </Form.Item>
                    }
                </Form>
            </div>
        </div>
    )
}
