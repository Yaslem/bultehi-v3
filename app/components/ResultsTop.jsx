import {LuSchool2} from "react-icons/lu";
import classNames from "classnames";
import {Link, useLocation, useParams} from "@remix-run/react";
import {PageTitle} from "./PageControlButtons.jsx";

export default function ResultsTop({session, year, type, url}){
    const result = useParams().resultId
    const pathName = `/${url}/${result}`
    return (
        <div className={"flex flex-col md:flex-row md:items-center justify-between gap-4"}>
            <div className={"flex flex-col gap-2 md:gap-4"}>
                {
                    session !== null
                        ? <PageTitle slug={session.slug} type={"session"} title={session.name} />
                        : <PageTitle type={"title"} title={type.name} />
                }
                <PageTitle type={"year"} title={'سنة ' + year.name} />
            </div>
            <div className={classNames({
                "grid gap-2 md:gap-4": true,
                "grid-cols-3 md:grid-cols-5": type.slug === 5,
                "grid-cols-3 md:grid-cols-4": type.slug !== 5,
            })}>
                {
                    type.slug === 5 &&
                    <Link to={pathName + "/types"} className={"flex bg-teal-50 border-teal-200 cursor-pointer items-center p-2 flex-col gap-4 border rounded-lg"}>
                        <LuSchool2 className={"text-5xl text-teal-700 hover:text-teal-600"} />
                        <span className={"text-sm font-medium text-teal-700 hover:text-teal-600"}>الشّعب</span>
                    </Link>
                }
                <Link to={pathName + "/states"} className={"flex bg-indigo-50 border-indigo-200 cursor-pointer items-center p-2 flex-col gap-4 border rounded-lg"}>
                    <LuSchool2 className={"text-5xl text-indigo-700 hover:text-indigo-600"} />
                    <span className={"text-sm font-medium text-indigo-700 hover:text-indigo-600"}>الولايات</span>
                </Link>
                <Link to={pathName + "/counties"} className={"flex bg-amber-50 border-amber-200 cursor-pointer items-center p-2 flex-col gap-4 border rounded-lg"}>
                    <LuSchool2 className={"text-5xl text-amber-700 hover:text-amber-600"} />
                    <span className={"text-sm font-medium text-amber-700 hover:text-amber-600"}>المقاطعات</span>
                </Link>
                <Link to={pathName + "/schools"} className={"flex bg-green-50 border-green-200 cursor-pointer items-center p-2 flex-col gap-4 border rounded-lg"}>
                    <LuSchool2 className={"text-5xl text-green-700 hover:text-green-600"} />
                    <span className={"text-sm font-medium text-green-700 hover:text-green-600"}>المدارس</span>
                </Link>
                <Link to={pathName + "/centers"} className={"flex bg-sky-50 border-sky-200 cursor-pointer items-center p-2 flex-col gap-4 border rounded-lg"}>
                    <LuSchool2 className={"text-5xl text-sky-700 hover:text-sky-600"} />
                    <span className={"text-sm font-medium text-sky-700 hover:text-sky-600"}>المراكز</span>
                </Link>
            </div>
        </div>
    )
}