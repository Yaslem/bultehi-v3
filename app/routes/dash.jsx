import {json, Link, Outlet} from "@remix-run/react";
import Sidebar from "../components/dash/Sidebar.jsx";
import {generatePageTitle} from "../helpers/Global.js";
import {getUserAuthenticated} from "../services/auth.server.js";
import {redirect} from "@remix-run/node";

export async function loader({request}) {
    const user = await getUserAuthenticated(request)
    if(user.role !== "ADMIN"){
        return redirect("/")
    }
    return json({})

}

export const meta = ({ matches }) => {
    return generatePageTitle({matches, current: "القيادة"});
};

export const handle = {
    breadcrumb: () => <Link className={"text-indigo-700 hover:text-indigo-600"} to="/dash">القيادة</Link>,
};

export default function Dash() {
    return (
        <section className={"flex relative h-full"}>
            <Sidebar />
            <main className={"flex-grow w-[85%] flex flex-col"}>
                <Outlet />
            </main>
        </section>
    )
}