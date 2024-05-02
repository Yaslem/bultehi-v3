import { Link } from "@remix-run/react";
import { useLocation } from "@remix-run/react";
import {AiOutlineException} from "react-icons/ai";
export default function LinkCategories(
    {
        link,
        title,
        icon
    }) {
    const location = useLocation();
    return (
        <Link to={location.pathname + link}>
            <li className={"flex group hover:bg-indigo-700 p-2 items-center gap-2"}>
                {icon}
                <span className={"text-sm text-slate-700 group-hover:text-white font-medium"}>{title}</span>
            </li>
        </Link>
    )
}