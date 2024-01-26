import { Input, Table, Tag, Button } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import ErrorPage from "../../ErrorPage/ErrorPage";
import { hr_GetVisaStatusAPI, hr_SendNotification} from "../../../services/hr";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import moment from 'moment';
import { downloadPersonalFileAPI } from '../../../services/personalFiles';
const { Search } = Input;

function InProgressEmployeeTable (props) {
    const { token } = useSelector((state) => state.user.info);

    const sendNotification = async (user, subject, text) => {
        await hr_SendNotification(user, subject, text, token);
    };

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name"
        },
        {
            title: "Work Authorization",
            children: [
                {
                    title: "Title",
                    key: "title",
                    dataIndex: ["employmentDetails", "visaTitle"],
                },
                {
                    title: "Start and End date",
                    key: "date",
                    dataIndex: "employmentDetails",
                    render: (data)=>{
                        const startDate = moment(data.startDate).format("MM/DD/YYYY");
                        const endDate = moment(data.endDate).format("MM/DD/YYYY");
                        return <p>{startDate} - {endDate}</p>
                    }
                },
                {
                    title: "Number of Days Remaining",
                    key: "remainingDays",
                    dataIndex: "employmentDetails",
                    render: (data)=>{
                        const days = (new Date(data.endDate) - new Date(data.startDate))/((1000 * 3600 * 24));
                        return <p>{days}</p>
                    }
                },
            ]
        },
        {
            title: "Next steps",
            key: "nextStep",
            render: (_, {optReceipt, optEAD, I983, I20})=>{
                if(optReceipt.status==="no submit"){
                    return <Tag color="blue">Waiting for OPT receipt summit</Tag>
                }
                else if (optReceipt.status==="pending"){
                    return <Tag color="yellow">Waiting for HR to approve OPT receipt</Tag>
                }
                else if (optReceipt.status==="rejected"){
                    return <Tag color="red">Waiting for OPT receipt resummit</Tag>
                }

                if(optEAD.status==="no submit"){
                    return <Tag color="blue">Waiting for OPT EAD summit</Tag>
                }
                else if (optEAD.status==="pending"){
                    return <Tag color="yellow">Waiting for HR to approve OPT EAD</Tag>
                }
                else if (optEAD.status==="rejected"){
                    return <Tag color="red">Waiting for OPT EAD resummit</Tag>
                }

                if(I983.status==="no submit"){
                    return <Tag color="blue">Waiting for I983 summit</Tag>
                }
                else if (I983.status==="pending"){
                    return <Tag color="yellow">Waiting for HR to approve I983</Tag>
                }
                else if (I983.status==="rejected"){
                    return <Tag color="red">Waiting for I983 resummit</Tag>
                }

                if(I20.status==="no submit"){
                    return <Tag color="blue">Waiting for I20 summit</Tag>
                }
                else if (I20.status==="pending"){
                    return <Tag color="yellow">Waiting for HR to approve I20</Tag>
                }
                else if (I20.status==="rejected"){
                    return <Tag color="red">Waiting for I20 resummit</Tag>
                }

                return <Tag color="green">All Approved</Tag>
            }
        },
        {
            title: "Action",
            key: "action",
            render: (_, {user, optReceipt, optEAD, I983, I20})=>{
                let subject = "";
                let text = "";
                let flag = false;
                if(optReceipt.status==="no submit"|| optReceipt.status==="rejected"){
                    subject = "Reminder for OPT receipt submit";
                    text = "Please submit your OPT receipt as soon as possible";
                    flag = true;
                }
                else if(optEAD.status==="no submit"|| optEAD.status==="rejected"){
                    subject = "Reminder for OPT EAD submit";
                    text = "Please submit your OPT EAD as soon as possible";
                    flag = true;
                }
                else if(I983.status==="no submit"|| I983.status==="rejected"){
                    subject = "Reminder for I983 submit";
                    text = "Please submit your I983 as soon as possible";
                    flag = true;
                }
                else if(I20.status==="no submit" || I20.status==="rejected"){
                    subject = "Reminder for I20 submit";
                    text = "Please submit your I20 as soon as possible";
                    flag = true;
                }

                if(flag){
                    return <Button type="primary" onClick={()=>sendNotification(user, subject, text)}>Send Notification</Button>
                }
                else{
                    return <Tag color="green">All Approved</Tag>
                }
            }
        },
    ];

    return (<Table columns={columns} dataSource={props.data==false? [] : props.data}></Table>)
}

