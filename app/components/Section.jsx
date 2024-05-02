
export default function Section({children}){
    return (
        <section className={"flex bg-neutral-50 flex-col p-5 gap-5"}>
            {children}
        </section>
    )
}