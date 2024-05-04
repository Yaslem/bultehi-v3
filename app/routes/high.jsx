import {Link, Outlet} from "@remix-run/react";
import TitleCategory from "../components/TitleCategory.jsx";
import Section from "../components/Section.jsx";
import Breadcrumb from "../components/Breadcrumb.jsx"
import {generatePageTitle} from "../helpers/Global.js";

export const meta = ({ matches }) => {
    return generatePageTitle({matches, current: "مسابقة ختم الدروس الثانوية"});
};

// export const handle = {
//     breadcrumb: () => <Link className={"text-indigo-700 hover:text-indigo-600"} to="/high">مسابقة ختم الدروس الثانوية</Link>,
// };
export default function High() {
    return (
        <section className={"flex flex-col"}>
            {/* <TitleCategory title={"التعليم الثانوي"} des={"يحتوي هذا القسم على كتب مدرسية ومقالات علمية، ونتائج مسابقة وطنية."} /> */}
            <Breadcrumb />
            <Outlet />
        </section>
    )
}