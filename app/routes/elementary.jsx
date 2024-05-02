import {Link, Outlet} from "@remix-run/react";
import TitleCategory from "../components/TitleCategory.jsx";
import Section from "../components/Section.jsx";
import Breadcrumb from "../components/Breadcrumb.jsx"
import {generatePageTitle} from "../helpers/Global.js";
const title = "مسابقة ختم الدروس الابتدائية"
export const meta = ({ matches }) => {
    return generatePageTitle({matches, current: title});
};

// export const handle = {
//     breadcrumb: () => <Link className={"text-indigo-700 hover:text-indigo-600"} to="/elementary">{title}</Link>,
// };
export default function Elementary() {
    return (
        <section className={"flex flex-col gap-3"}>
            {/*<TitleCategory title={title} des={"هي مسابقة تجريها وزارة التعليم الأساسي كل سنة تعليمية، للانتقال من مرحلة إلى أخرى."} />*/}
            <Breadcrumb />
            <Outlet />
        </section>
    )
}