function AllEmployeeTable (props) {
    const { token } = useSelector((state) => state.user.info);
    const navigate = useNavigate();

    const handleFileDownload = async (file) => {
        await downloadPersonalFileAPI(file.hrAccess, token);
    }
  
    const handleFilePreview = async (file, optReceipt, optEAD, I983, I20, feedback) => {
        let approved = true;
        if(file._id === optReceipt.file){
            if(optReceipt.status !== "approved"){
                approved = false;
            }
        }
        else if(file._id === optEAD.file){
            if(optEAD.status !== "approved"){
                approved = false;
            }
        }
        else if(file._id === I983.file){
            if(I983.status !== "approved"){
                approved = false;
            }
        }
        else if(file._id === I20.file){
            if(I20.status !== "approved"){
                approved = false;
            }
        }

        navigate(`/hr-dashboard/document/${file.originalFileName}`, {
            state:{
                file: file,
                approved: approved,
                feedback: feedback
            }
        });
        //await previewPersonalFileAPI(file.hrAccess, token);
    }

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name"
        },
        {
            title: "Work Authorization",
            children: [
                {
                    title: "Title",
                    key: "title",
                    dataIndex: ["employmentDetails", "visaTitle"],
                },
                {
                    title: "Start and End date",
                    key: "date",
                    dataIndex: "employmentDetails",
                    render: (data)=>{
                        const startDate = moment(data.startDate).format("MM/DD/YYYY");
                        const endDate = moment(data.endDate).format("MM/DD/YYYY");
                        return <p>{startDate} - {endDate}</p>
                    }
                },
                {
                    title: "Number of Days Remaining",
                    key: "remainingDays",
                    dataIndex: "employmentDetails",
                    render: (data)=>{
                        const days = (new Date(data.endDate) - new Date(data.startDate))/((1000 * 3600 * 24));
                        return <p>{days}</p>
                    }
                },
            ]
        },
        {
            title: "Next steps",
            key: "nextStep",
            render: (_, {optReceipt, optEAD, I983, I20})=>{
                if(optReceipt.status==="no submit"){
                    return <Tag color="blue">Waiting for OPT receipt summit</Tag>
                }
                else if (optReceipt.status==="pending"){
                    return <Tag color="yellow">Waiting for HR to approve OPT receipt</Tag>
                }
                else if (optReceipt.status==="rejected"){
                    return <Tag color="red">Waiting for OPT receipt resummit</Tag>
                }

                if(optEAD.status==="no submit"){
                    return <Tag color="blue">Waiting for OPT EAD summit</Tag>
                }
                else if (optEAD.status==="pending"){
                    return <Tag color="yellow">Waiting for HR to approve OPT EAD</Tag>
                }
                else if (optEAD.status==="rejected"){
                    return <Tag color="red">Waiting for OPT EAD resummit</Tag>
                }

                if(I983.status==="no submit"){
                    return <Tag color="blue">Waiting for I983 summit</Tag>
                }
                else if (I983.status==="pending"){
                    return <Tag color="yellow">Waiting for HR to approve I983</Tag>
                }
                else if (I983.status==="rejected"){
                    return <Tag color="red">Waiting for I983 resummit</Tag>
                }

                if(I20.status==="no submit"){
                    return <Tag color="blue">Waiting for I20 summit</Tag>
                }
                else if (I20.status==="pending"){
                    return <Tag color="yellow">Waiting for HR to approve I20</Tag>
                }
                else if (I20.status==="rejected"){
                    return <Tag color="red">Waiting for I20 resummit</Tag>
                }

                return <Tag color="green">All Approved</Tag>
            }
        },
        {
            title: "Documents",
            key: "Documents",
            render: ({files, optReceipt, optEAD, I983, I20, feedback})=>{
                return (files.map((file, index)=>(
                <div className='flex justify-between gap-4' key= {index}>
                    <span>{file.originalFileName}</span>
                    <u onClick={() => handleFilePreview(file, optReceipt, optEAD, I983, I20, feedback)}>preview</u>
                    <u onClick={() => handleFileDownload(file)}>download</u>
                  </div>
                )))
            }
        },
    ];

    return (
    <>
        <Search placeholder="input search text" allowClear></Search>
        <Table columns={columns} dataSource={props.data==false? [] : props.data}></Table>
    </>
    )
}

export default function HrVisaStatusManagement () {
    const location = useLocation();
    const type = location.state?.type || 'all';
    const { token } = useSelector((state) => state.user.info);

    const [inProcessList, setInProcessList] = useState([]);
    const [allList, setAllList] = useState([]);

    useEffect (()=>{
        hr_GetVisaStatusAPI(token)
        .then((data)=>{
            setInProcessList(data.map((item)=>{
                if(item.onboardingInfo?.status !== "approved"){
                    return item;
                }
            }))
            setAllList(data);
        })
    },[]);

    if(type === 'in-progress'){
        return (<InProgressEmployeeTable data={inProcessList}></InProgressEmployeeTable>);
    }
    else if(type === 'all'){
        return (<AllEmployeeTable data={allList}></AllEmployeeTable>);
    }
    else{
        return (<ErrorPage></ErrorPage>)
    }
}