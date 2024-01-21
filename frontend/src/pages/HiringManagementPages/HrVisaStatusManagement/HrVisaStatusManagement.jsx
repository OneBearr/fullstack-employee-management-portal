import { Input, Table } from "antd";
import { useLocation } from "react-router-dom";
import ErrorPage from "../../ErrorPage/ErrorPage";
const { Search } = Input;

function InProgressEmployeeTable (props) {
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
                    dataIndex: "title",
                    key: "title",
                },
                {
                    title: "Start and End date",
                    dataIndex: "date",
                    key: "date",
                },
                {
                    title: "Number of Days Remaining",
                    dataIndex: "remainingDays",
                    key: "remainingDays",
                },
            ]
        },
        {
            title: "Next steps",
            dataIndex: "nextStep",
            key: "nextStep"
        },
        {
            title: "Action",
            dataIndex: "action",
            key: "action"
        },
    ];

    return (<Table columns={columns} dataSource={props.data}></Table>)
}

function AllEmployeeTable (props) {
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
                    dataIndex: "title",
                    key: "title",
                },
                {
                    title: "Start and End date",
                    dataIndex: "date",
                    key: "date",
                },
                {
                    title: "Number of Days Remaining",
                    dataIndex: "remainingDays",
                    key: "remainingDays",
                },
            ]
        },
        {
            title: "Next steps",
            dataIndex: "nextStep",
            key: "nextStep"
        },
        {
            title: "Documents",
            dataIndex: "documents",
            key: "documents",
        },
    ];

    return (
    <>
        <Search placeholder="input search text" allowClear></Search>
        <Table columns={columns} dataSource={props.data}></Table>
    </>
    )
}

export default function HrVisaStatusManagement () {
    const location = useLocation();
    const type = location.state?.type;

    const data = [
        {

        }
    ]

    if(type === 'in-progress'){
        return (<InProgressEmployeeTable data={data}></InProgressEmployeeTable>);
    }
    else if(type === 'all'){
        return (<AllEmployeeTable data={data}></AllEmployeeTable>);
    }
    else{
        return (<ErrorPage></ErrorPage>)
    }
}