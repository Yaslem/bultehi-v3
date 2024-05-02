import {Link, Outlet} from "@remix-run/react";
import TitleCategory from "../components/TitleCategory.jsx";
import Section from "../components/Section.jsx";
import Breadcrumb from "../components/Breadcrumb.jsx"
import {generatePageTitle} from "../helpers/Global.js";
const title = "مسابقة ختم الدروس الإعدادية"
export const meta = ({ matches }) => {
    return generatePageTitle({matches, current: title});
};

// export const handle = {
//     breadcrumb: () => <Link className={"text-indigo-700 hover:text-indigo-600"} to="/middle">{title}</Link>,
// };
export default function Middle() {
    return (
        <section className={"flex flex-col gap-3"}>
            {/*<TitleCategory title={title} des={"يحتوي هذا القسم على كتب مدرسية ومقالات علمية، ونتائج مسابقة وطنية."} />*/}
            <Breadcrumb />
            <Outlet />
        </section>
    )
}