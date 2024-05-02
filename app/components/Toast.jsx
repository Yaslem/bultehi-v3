"use client"
import {FaCheck} from "react-icons/fa6";
import {IoCloseSharp} from "react-icons/io5";
import {useEffect} from "react";
import {BiBlock} from "react-icons/bi";
import {useDispatch, useSelector} from "react-redux";
import {useFetcher} from "@remix-run/react";
import {toastActions} from "../redux/slices/toastSlice.js";
import classNames from "classnames";

export default function Toast(){
    const fetcher = useFetcher();
    const errors = fetcher.data
    const dispatch = useDispatch()
    const toast = useSelector(state => state.toast);

    setTimeout(() => {
        dispatch(toastActions.setIsShow(false))
    }, 4000)

    useEffect(() => {
        if(errors){
            if(errors?.status === "success"){
                dispatch(toastActions.setIsShow(true))
                dispatch(toastActions.setStatus(errors?.status))
                dispatch(toastActions.setMessage(errors?.message))
            }else {
                dispatch(toastActions.setIsShow(true))
                dispatch(toastActions.setStatus(errors?.status))
                dispatch(toastActions.setMessage(errors?.message))
            }
        }
    }, [errors]);

    return (
        toast.isShow && <section className={"fixed bg-white max-w-[300px] top-4 z-[5000] right-4 flex gap-4 overflow-hidden border border-dashed rounded-lg shadow-md"}>
                <span className={classNames({
                    "bg-green-50 border-l border-dashed rounded-bl-full w-16 flex items-center justify-center p-2": true,
                    "bg-red-50": toast.status === "error"
                })}>
                    {
                        toast.status === "success"
                            ? <FaCheck className={"text-3xl text-green-600"} />
                            : <BiBlock className={"text-3xl text-red-600"} />
                    }
                </span>
            <div className={"flex flex-grow flex-col p-2 gap-2"}>
                <h4 className={"text-xl text-slate-600 font-bold"}>
                    {
                        toast.status === "success"
                            ? "ممتاز 🙌"
                            : "خطأ 😩"
                    }
                </h4>
                <p className={"text-xs leading-6 font-medium text-slate-500"}>{toast.message}</p>
            </div>
            <span onClick={() => dispatch(toastActions.setIsShow(false))} className={"p-2 flex items-center cursor-pointer m-1 rounded-full bg-stone-50 w-8 h-8 justify-center"}>
                    <IoCloseSharp className={"text-xl text-red-600 hover:text-red-500"} />
                </span>
        </section>
    )
}