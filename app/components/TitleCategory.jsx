"use client"
export default function TitleCategory({title, des}) {
    return (
        <div className={"bg-amber-50 border border-t-0 gap-4 p-2 flex flex-col items-center justify-center"}>
            <h1 className={"text-lg text-gray-700 font-bold"}>{title}</h1>
            <p className={"text-sm text-center text-gray-600 font-medium"}>{des}</p>
        </div>
    )
}