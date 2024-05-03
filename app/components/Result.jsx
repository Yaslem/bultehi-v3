import {useDispatch, useSelector} from "react-redux";
import JSConfetti from 'js-confetti'
import HeaderSection from "./HeaderSection";
import {ViewResultStudent} from "./Results";
import {Canvas} from "~/helpers/Global.js";
import {resultActions} from "~/redux/slices/resultSlice.js";

export default function ResultStudent(){
    const result = useSelector(state => state.result.result)
    const dispatch = useDispatch()

    const jsConfetti = new JSConfetti({ Canvas })

    if(result.decision === "ناجح"){
        jsConfetti.addConfetti({
            confettiNumber: 500,
        }).then(() => {

        })
    }

    return (
        <section className={"fixed z-50 w-full h-full flex top-0 left-0"}>
            <div
                className={"w-full md:max-w-[400px] transition-all md:border-r-2 md:border-black/5 flex flex-col gap-4 h-screen overflow-y-auto p-4 bg-white md:ml-auto"}>
                <HeaderSection
                    onClick={() => dispatch(resultActions.setOpen(false))}
                    title={"نتيجة الطالب"}/>
                <ViewResultStudent result={result} />
                {/*<div className={"p-2"}>*/}
                {/*    <Link href={"/"}*/}
                {/*          className={"flex text-sm h-10 items-center justify-center p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 font-medium"}*/}
                {/*    >عرض النتيجة التفصيلية</Link>*/}
                {/*</div>*/}
                {/*<div className={"flex items-center justify-center gap-3"}>*/}
                {/*    <div className={"flex flex-col items-center gap-2"}>*/}
                {/*        <span*/}
                {/*            className={"p-2 flex justify-center items-center rounded-full w-10 h-10 cursor-pointer bg-yellow-50 border border-yellow-200"}>*/}
                {/*            <AiOutlineLike className={"text-2xl text-yellow-700 hover:text-yellow-600"}/>*/}
                {/*        </span>*/}
                {/*        <p className={"text-sm font-medium text-slate-700"}>828</p>*/}
                {/*    </div>*/}
                {/*    <div className={"flex flex-col items-center gap-2"}>*/}
                {/*        <span*/}
                {/*            className={"p-2 flex justify-center items-center rounded-full w-10 h-10 cursor-pointer bg-yellow-50 border border-yellow-200"}>*/}
                {/*            <IoCloudDownloadSharp className={"text-2xl text-yellow-700 hover:text-yellow-600"}/>*/}
                {/*        </span>*/}
                {/*        <p className={"text-sm font-medium text-slate-700"}>828</p>*/}
                {/*    </div>*/}
                {/*    <div className={"flex flex-col items-center gap-2"}>*/}
                {/*        <span*/}
                {/*            className={"p-2 flex justify-center items-center rounded-full w-10 h-10 cursor-pointer bg-yellow-50 border border-yellow-200"}>*/}
                {/*            <MdDataSaverOn className={"text-2xl text-yellow-700 hover:text-yellow-600"}/>*/}
                {/*        </span>*/}
                {/*        <p className={"text-sm font-medium text-slate-700"}>828</p>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>
            <div onClick={() => dispatch(resultActions.setOpen(false))} className={"bg-black/10 flex-grow"}/>
        </section>
    )
}