import RequestList from "../../components/request-list";
import RequestDetails from "../../components/request-details";

import './main-page.css'


export default function MainPage() {
    return (
        <>
            <div className="page-header"></div>

            <div className="row">
                <div className="col-lg-4 stretch-card mb-2">
                    <RequestList></RequestList>
                </div>
                <div className="col-lg-8 stretch-card mb-2">
                    <RequestDetails></RequestDetails>
                </div>
            </div>
        </>
    )
}