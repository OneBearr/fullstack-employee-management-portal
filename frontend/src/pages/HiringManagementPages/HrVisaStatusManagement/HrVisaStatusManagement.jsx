import { Input, Table, Tag, Button, message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import ErrorPage from "../../ErrorPage/ErrorPage";
import { hr_GetVisaStatusAPI, hr_SendNotification} from "../../../services/hr";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import moment from 'moment';
import { downloadPersonalFileAPI } from '../../../services/personalFiles';
const { Search } = Input;

function InProgressEmployeeTable () {
    const { token } = useSelector((state) => state.user.info);
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [messageApi, contextHolder] = message.useMessage();

    useEffect (()=>{
        hr_GetVisaStatusAPI(token)
        .then((data)=>{
            setData(data.filter((item)=>{
                return !(item.optReceipt.status === "approved" && item.optEAD.status === "approved" && item.I983.status === "approved" && item.I20.status === "approved")
            }));
            setLoading(false);
        })
    },[]);

    const sendNotification = async (user, subject, text) => {
        try{
            await hr_SendNotification(user, subject, text, token);
            messageApi.info("Sent email to the user, please wait for response")
        }
        catch (e){
            messageApi.info(e)
        }
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
                    render: (_, {workAuth})=>{
                        if(workAuth.isCitizen){
                            return <p>Citizen</p>
                        }
                        else{
                            return <p>{workAuth.workAuthType}</p>
                        }
                    }
                },
                {
                    title: "Start and End date",
                    key: "date",
                    dataIndex: "employmentDetails",
                    render: (data)=>{
                        const startDate = moment.utc(data.startDate).format("MM/DD/YYYY");
                        const endDate = moment.utc(data.endDate).format("MM/DD/YYYY");
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
                    return <Tag color="blue">Waiting for OPT receipt submit</Tag>
                }
                else if (optReceipt.status==="pending"){
                    return <Tag color="yellow">Waiting for HR to approve OPT receipt</Tag>
                }
                else if (optReceipt.status==="rejected"){
                    return <Tag color="red">Waiting for OPT receipt resubmit</Tag>
                }

                if(optEAD.status==="no submit"){
                    return <Tag color="blue">Waiting for OPT EAD submit</Tag>
                }
                else if (optEAD.status==="pending"){
                    return <Tag color="yellow">Waiting for HR to approve OPT EAD</Tag>
                }
                else if (optEAD.status==="rejected"){
                    return <Tag color="red">Waiting for OPT EAD resubmit</Tag>
                }

                if(I983.status==="no submit"){
                    return <Tag color="blue">Waiting for I983 submit</Tag>
                }
                else if (I983.status==="pending"){
                    return <Tag color="yellow">Waiting for HR to approve I983</Tag>
                }
                else if (I983.status==="rejected"){
                    return <Tag color="red">Waiting for I983 resubmit</Tag>
                }

                if(I20.status==="no submit"){
                    return <Tag color="blue">Waiting for I20 submit</Tag>
                }
                else if (I20.status==="pending"){
                    return <Tag color="yellow">Waiting for HR to approve I20</Tag>
                }
                else if (I20.status==="rejected"){
                    return <Tag color="red">Waiting for I20 resubmit</Tag>
                }

                return <Tag color="green">All Approved</Tag>
            }
        },
        {
            title: "Action",
            key: "action",
            render: (_, {files, user, optReceipt, optEAD, I983, I20, feedback})=>{
                let viewDocumentId = null; 
                if(optReceipt.status === "pending"){
                    viewDocumentId = optReceipt.file;
                }
                else if (optEAD.status === "pending"){
                    viewDocumentId = optEAD.file;
                }
                else if (I983.status === "pending"){
                    viewDocumentId = I983.file;
                }
                else if (I20.status === "pending"){
                    viewDocumentId = I20.file;
                }

                if(viewDocumentId){
                    const file = files.filter((item)=> (item._id===viewDocumentId))[0];
                    return <Button type="primary" onClick={()=>{
                        navigate(`/hr-dashboard/document/${file.originalFileName}`, {
                            state:{
                                file: file,
                                approved: false,
                                feedback: feedback
                            }
                        });
                    }}>View Document</Button>
                }

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

    return (<>{contextHolder}<Table rowKey="user" loading={loading} columns={columns} dataSource={data}></Table></>)
}

function AllEmployeeTable () {
    const { token } = useSelector((state) => state.user.info);
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect (()=>{
        hr_GetVisaStatusAPI(token)
        .then((data)=>{
            setData(data);
            setLoading(false);
        })
    },[]);

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
                    render: (_, {workAuth})=>{
                        if(workAuth.isCitizen){
                            return <p>Citizen</p>
                        }
                        else{
                            return <p>{workAuth.workAuthType}</p>
                        }
                    }
                },
                {
                    title: "Start and End date",
                    key: "date",
                    dataIndex: "employmentDetails",
                    render: (data)=>{
                        const startDate = moment.utc(data.startDate).format("MM/DD/YYYY");
                        const endDate = moment.utc(data.endDate).format("MM/DD/YYYY");
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
                    return <Tag color="blue">Waiting for OPT receipt submit</Tag>
                }
                else if (optReceipt.status==="pending"){
                    return <Tag color="yellow">Waiting for HR to approve OPT receipt</Tag>
                }
                else if (optReceipt.status==="rejected"){
                    return <Tag color="red">Waiting for OPT receipt resubmit</Tag>
                }

                if(optEAD.status==="no submit"){
                    return <Tag color="blue">Waiting for OPT EAD submit</Tag>
                }
                else if (optEAD.status==="pending"){
                    return <Tag color="yellow">Waiting for HR to approve OPT EAD</Tag>
                }
                else if (optEAD.status==="rejected"){
                    return <Tag color="red">Waiting for OPT EAD resubmit</Tag>
                }

                if(I983.status==="no submit"){
                    return <Tag color="blue">Waiting for I983 submit</Tag>
                }
                else if (I983.status==="pending"){
                    return <Tag color="yellow">Waiting for HR to approve I983</Tag>
                }
                else if (I983.status==="rejected"){
                    return <Tag color="red">Waiting for I983 resubmit</Tag>
                }

                if(I20.status==="no submit"){
                    return <Tag color="blue">Waiting for I20 submit</Tag>
                }
                else if (I20.status==="pending"){
                    return <Tag color="yellow">Waiting for HR to approve I20</Tag>
                }
                else if (I20.status==="rejected"){
                    return <Tag color="red">Waiting for I20 resubmit</Tag>
                }

                return <Tag color="green">All Approved</Tag>
            }
        },
        {
            title: "Documents",
            key: "Documents",
            render: ({files, optReceipt, optEAD, I983, I20, feedback})=>{
                return (files.map((file, index)=>(
                <div className='border-2 border-inherit rounded-lg my-1 p-1' key= {index}>
                    <pre className="text-ellipsis">{file.originalFileName}</pre>
                    <div className="flex gap-4">
                        <u onClick={() => handleFilePreview(file, optReceipt, optEAD, I983, I20, feedback)}>preview</u>
                        <u onClick={() => handleFileDownload(file)}>download</u>
                    </div>
                  </div>
                )))
            }
        },
    ];

    const onSearch = (e) =>{
        const searchText = e.target.value;
        setLoading(true);
        hr_GetVisaStatusAPI(token)
        .then((data)=>{
            if(!searchText || !searchText.trim()){
                setData(data);
                setLoading(false);
                return;
            }
            const newData = data.filter((item)=>(item.name.toLowerCase().includes(searchText.toLowerCase())));
            setData(newData);
            setLoading(false);
        })
    }

    return (
    <>
        <Search className="w-full mt-4 mb-4" placeholder="input search text" allowClear
            onChange={onSearch}>
        </Search>
        <Table rowKey="user" loading={loading} columns={columns} dataSource={data}></Table>
    </>
    )
}

export default function HrVisaStatusManagement () {
    const location = useLocation();
    const type = location.state?.type || 'all';

    if(type === 'in-progress'){
        return (<InProgressEmployeeTable></InProgressEmployeeTable>);
    }
    else if(type === 'all'){
        return (<AllEmployeeTable></AllEmployeeTable>);
    }
    else{
        return (<ErrorPage></ErrorPage>)
    }
}