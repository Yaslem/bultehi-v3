export default function Nothing(
    {
        title,
        desc
    }) {
    return (
        <div className={"w-full bg-white border border-dashed rounded-lg p-8 flex items-center justify-between gap-3"}>
            <div className={"flex flex-col gap-6"}>
                <h4 className={"text-4xl text-slate-700 font-bold"}>{ title }</h4>
                <p className={"text-slate-600 text-sm leading-6 font-medium"}>{ desc }</p>
            </div>
            <div>
                <img className={"w-56 h-auto"} src={"/uploads/global/nothing.png"} alt={"nothing"} />
            </div>
        </div>
    )
}