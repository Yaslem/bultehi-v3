import {TbChecks} from "react-icons/tb";
import {MdCancel} from "react-icons/md";
import classNames from "classnames";
import {useDispatch, useSelector} from "react-redux";
import {toastActions} from "../redux/slices/toastSlice.js";
import {useEffect} from "react";
import { AiTwotoneDelete } from "react-icons/ai";

export default function Notify() {
    const dispatch = useDispatch()
    const toast = useSelector(state => state.toast);

    function getIcon() {
        switch (toast.status) {
            case "error": {
                return <MdCancel className={"text-4xl"}/>
            }
            case "success": {
                return <TbChecks className={"text-4xl"}/>
            }
        }
    }
    return (
        toast.isShow &&
        <div
            className={classNames({
                "border p-2 flex text-yellow-700 items-center gap-4 bg-yellow-50 border-yellow-200": true,
                "text-yellow-700 bg-yellow-50 border-yellow-200": toast.status === "success",
                "text-red-700 bg-red-50 border-red-200": toast.status === "error",
            })}>
            { getIcon() }
            <p className={"text-sm font-medium"}>{toast.message}</p>
            <span className={"mr-auto"}>
                <AiTwotoneDelete onClick={() => dispatch(toastActions.setIsShow(false))} className={"text-2xl cursor-pointer"}/>
            </span>
        </div>
    )
}