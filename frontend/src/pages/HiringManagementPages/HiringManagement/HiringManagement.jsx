import { useLocation } from "react-router-dom";
import ErrorPage from "../../ErrorPage/ErrorPage";

function Registration (){
    return (<>Registration</>)
}

function ReviewApplications (){
    return (<>ReviewApplications</>)
}

export default function HiringManagement () {
    const location = useLocation();
    const type = location.state?.type;

    if(type==='registration'){
        return (<Registration></Registration>);
    }
    else if(type === 'review'){
        return (<ReviewApplications></ReviewApplications>);
    }
    else{
        return (<ErrorPage></ErrorPage>)
    }
}