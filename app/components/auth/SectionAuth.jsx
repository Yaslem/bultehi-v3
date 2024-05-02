import Button from "../../components/Button";
// import Social from "./Social";
import {Link} from "@remix-run/react";

export default function SectionAuth(
    {
        children,
        title,
        onSubmit,
        isLoading,
        titleSubmit,
        titleButton,
        hrefButton,
        isSocial = true
    }){
    return (
        <section className={"w-full md:w-[300px] md:mx-auto mb-5 mt-10 flex flex-col gap-4"}>
            <h1 className={"font-bold text-2xl text-slate-700 text-center"}>{title}</h1>
            <form method={"POST"} onSubmit={onSubmit} className={"flex px-4 md:px-0 flex-col gap-3"}>
                <div className={"flex flex-col gap-3 bg-white border border-dashed rounded-lg p-2"}>
                    { children }
                </div>
                <Button isLoading={isLoading} title={titleSubmit}
                />
            </form>
            {/*{*/}
            {/*    isSocial && <Social />*/}
            {/*}*/}
            <Link
                className={"text-sm text-slate-500 flex items-center gap-2 justify-center font-medium text-center"}
                to={hrefButton}>أو<span className={"text-indigo-700 hover:text-indigo-600 transition-all"}>{titleButton}</span>
            </Link>
        </section>
    )
}