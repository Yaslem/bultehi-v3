"use client"
import Link from "next/link";
import {AiFillEye} from "react-icons/ai";
import {usePathname} from "next/navigation";
import {useState} from "react";
import Result from "./Result";
import {useDispatch, useSelector} from "react-redux";
import {resultActions} from "../../redux/slices/resultSlice";
import {FaUserEdit} from "react-icons/fa";
import {FaTrashCan} from "react-icons/fa6";

export default function ResultTable(
    {
        isUsers = false
    }){
    const pathname = usePathname()
    const dispatch = useDispatch()
    const isOpen = useSelector(state => state.result.isOpen)

    return (
        <div className={"border border-dashed rounded-lg overflow-hidden"}>
            <table className={"w-full border-collapse"}>
                <thead>
                <tr>
                    <th className={"p-3 bg-white text-indigo-700 border-b border-dashed border-r-0 text-sm font-medium text-center"}>الرتبة</th>
                    <th className={"p-3 bg-white text-indigo-700 border-b border-dashed text-sm font-medium  text-center"}>الرقم</th>
                    <th className={"p-3 bg-white text-indigo-700 border-b border-dashed text-sm font-medium  text-center"}>الاسم</th>
                    <th className={"p-3 bg-white text-indigo-700 border-b border-dashed text-sm font-medium text-center"}>المدرسة</th>
                    <th className={"p-3 bg-white text-indigo-700 border-b border-dashed text-sm font-medium  text-center"}>المركز</th>
                    <th className={"p-3 bg-white text-indigo-700 border-b border-dashed text-sm font-medium  text-center"}>النتيجة</th>
                    <th className={"p-3 bg-white text-indigo-700 border-b border-dashed text-sm font-medium  text-center"}>خيارات</th>
                </tr>
                </thead>
                <tbody>
                {
                    isUsers
                        ? <>
                            <tr className={"p-2 even:bg-stone-50 text-xs text-gray-700 font-medium"}>
                                <td className={"p-2 text-center"}>1</td>
                                <td className={"p-2 text-center"}>يسلم أحمد ناجم</td>
                                <td className={"p-2 text-center"}>yeslem.alshanqyti@gmail.com</td>
                                <td className={"p-2 text-center"}>مدون</td>
                                <td className={"p-2 text-center"}>0</td>
                                <td className={"p-2 text-center"}>0</td>
                                <td className={"flex items-center gap-2 justify-evenly p-2"}>
                                    {
                                        isUsers &&
                                        <>
                                    <span className={"w-9 h-9 p-2 rounded-full flex items-center justify-center cursor-pointer bg-green-50 border border-dashed border-green-200"}>
                                        <FaUserEdit className={"text-xl text-green-600 hover:text-green-500"} />
                                    </span>
                                            <span className={"w-9 h-9 p-2 rounded-full flex items-center justify-center cursor-pointer bg-indigo-50 border border-dashed border-indigo-200"}>
                                        <AiFillEye className={"text-xl text-indigo-600 hover:text-indigo-500"} />
                                    </span>
                                            <span className={"w-9 h-9 p-2 rounded-full flex items-center justify-center cursor-pointer bg-red-50 border border-dashed border-red-200"}>
                                        <FaTrashCan className={"text-xl text-red-600 hover:text-red-500"} />
                                    </span>
                                        </>

                                    }
                                    {
                                        !isUsers &&
                                        <div onClick={() => dispatch(resultActions.setOpen(true))} className={"flex items-center justify-center cursor-pointer"}>
                                <span className={"p-2 w-10 h-10 flex items-center justify-center bg-indigo-50 text-indigo-600 hover:text-indigo-500 rounded-full"}>
                                    <AiFillEye className={"text-2xl"} />
                                </span>
                                        </div>
                                    }
                                </td>
                            </tr>
                            <tr className={"p-2 even:bg-stone-50 text-xs text-gray-700 font-medium"}>
                                <td className={"p-2 text-center"}>1</td>
                                <td className={"p-2 text-center"}>يسلم أحمد ناجم</td>
                                <td className={"p-2 text-center"}>yeslem.alshanqyti@gmail.com</td>
                                <td className={"p-2 text-center"}>مدون</td>
                                <td className={"p-2 text-center"}>0</td>
                                <td className={"p-2 text-center"}>0</td>
                                <td className={"flex items-center gap-2 justify-evenly p-2"}>
                                    {
                                        isUsers &&
                                        <>
                                    <span className={"w-9 h-9 p-2 rounded-full flex items-center justify-center cursor-pointer bg-green-50 border border-dashed border-green-200"}>
                                        <FaUserEdit className={"text-xl text-green-600 hover:text-green-500"} />
                                    </span>
                                            <span className={"w-9 h-9 p-2 rounded-full flex items-center justify-center cursor-pointer bg-indigo-50 border border-dashed border-indigo-200"}>
                                        <AiFillEye className={"text-xl text-indigo-600 hover:text-indigo-500"} />
                                    </span>
                                            <span className={"w-9 h-9 p-2 rounded-full flex items-center justify-center cursor-pointer bg-red-50 border border-dashed border-red-200"}>
                                        <FaTrashCan className={"text-xl text-red-600 hover:text-red-500"} />
                                    </span>
                                        </>

                                    }
                                    {
                                        !isUsers &&
                                        <div onClick={() => dispatch(resultActions.setOpen(true))} className={"flex items-center justify-center cursor-pointer"}>
                                <span className={"p-2 w-10 h-10 flex items-center justify-center bg-indigo-50 text-indigo-600 hover:text-indigo-500 rounded-full"}>
                                    <AiFillEye className={"text-2xl"} />
                                </span>
                                        </div>
                                    }
                                </td>
                            </tr>
                            <tr className={"p-2 even:bg-stone-50 text-xs text-gray-700 font-medium"}>
                                <td className={"p-2 text-center"}>1</td>
                                <td className={"p-2 text-center"}>يسلم أحمد ناجم</td>
                                <td className={"p-2 text-center"}>yeslem.alshanqyti@gmail.com</td>
                                <td className={"p-2 text-center"}>مدون</td>
                                <td className={"p-2 text-center"}>0</td>
                                <td className={"p-2 text-center"}>0</td>
                                <td className={"flex items-center gap-2 justify-evenly p-2"}>
                                    {
                                        isUsers &&
                                        <>
                                    <span className={"w-9 h-9 p-2 rounded-full flex items-center justify-center cursor-pointer bg-green-50 border border-dashed border-green-200"}>
                                        <FaUserEdit className={"text-xl text-green-600 hover:text-green-500"} />
                                    </span>
                                            <span className={"w-9 h-9 p-2 rounded-full flex items-center justify-center cursor-pointer bg-indigo-50 border border-dashed border-indigo-200"}>
                                        <AiFillEye className={"text-xl text-indigo-600 hover:text-indigo-500"} />
                                    </span>
                                            <span className={"w-9 h-9 p-2 rounded-full flex items-center justify-center cursor-pointer bg-red-50 border border-dashed border-red-200"}>
                                        <FaTrashCan className={"text-xl text-red-600 hover:text-red-500"} />
                                    </span>
                                        </>

                                    }
                                    {
                                        !isUsers &&
                                        <div onClick={() => dispatch(resultActions.setOpen(true))} className={"flex items-center justify-center cursor-pointer"}>
                                <span className={"p-2 w-10 h-10 flex items-center justify-center bg-indigo-50 text-indigo-600 hover:text-indigo-500 rounded-full"}>
                                    <AiFillEye className={"text-2xl"} />
                                </span>
                                        </div>
                                    }
                                </td>
                            </tr>
                            <tr className={"p-2 even:bg-stone-50 text-xs text-gray-700 font-medium"}>
                                <td className={"p-2 text-center"}>1</td>
                                <td className={"p-2 text-center"}>يسلم أحمد ناجم</td>
                                <td className={"p-2 text-center"}>yeslem.alshanqyti@gmail.com</td>
                                <td className={"p-2 text-center"}>مدون</td>
                                <td className={"p-2 text-center"}>0</td>
                                <td className={"p-2 text-center"}>0</td>
                                <td className={"flex items-center gap-2 justify-evenly p-2"}>
                                    {
                                        isUsers &&
                                        <>
                                    <span className={"w-9 h-9 p-2 rounded-full flex items-center justify-center cursor-pointer bg-green-50 border border-dashed border-green-200"}>
                                        <FaUserEdit className={"text-xl text-green-600 hover:text-green-500"} />
                                    </span>
                                            <span className={"w-9 h-9 p-2 rounded-full flex items-center justify-center cursor-pointer bg-indigo-50 border border-dashed border-indigo-200"}>
                                        <AiFillEye className={"text-xl text-indigo-600 hover:text-indigo-500"} />
                                    </span>
                                            <span className={"w-9 h-9 p-2 rounded-full flex items-center justify-center cursor-pointer bg-red-50 border border-dashed border-red-200"}>
                                        <FaTrashCan className={"text-xl text-red-600 hover:text-red-500"} />
                                    </span>
                                        </>

                                    }
                                    {
                                        !isUsers &&
                                        <div onClick={() => dispatch(resultActions.setOpen(true))} className={"flex items-center justify-center cursor-pointer"}>
                                <span className={"p-2 w-10 h-10 flex items-center justify-center bg-indigo-50 text-indigo-600 hover:text-indigo-500 rounded-full"}>
                                    <AiFillEye className={"text-2xl"} />
                                </span>
                                        </div>
                                    }
                                </td>
                            </tr>
                            <tr className={"p-2 even:bg-stone-50 text-xs text-gray-700 font-medium"}>
                                <td className={"p-2 text-center"}>1</td>
                                <td className={"p-2 text-center"}>يسلم أحمد ناجم</td>
                                <td className={"p-2 text-center"}>yeslem.alshanqyti@gmail.com</td>
                                <td className={"p-2 text-center"}>مدون</td>
                                <td className={"p-2 text-center"}>0</td>
                                <td className={"p-2 text-center"}>0</td>
                                <td className={"flex items-center gap-2 justify-evenly p-2"}>
                                    {
                                        isUsers &&
                                        <>
                                    <span className={"w-9 h-9 p-2 rounded-full flex items-center justify-center cursor-pointer bg-green-50 border border-dashed border-green-200"}>
                                        <FaUserEdit className={"text-xl text-green-600 hover:text-green-500"} />
                                    </span>
                                            <span className={"w-9 h-9 p-2 rounded-full flex items-center justify-center cursor-pointer bg-indigo-50 border border-dashed border-indigo-200"}>
                                        <AiFillEye className={"text-xl text-indigo-600 hover:text-indigo-500"} />
                                    </span>
                                            <span className={"w-9 h-9 p-2 rounded-full flex items-center justify-center cursor-pointer bg-red-50 border border-dashed border-red-200"}>
                                        <FaTrashCan className={"text-xl text-red-600 hover:text-red-500"} />
                                    </span>
                                        </>

                                    }
                                    {
                                        !isUsers &&
                                        <div onClick={() => dispatch(resultActions.setOpen(true))} className={"flex items-center justify-center cursor-pointer"}>
                                <span className={"p-2 w-10 h-10 flex items-center justify-center bg-indigo-50 text-indigo-600 hover:text-indigo-500 rounded-full"}>
                                    <AiFillEye className={"text-2xl"} />
                                </span>
                                        </div>
                                    }
                                </td>
                            </tr>
                            <tr className={"p-2 even:bg-stone-50 text-xs text-gray-700 font-medium"}>
                                <td className={"p-2 text-center"}>1</td>
                                <td className={"p-2 text-center"}>يسلم أحمد ناجم</td>
                                <td className={"p-2 text-center"}>yeslem.alshanqyti@gmail.com</td>
                                <td className={"p-2 text-center"}>مدون</td>
                                <td className={"p-2 text-center"}>0</td>
                                <td className={"p-2 text-center"}>0</td>
                                <td className={"flex items-center gap-2 justify-evenly p-2"}>
                                    {
                                        isUsers &&
                                        <>
                                    <span className={"w-9 h-9 p-2 rounded-full flex items-center justify-center cursor-pointer bg-green-50 border border-dashed border-green-200"}>
                                        <FaUserEdit className={"text-xl text-green-600 hover:text-green-500"} />
                                    </span>
                                            <span className={"w-9 h-9 p-2 rounded-full flex items-center justify-center cursor-pointer bg-indigo-50 border border-dashed border-indigo-200"}>
                                        <AiFillEye className={"text-xl text-indigo-600 hover:text-indigo-500"} />
                                    </span>
                                            <span className={"w-9 h-9 p-2 rounded-full flex items-center justify-center cursor-pointer bg-red-50 border border-dashed border-red-200"}>
                                        <FaTrashCan className={"text-xl text-red-600 hover:text-red-500"} />
                                    </span>
                                        </>

                                    }
                                    {
                                        !isUsers &&
                                        <div onClick={() => dispatch(resultActions.setOpen(true))} className={"flex items-center justify-center cursor-pointer"}>
                                <span className={"p-2 w-10 h-10 flex items-center justify-center bg-indigo-50 text-indigo-600 hover:text-indigo-500 rounded-full"}>
                                    <AiFillEye className={"text-2xl"} />
                                </span>
                                        </div>
                                    }
                                </td>
                            </tr>
                        </>
                        : <tr className={"p-2 even:bg-stone-50 text-xs text-gray-700 font-medium"}>
                            <td className={"p-2 text-center"}>1</td>
                            <td className={"p-2 text-center"}>1839</td>
                            <td>
                                <div className={"flex items-center flex-col gap-2 p-2"}>
                                    <span>يسلم أحمد ناجم</span>
                                    <span>Yeslem Ahmed Najem</span>
                                </div>
                            </td>
                            <td>
                                <div className={"flex items-center flex-col gap-2 p-2"}>
                                    <span>يسلم أحمد ناجم</span>
                                    <span>Yeslem Ahmed Najem</span>
                                </div>
                            </td>
                            <td>
                                <div className={"flex items-center flex-col gap-2 p-2"}>
                                    <span>يسلم أحمد ناجم</span>
                                    <span>Yeslem Ahmed Najem</span>
                                </div>
                            </td>
                            <td className={"p-2 text-center"}>10.9</td>
                            <td className={"flex items-center gap-2 justify-evenly p-2"}>
                                {
                                    isUsers &&
                                    <>
                                    <span className={"w-9 h-9 p-2 rounded-full flex items-center justify-center cursor-pointer bg-green-50 border border-dashed border-green-200"}>
                                        <FaUserEdit className={"text-xl text-green-600 hover:text-green-500"} />
                                    </span>
                                        <span className={"w-9 h-9 p-2 rounded-full flex items-center justify-center cursor-pointer bg-indigo-50 border border-dashed border-indigo-200"}>
                                        <AiFillEye className={"text-xl text-indigo-600 hover:text-indigo-500"} />
                                    </span>
                                        <span className={"w-9 h-9 p-2 rounded-full flex items-center justify-center cursor-pointer bg-red-50 border border-dashed border-red-200"}>
                                        <FaTrashCan className={"text-xl text-red-600 hover:text-red-500"} />
                                    </span>
                                    </>

                                }
                                {
                                    !isUsers &&
                                    <div onClick={() => dispatch(resultActions.setOpen(true))} className={"flex items-center justify-center cursor-pointer"}>
                                <span className={"p-2 w-10 h-10 flex items-center justify-center bg-indigo-50 text-indigo-600 hover:text-indigo-500 rounded-full"}>
                                    <AiFillEye className={"text-2xl"} />
                                </span>
                                    </div>
                                }
                            </td>
                        </tr>
                }
                </tbody>
            </table>
            {
                isOpen &&
                <Result />
            }
        </div>
    )
}