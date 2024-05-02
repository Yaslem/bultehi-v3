import {IoCalendarOutline, IoFilter} from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { CiGrid41 } from "react-icons/ci";
import { CiViewTable } from "react-icons/ci";
import {useDispatch, useSelector} from "react-redux";
import {controlsActions} from "../redux/slices/controlsSlice.js";
import classNames from "classnames";
import {useLocation, useNavigate, useSearchParams, useRevalidator, useFetcher} from "@remix-run/react";
import {useEffect, useState} from "react";
import {TbProgress} from "react-icons/tb";
import {paginationActions} from "~/redux/slices/paginationSlice.js";
import {countiesActions} from "~/redux/slices/countiesSlice.js";
import {WiMoonAltFirstQuarter} from "react-icons/wi";
import {MdTypeSpecimen} from "react-icons/md";
import {SearchUI} from "./ActionsIcon.jsx";

export function PageTitle({title = "", type = "", slug}) {
    switch (type) {
        case "session": {
            return <div className={"flex items-center gap-2"}>
                <span className={"p-1 bg-white border-2 rounded-lg"}>
                    <WiMoonAltFirstQuarter className={classNames({
                        "text-sm md:text-xl lg:text-2xl text-indigo-700": true,
                        "rotate-180": slug === 1,
                        "rotate-0": slug === 2,
                    })} />
                </span>
                <h2 className="text-sm md:text-xl text-amber-700 font-bold">{title}</h2>
            </div>
        }
        case "year": {
            return <div className={"flex items-center gap-2"}>
                <span className={"p-1 bg-white border-2 rounded-lg"}>
                    <IoCalendarOutline className={"text-2xl text-indigo-700"} />
                </span>
                <h2 className="text-sm md:text-xl text-amber-700 font-bold">{title}</h2>
            </div>
        }
        case "title": {
            return <div className={"flex items-center gap-2"}>
                <span className={"p-1 bg-white border-2 rounded-lg"}>
                    <MdTypeSpecimen className={"text-2xl text-indigo-700"} />
                </span>
                <h2 className="text-sm md:text-xl text-amber-700 font-bold">{title}</h2>
            </div>
        }
        default:
            return <h2 className="text-xl text-amber-700 font-bold">{title}</h2>
    }
}

export function PageControlButtons({title, isControl = false}) {
    const dispatch = useDispatch()
    const search = useFetcher({ key: "search" })
    const navigate = useNavigate()
    const revalidator = useRevalidator();
    const isSubmitting = search.state === "submitting"
    const [searchParams] = useSearchParams();
    const [value, setValue] = useState("")
    const sort = searchParams.get("sort") || "desc"
    const controls = useSelector(state => state.controls.controls)

    const handelSearch = (e) => {
          e.preventDefault()
        const formData = new FormData()
        formData.append("value", value)
        formData.append("action", "search")
        search.submit(formData, {
            method: "POST"
        })
    }

    return (
        <section className={"flex gap-2 items-center justify-between"}>
            <PageTitle title={title} />
            {
                isControl &&
                <div className={"flex gap-2 flex-col"}>
                    <div
                        className={"grid grid-cols-3 md:grid-cols-5 items-center gap-3 *:rounded-lg *:flex *:cursor-pointer *:items-center *:justify-center *:p-2 *:bg-white *:border-2"}>
                        <button title={"عرض تنازلي"}
                                onClick={() => {
                                    navigate(`?sort=desc`)
                                }}
                                className={classNames({
                                    "hover:border-indigo-600 group *:text-xl *:text-slate-600": true,
                                    "border-indigo-600": sort === "desc",
                                })}>
                            <IoFilter className={classNames({
                                "group-hover:text-indigo-600": true,
                                "text-indigo-600": sort === "desc",
                            })}/>
                        </button>
                        <button title={"عرض تصاعدي"}
                                onClick={() => {
                                    navigate(`?sort=asc`)
                                }}
                                className={classNames({
                                    "hover:border-indigo-600 group *:text-xl *:text-slate-600": true,
                                    "border-indigo-600": sort === "asc",
                                })}>
                            <IoFilter className={classNames({
                                "group-hover:text-indigo-600 rotate-180": true,
                                "text-indigo-600": sort === "asc",
                            })}/>
                        </button>
                        <button title={"عرض شبكي"}
                                onClick={() => {
                                    dispatch(controlsActions.setView("grid"))
                                }}
                                className={classNames({
                                    "hover:border-indigo-600 group *:text-xl *:text-slate-600": true,
                                    "border-indigo-600": controls.view === "grid",
                                })}>
                            <CiGrid41 className={classNames({
                                "group-hover:text-indigo-600": true,
                                "text-indigo-600": controls.view === "grid",
                            })}/>
                        </button>
                        <button title={"عرض هرمي"}
                                onClick={() => {
                                    dispatch(controlsActions.setView("table"))
                                }}
                                className={classNames({
                                    "hover:border-indigo-600 group *:text-xl *:text-slate-600": true,
                                    "border-indigo-600": controls.view === "table",
                                })}>
                            <CiViewTable className={classNames({
                                "group-hover:text-indigo-600": true,
                                "text-indigo-600": controls.view === "table",
                            })}/>
                        </button>
                        <button title={"بحث"}
                                onClick={() => dispatch(controlsActions.setSearch(!controls.search))}
                                className={classNames({
                                    "hover:border-indigo-600 group *:text-xl *:text-slate-600": true,
                                    "border-indigo-600": controls.search,
                                })}>
                            <CiSearch className={classNames({
                                "group-hover:text-indigo-600": true,
                                "text-indigo-600": controls.search,
                            })}/>
                        </button>
                    </div>
                    {
                        controls.search &&
                        <form onSubmit={handelSearch}>
                            <SearchUI onChange={e => {
                                if (e.target.value.length === 0) {
                                    revalidator.revalidate()
                                    setValue("")
                                } else {
                                    setValue(e.target.value)
                                }

                            }} isSubmitting={isSubmitting} handelSearch={handelSearch} placeholder={"اكتب ما تبحث عنه"} value={value} />
                        </form>
                    }

                </div>
            }
        </section>
    )
}