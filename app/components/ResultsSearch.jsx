"use client"
import {useState} from "react";

export default function ResultsSearch(){

    const [typeSearch, setTypeSearch] = useState("name")

    return (
        <div className={"flex items-center border border-dashed bg-white p-2 rounded-lg justify-between gap-4"}>
            <div className={"flex gap-3"}>
                <div className={"flex flex-col gap-2"}>
                    <div className={"flex gap-2"}>
                        <span
                            className={"flex items-center justify-center gap-2 rounded-lg bg-indigo-50 text-indigo-600 hover:text-indigo-500 font-medium border text-xs p-1 cursor-pointer"}
                            onClick={() => setTypeSearch("number")}
                        >الرقم</span>
                        <span
                            className={"flex items-center justify-center gap-2 rounded-lg bg-stone-50 text-gray-600 hover:text-gray-500 font-medium border text-xs p-1 cursor-pointer"}
                            onClick={() => setTypeSearch("name")}
                        >الاسم</span>
                    </div>
                    <div className={"flex gap-2"}>
                        <input
                            className={"p-2 text-gray-500 text-xs bg-stone-50 font-medium border rounded-lg focus:ring-2 ring-indigo-500 outline-0"}
                            type={typeSearch === "name" ? "text" : "number"}
                            placeholder={typeSearch === "name" ? "اسم الطالب" : "رقم الطالب"}
                        />
                        <button className={"rounded-lg w-fit text-xs p-2 font-medium bg-indigo-700 hover:bg-indigo-600 text-white"}>بحث</button>
                    </div>
                </div>
            </div>
            <div className={"flex flex-col gap-2 w-full"}>
                <label className={"text-xs text-gray-600 hover:text-gray-500 font-medium p-1"}>المدرسة</label>
                <select className={"p-2 cursor-pointer border bg-stone-50 text-gray-600 hover:text-gray-500 text-sm font-medium rounded-lg focus:ring-2 ring-indigo-500 outline-0"}>
                    <option>مدرسة 1</option>
                    <option>مدرسة 2</option>
                    <option>مدرسة 3</option>
                </select>
            </div>
            <div className={"flex flex-col gap-2 w-full"}>
                <label className={"text-xs text-gray-600 hover:text-gray-500 font-medium p-1"}>المركز</label>
                <select className={"p-2 cursor-pointer border bg-stone-50 text-gray-600 hover:text-gray-500 text-sm font-medium rounded-lg focus:ring-2 ring-indigo-500 outline-0"}>
                    <option>المركز 1</option>
                    <option>المركز 2</option>
                    <option>المركز 3</option>
                </select>
            </div>
            <div className={"flex flex-col gap-2 w-full"}>
                <label className={"text-xs text-gray-600 hover:text-gray-500 font-medium p-1"}>المقاطعة</label>
                <select className={"p-2 cursor-pointer border bg-stone-50 text-gray-600 hover:text-gray-500 text-sm font-medium rounded-lg focus:ring-2 ring-indigo-500 outline-0"}>
                    <option>المقاطعة 1</option>
                    <option>المقاطعة 2</option>
                    <option>المقاطعة 3</option>
                </select>
            </div>
            <div className={"flex flex-col gap-2 w-full"}>
                <label className={"text-xs text-gray-600 hover:text-gray-500 font-medium p-1"}>الولاية</label>
                <select className={"p-2 cursor-pointer border bg-stone-50 text-gray-600 hover:text-gray-500 text-sm font-medium rounded-lg focus:ring-2 ring-indigo-500 outline-0"}>
                    <option>الولاية 1</option>
                    <option>الولاية 2</option>
                    <option>الولاية 3</option>
                </select>
            </div>
        </div>
    )
}