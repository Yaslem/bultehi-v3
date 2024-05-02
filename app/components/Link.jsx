import { Link } from "@remix-run/react";
import classNames from "classnames"
import {LuLogIn} from "react-icons/lu";

export default function LinkBtn({title, link, isFull = false}){
    return (
        <Link
            className={classNames({
                "rounded-lg text-xs p-2 text-center font-medium bg-indigo-700 hover:bg-indigo-600 text-white ring-1 border ring-stone-200 flex items-center justify-center": true,
                "w-full": isFull,
                "w-fit": !isFull,
            })}
            to={link || "/"}>
            <LuLogIn className={"text-xl md:hidden"}/>
            <span className={"hidden md:block"}>{title || ""}</span>
        </Link>
    )
}