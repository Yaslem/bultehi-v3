"use client"
export default function Title({title}){
    return (
        <div className={"flex items-center gap-3"}>
            <span className={"w-1 h-6 rounded-lg bg-indigo-400"} />
            <h4 className={"font-bold text-slate-700 text-lg"}>{title}</h4>
        </div>
    )
}