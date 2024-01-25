import React, { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Button, Modal, DatePicker, Select, Avatar, message } from "antd";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { updatePersonalInfo } from '../../../redux/personalInfo/personalInfoSlice';
import { downloadPersonalFileAPI, previewPersonalFileAPI } from '../../../services/personalFiles';
import { hr_fetchPersonalInfo } from '../../../redux/personalInfo/personalInfoSlice';
import { hr_fetchPersonalFiles } from '../../../redux/personalFiles/personalFilesSlice';
import { hr_ApproveApplication, hr_RejectApplication } from "../../../services/hr";
const { Option } = Select;

export default function PersonalInfo() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  let { userID, token, isHR } = useSelector((state) => state.user.info);
  let { files } = useSelector((state) => state.personalFiles);
  let { info, loading } = useSelector((state) => state.personalInfo ?? {});
  // if you are HR, try to get the 'files' and 'info' of the employee by using your HR APIs 
  // may need before render or re-render the Form
  let { id } = useParams();
  let viewApplication = useLocation().pathname.includes("application");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    // if no user in the store, redirect to the welcome home page
    if (!isHR) {
      if (!userID) {
        navigate("/employee-dashboard", { replace: true });
      } else if (!info.firstName) {   // if no submission yet, redirect to the onboarding page
        navigate("/employee-dashboard/onboarding", { replace: true });
      }
    }
    else{
      dispatch(hr_fetchPersonalInfo({userID: id, token}));
      dispatch(hr_fetchPersonalFiles({userID: id, token}));
    }
  }, [info.firstName, userID, isHR]);

  const handleEdit = () => {
    form.resetFields();
    setIsEditing(true);
  };

  const handleCancel = () => {
    Modal.confirm({
      title: 'Discard Changes?',
      content: 'Do you want to discard all of your changes?',
      onOk: () => {
        form.resetFields();
        setIsEditing(false);
      },
    });
  };

  const handleSave = () => {
    form.submit();
    setIsEditing(false);
  };

  const onFinish = async (values) => {
    if (values.emergencyContacts.length < 1) {
      alert('At least one emergencyContact');
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
      onboardingInfo: info.onboardingInfo
    };

    try {
      await dispatch(updatePersonalInfo({ personalInfoData, userID, token })).unwrap();
      message.success('Information updated successfully!');
    } catch (error) {
      message.error(`Information update failed: ${error.message}`);
    }
    console.log(personalInfoData);
  };

  const handleFileDownload = async (file) => {
      const accessURL = isHR ? file.hrAccess : file.access;
      await downloadPersonalFileAPI(accessURL, token);  // employee token here!
  }

  const handleFilePreview = async (file) => {
      const accessURL = isHR ? file.hrAccess : file.access;
      await previewPersonalFileAPI(accessURL, token);   // employee token here!
  }

  const initialValues = useMemo(() => {
    return {
      email: info.email,
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
    }
  }, [info]);

  if (loading) {
    return <div className='flex justify-center pt-80'>Loading...</div>;
  }

  return (
    <div id="content" className="pt-2">
      <div className='flex justify-center text-3xl font-bold mb-5'>{viewApplication? "View Application":"Personal Information Page"}</div>
      <div className="flex justify-end pr-20 mr-20">
        {!isHR && (isEditing ? (
          <div>
            <Button onClick={handleSave} type="primary" >
              Save
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </div>
        ) : (
          <Button onClick={handleEdit}>Edit</Button>
        ))}
      </div>
      <div className='w-full flex justify-center ml-5'>
        <Form
          name="onboardingForm"
          className="w-1/2"
          onFinish={onFinish}
          layout="vertical"
          initialValues={initialValues}
          form={form}
        >
          {/* Basic Info */}
          <div className='text-xl font-bold'>Basic Info:</div><br />
          <Form.Item
            name="firstName"
            label="First Name: "
            rules={[{
              required: true,
              whitespace: true, message: 'Please input your first name!'
            }]}
          >
            {isEditing ? (
              <Input />
            ) : (
              <div>{info.firstName}</div>
            )}
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Last Name: "
            rules={[{
              required: true,
              whitespace: true, message: 'Please input your last name!'
            }]}
          >
            {isEditing ? (
              <Input />
            ) : (
              <div>{info.lastName}</div>
            )}
          </Form.Item>
          <Form.Item name="middleName" label="Middle Name: ">
            {isEditing ? (
              <Input />
            ) : (
              <div>{info.middleName}</div>
            )}
          </Form.Item>
          <Form.Item name="preferredName" label="Preferred Name: ">
            {isEditing ? (
              <Input />
            ) : (
              <div>{info.preferredName}</div>
            )}
          </Form.Item>

          {/* Profile Picture */}
          <Form.Item name="profilePicture" label="Default Profile Picture:">
            <Avatar size={64} src={info.profilePictureURL} />
          </Form.Item>

          {/* Address */}
          <div className='text-xl font-bold'>Address:</div><br />
          <Form.Item
            name={['address', 'unitNumber']}
            label="Building/Apt#: "
            rules={[{
              required: true,
              whitespace: true, message: 'Please input your building or apartment number!'
            }]}
          >
            {isEditing ? (
              <Input />
            ) : (
              <div>{info.address.unitNumber}</div>
            )}
          </Form.Item>
          <Form.Item
            name={['address', 'streetName']}
            label="Street Name: "
            rules={[{
              required: true,
              whitespace: true, message: 'Please input your street name!'
            }]}
          >
            {isEditing ? (
              <Input />
            ) : (
              <div>{info.address.streetName}</div>
            )}
          </Form.Item>
          <Form.Item
            name={['address', 'city']}
            label="City: "
            rules={[{
              required: true,
              whitespace: true, message: 'Please input your city!'
            }]}
          >
            {isEditing ? (
              <Input />
            ) : (
              <div>{info.address.city}</div>
            )}
          </Form.Item>
          <Form.Item
            name={['address', 'state']}
            label="State: "
            rules={[{
              required: true,
              whitespace: true, message: 'Please select your state!'
            }]}
          >
            {isEditing ? (
              <Input />
            ) : (
              <div>{info.address.state}</div>
            )}
          </Form.Item>
          <Form.Item
            name={['address', 'zip']}
            label="Zip: "
            rules={[{
              required: true,
              whitespace: true, message: 'Please input your zip code!'
            }]}
          >
            {isEditing ? (
              <Input />
            ) : (
              <div>{info.address.zip}</div>
            )}
          </Form.Item>

          {/* Phone Numbers */}
          <div className='text-xl font-bold'>Contact Info:</div><br />
          <Form.Item
            name="cellPhoneNumber"
            label="Cell Phone Number: "
            rules={[{
              required: true,
              whitespace: true, message: 'Please input your cell phone number!'
            }]}
          >
            {isEditing ? (
              <Input />
            ) : (
              <div>{info.cellPhoneNumber}</div>
            )}
          </Form.Item>
          <Form.Item name="workPhoneNumber" label="Work Phone Number: ">
            {isEditing ? (
              <Input />
            ) : (
              <div>{info.workPhoneNumber}</div>
            )}
          </Form.Item>

          {/* Email */}
          <Form.Item
            name="email"
            label="Email: "
            rules={[{
              required: true,
              whitespace: true, message: 'Please input your email!'
            }]}
          >
            {isEditing ? (
              <Input />
            ) : (
              <div>{info.email}</div>
            )}
          </Form.Item>

          {/* SSN, Date of Birth and Gender */}
          <div className='text-xl font-bold'>Identity Info:</div><br />
          <Form.Item
            name="ssn"
            label="Social Security Number: "
            rules={[{
              required: true,
              whitespace: true, message: 'Please input your SSN!'
            }]}
          >
            {isEditing ? (
              <Input />
            ) : (
              <div>{info.ssn}</div>
            )}
          </Form.Item>
          <Form.Item
            name="dob"
            label="Date of Birth: "
            rules={[{
              required: true,
              message: 'Please input your date of birth!'
            }]}
          >
            {isEditing ? (
              <DatePicker />
            ) : (
              <div>{moment.utc(info.dob).format('YYYY-MM-DD')}</div>
            )}
          </Form.Item>
          <Form.Item
            name="gender"
            label="Gender: "
            rules={[{
              required: true,
              whitespace: true, message: 'Please select your gender!'
            }]}
          >
            {isEditing ? (
              <Select placeholder="Select your gender" >
                <Option value="Male">Male</Option>
                <Option value="Female">Female</Option>
                <Option value="notSpecified">I do not wish to answer</Option>
              </Select>
            ) : (
              <div>{info.gender}</div>
            )}
          </Form.Item>

          {/* Permanent resident or citizen */}
          <Form.Item name={['workAuth', 'isCitizen']} label="Permanent resident or citizen of the U.S.?" rules={[{ required: true }]}>
            {isEditing ? (
              <Select >
                <Option value="yes">Yes</Option>
                <Option value="no">No</Option>
              </Select>
            ) : (
              <div>{info.workAuth.isCitizen ? "Yes" : "No"}</div>
            )}
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
                    {isEditing ? (
                      <Select>
                        <Option value="greenCard">Green Card</Option>
                        <Option value="citizen">Citizen</Option>
                      </Select>
                    ) : (
                      <div>{info.workAuth.citizenType}</div>
                    )}

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
                    {isEditing ? (
                      <Select>
                        <Option value="H1B">H1-B</Option>
                        <Option value="L2">L2</Option>
                        <Option value="F1CPTOPT">F1 (CPT/OPT)</Option>
                        <Option value="H4">H4</Option>
                        <Option value="other">Other</Option>
                      </Select>
                    ) : (
                      <div>{info.workAuth.workAuthType}</div>
                    )}

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
                    {isEditing ? (
                      <Input disabled={!isEditing} />
                    ) : (
                      <div>{info.employmentDetails.visaTitle}</div>
                    )}

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
                    {isEditing ? (
                      <DatePicker />
                    ) : (
                      <div>{moment.utc(info.employmentDetails.startDate).format('YYYY-MM-DD')}</div>
                    )}

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
                    {isEditing ? (
                      <DatePicker />
                    ) : (
                      <div>{moment.utc(info.employmentDetails.endDate).format('YYYY-MM-DD')}</div>
                    )}
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
            {isEditing ? (
              <Input />
            ) : (
              <div>{info.reference.firstName}</div>
            )}
          </Form.Item>
          <Form.Item
            name={['reference', 'lastName']}
            label="Last Name"
            rules={[{
              required: true,
              whitespace: true, message: 'Please input the last name!'
            }]}
          >
            {isEditing ? (
              <Input />
            ) : (
              <div>{info.reference.lastName}</div>
            )}
          </Form.Item>
          <Form.Item
            name={['reference', 'phone']}
            label="Phone"
            rules={[{
              required: true,
              whitespace: true, message: 'Please input the phone number!'
            }]}
          >
            {isEditing ? (
              <Input />
            ) : (
              <div>{info.reference.phone}</div>
            )}
          </Form.Item>
          <Form.Item
            name={['reference', 'email']}
            label="Email"
            rules={[{
              required: true,
              whitespace: true, message: 'Please input the email address!'
            }]}
          >
            {isEditing ? (
              <Input />
            ) : (
              <div>{info.reference.email}</div>
            )}
          </Form.Item>
          <Form.Item
            name={['reference', 'relationship']}
            label="Relationship"
            rules={[{
              required: true,
              whitespace: true, message: 'Please input the relationship!'
            }]}
          >
            {isEditing ? (
              <Input />
            ) : (
              <div>{info.reference.relationship}</div>
            )}
          </Form.Item>

          {/* Emergency Contacts */}
          <label className='text-xl font-bold'>Emergency Contacts:</label><br /><br />
          <Form.List
            name="emergencyContacts"
            layout="vertical"
          >
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => {
                  return (
                    // <Space key={key} direction="vertical" style={{ marginBottom: 10 }} >
                    <div key={key} className="mb-5">
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
                        {isEditing ? (
                          <Input />
                        ) : (
                          <div>{info.emergencyContacts[name]?.firstName}</div>
                        )}
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
                        {isEditing ? (
                          <Input />
                        ) : (
                          <div>{info.emergencyContacts[name]?.lastName}</div>
                        )}
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        label="Middle Name"
                        name={[name, 'middleName']}
                        className='mb-2'
                      >
                        {isEditing ? (
                          <Input />
                        ) : (
                          <div>{info.emergencyContacts[name]?.middleName}</div>
                        )}
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
                        {isEditing ? (
                          <Input />
                        ) : (
                          <div>{info.emergencyContacts[name]?.phone}</div>
                        )}
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
                        {isEditing ? (
                          <Input />
                        ) : (
                          <div>{info.emergencyContacts[name]?.email}</div>
                        )}
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
                        {isEditing ? (
                          <Input />
                        ) : (
                          <div>{info.emergencyContacts[name]?.relationship}</div>
                        )}
                      </Form.Item>
                      {fields.length > 1 && isEditing && <MinusCircleOutlined onClick={() => remove(name)} />}
                    </div>
                    // {/* </Space> */}
                  );
                })}
                <Form.Item>
                  {isEditing &&
                    <Button disabled={!isEditing} type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      Add Emergency Contact
                    </Button>
                  }
                </Form.Item>
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
                <u onClick={() => handleFilePreview(file)}>preview</u>
                <u onClick={() => handleFileDownload(file)}>download</u>
              </div>
            </Form.Item>
          ))}
        </Form>
      </div>

      {/* Hr view application */}
      {
        viewApplication && info.onboardingInfo.status !== "approved" && (
          <>
            <div className='text-xl font-bold'>Feedback:</div><br />
            <Input.TextArea className="mb-2" rows={4} placeholder={info.onboardingInfo.feedback} onChange={(e)=>{
              setFeedback(e.target.value);
            }}></Input.TextArea>
            <div className="flex gap-4 mb-2">
              <Button type="primary" onClick={async ()=>{
                await hr_ApproveApplication(id, token);
              }}>Approve</Button>
              <Button onClick={async ()=>{
                await hr_RejectApplication(id, feedback, token)
              }}>Reject</Button>
            </div>
          </>
        )
      }
    </div>
  );
}
