"use client"
import {MdOutlineError} from "react-icons/md";
import classNames from "classnames"

export default function Error({message, status = "error"}){
    return (
        <div className={classNames({
            "flex items-center p-2 border border-dashed rounded-lg gap-2": true,
            "bg-green-50 border-green-200": status === "success",
            "bg-red-50 border-red-200": status === "error",
            "bg-yellow-50 border-yellow-200": status === "alert",
        })}>
            <MdOutlineError className={classNames({
                "text-xl": true,
                "text-green-600": status === "success",
                "text-red-600": status === "error",
                "text-yellow-600": status === "alert",
            })} />
            <span className={classNames({
                "text-xs font-medium": true,
                "text-green-600": status === "success",
                "text-red-600": status === "error",
                "text-yellow-600": status === "alert",
            })}>{message}</span>
        </div>
    )
}