"use client"
import {IoClose} from "react-icons/io5";
import {Cancel} from "./ActionsIcon";

export default function HeaderSection(
    {
        onClick,
        title
    }) {
    return (
        <div className={"flex gap-2 justify-between items-center p-2"}>
            <h4 className={"font-semibold text-slate-700"}>{title}</h4>
            <Cancel onClick={onClick} />
        </div>
    )
}