import {GrFormNext, GrFormPrevious} from "react-icons/gr";
import {TbProgress} from "react-icons/tb";
import {useSelector} from "react-redux";
export default function Pagination({onClickPrev, onClickNext, maxPage, pageIndex, current, isSubmitting}){
    // is pagination
    const isPagination = useSelector(state => state.pagination.isPagination)
    return (
        isPagination &&
        <div className={"flex justify-between items-center"}>
            {
                pageIndex === 0
                    ? <div
                        className={"flex opacity-100 cursor-not-allowed items-center gap-2 bg-stone-50 border rounded-lg text-slate-700 hover:text-slate-600 text-sm p-2 font-medium"}>
                        <GrFormNext className={"text-xl"}/>
                        <span>السابق</span>
                    </div>
                    : <button disabled={isSubmitting && current === "prev"} onClick={onClickPrev}
                              className={"flex cursor-pointer items-center border-indigo-200 gap-2 bg-indigo-50 border rounded-lg text-indigo-700 hover:text-indigo-600 text-sm p-2 font-medium"}>
                        {
                            isSubmitting && current === "prev"
                                ? <TbProgress className={"text-xl text-indigo-600 animate-spin"}/>
                                : <>
                                    <GrFormNext className={"text-xl"}/>
                                    <span>السابق</span>
                                </>
                        }
                    </button>
            }
            <span
                className={"bg-stone-50 p-2 text-slate-500 text-xs font-medium rounded-lg"}>الصفحة الحالية [{(pageIndex + 1)}]</span>
            {
                maxPage === (pageIndex + 1)
                    ? <div
                        className={"flex opacity-100 cursor-not-allowed items-center gap-2 bg-stone-50 border rounded-lg text-slate-700 hover:text-slate-600 text-sm p-2 font-medium"}>
                        <span>التالي</span>
                        <GrFormPrevious className={"text-xl"}/>
                    </div>
                    : <button disabled={isSubmitting && current === "next"} onClick={onClickNext}
                              className={"flex cursor-pointer border-indigo-200 items-center gap-2 bg-indigo-50 border rounded-lg text-indigo-700 hover:text-indigo-600 text-sm p-2 font-medium"}>
                        {
                            isSubmitting && current === "next"
                                ? <TbProgress className={"text-xl text-indigo-600 animate-spin"}/>
                                : <>
                                    <span>التالي</span>
                                    <GrFormPrevious className={"text-xl"}/>
                                </>
                        }
                    </button>
            }
        </div>
    )
}