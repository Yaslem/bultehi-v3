import {Link, Outlet} from "@remix-run/react";
import {generatePageTitle} from "../helpers/Global.js";
import Breadcrumb from "../components/Breadcrumb.jsx";

export const meta = ({ matches }) => {
    return generatePageTitle({matches, current: "النتائح"});
};

export const handle = {
    breadcrumb: () => <Link className={"text-indigo-700 hover:text-indigo-600"} to="/dash/results">النتائج</Link>,
};

export default function DashResults() {
    return (
        <div className={"flex flex-col"}>
            <Breadcrumb />
            <Outlet />
        </div>
    )
}
