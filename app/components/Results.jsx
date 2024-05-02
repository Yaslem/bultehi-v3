import {useEffect, useRef, useState} from "react";
import {Link, useFetcher} from "@remix-run/react";
import {HiOutlineExternalLink} from "react-icons/hi";
import {PiCertificateBold, PiStudentBold} from "react-icons/pi";
import {FaAward, FaChevronDown, FaGraduationCap} from "react-icons/fa";
import {IoStatsChart} from "react-icons/io5";
import {useDispatch, useSelector} from "react-redux";
import {BsSearch} from "react-icons/bs";
import Validate from "../helpers/Validate";
import Error from "./Error";
import Button from "./Button";
import classNames from "classnames";
import Table, {Td, Tr} from "./Table";
import {paginationActions} from "../redux/slices/paginationSlice";
import Pagination from "./Pagination";
import {LuUserCheck2, LuUserX2} from "react-icons/lu";
import {LiaBirthdayCakeSolid} from "react-icons/lia";
import Select, {Option} from "./Select";
import {getDataForElementaryFilter, getResultStudent} from "../controllers/public/Result.server";
import {MdNumbers} from "react-icons/md";
import {AiFillEye, AiFillEyeInvisible} from "react-icons/ai";
import {Cancel, SearchUI} from "./ActionsIcon";
import {useLocation} from "@remix-run/react";
import {
    generateIdFromSlug, generateSlug,
    getDegreeStudent,
    getGlobalResultStudent, getImageStates, getNumberForHuman, getDateForHuman, getNumberFormat,
    getUrlForTypeResults, getValueForStudentResult
} from "../helpers/Global.js";
import {resultActions} from "../redux/slices/resultSlice.js";
import {PageControlButtons, PageTitle} from "~/components/PageControlButtons.jsx";
import Nothing from "~/components/Nothing.jsx";

export default function Results({title, link, isAll, resultsProps}){
    const results = {
        data: resultsProps.data,
        status: resultsProps.status,
        message: resultsProps.message,
    }
    return (
        <div className={"flex flex-col px-4 gap-4"}>
            <Header link={link} isAll={isAll} title={title} />
            <Result results={results} />
        </div>
    )
}

export function Header({title, link, isAll = false}){
    return (
        <div className={"flex justify-between gap-4"}>
            <div className={"flex gap-3"}>
                <div className={"w-1 block rounded-lg bg-gray-500"} />
                <h2 className={"text-lg font-bold text-gray-600"}>{title}</h2>
            </div>
            {
                !isAll &&
                <Link className={"flex gap-2 rounded-lg border border-indigo-200 items-center text-xs font-medium justify-center p-2 bg-indigo-50 text-indigo-700 hover:text-indigo-600"} to={link || "/"}>
                    <span>عرض الكل</span>
                    <HiOutlineExternalLink className={"text-lg"} />
                </Link>
            }
        </div>
    )
}

export function Result({results}){
    const location = useLocation();
    const pathName = location.pathname
    return (
        <div>
            <ul className={"flex bg-white rounded-lg border p-1 flex-col gap-2"}>
                {
                    results.data.map((result, index) =>
                        <>
                            <Link to={pathName + "/results/" + generateIdFromSlug({slug: result.title, id: result.id})}>
                                <li key={index} className={"hover:bg-zinc-50 rounded-lg pr-4 p-2 items-center cursor-pointer flex gap-4 text-sm font-medium text-indigo-500"}>
                                    <PiCertificateBold className={"text-2xl text-indigo-500"}/>
                                    <span>{result.title} - {result.year.name}</span>
                                </li>
                            </Link>
                            {
                                (results.data.length - 1) !== index &&
                                <hr/>
                            }
                        </>
                    )
                }
            </ul>
        </div>
    )
}

export function TopResults({title, children}) {
    return (
        <div className={"mt-4 flex flex-col gap-4"}>
            <PageTitle title={title} />
            <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"}>
                { children }
            </div>
        </div>
    )
}
export function TopStudent({type = null, result, index}) {
    const dispatch = useDispatch()
    const exceptions = useSelector(state => state.exception.data)
    return (
        <div key={index} className={"border shadow-lg relative bg-white overflow-hidden flex justify-between flex-col gap-2 rounded-lg"}>
            {
                type !== null &&
                <span className={classNames({
                    "absolute top-0 text-sm font-bold p-1 text-indigo-700 bg-indigo-50": true,
                    "right-0 rounded-bl-lg": result.student.name.match(/^[a-z0-9_.,'"!?;:& ]+$/i),
                    "left-0 rounded-br-lg": !result.student.name.match(/^[a-z0-9_.,'"!?;:& ]+$/i),
                })}>{type.nameFr}</span>
            }
            <div className={"flex items-center p-2 pb-0 gap-2"}>
                <div className={"flex flex-col gap-2 flex-grow"}>
                    <div className={"flex flex-col gap-1"}>
                        {
                            result.student.name.match(/^[a-z0-9_.,'"!?;:& ]+$/i)
                                ? <h2 dir={"ltr"} className={"font-bold text-left text-base text-slate-700"}>{result.student.name.length <= 30 ? result.student.name : result.student.name.slice(0, 29) + "..."}</h2>
                                : <h2 className={"font-bold text-base text-slate-700"}>{result.student.name.length <= 30 ? result.student.name : result.student.name.slice(0, 29) + "..."}</h2>
                        }
                    </div>
                    <hr className={"border border-dashed"}/>

                </div>
            </div>
            <CardRanking ranking={{
                state: result.rankingInState,
                country: result.rankingInCountry,
                county: result.rankingInCounty,
                school: result.rankingInSchool,
                center: result.rankingInCenter,
            }} />
            <div className={"p-2 flex items-center justify-between bg-stone-50"}>
                <div className={"flex flex-col items-center gap-2 text-xs font-medium text-slate-600"}>
                    <div className={"flex items-center gap-1"}>
                        <IoStatsChart className={"text-lg"}/>
                        <span>الدرجة</span>
                    </div>
                    <span className={"text-slate-700 font-bold"}>{getDegreeStudent(result.degree)}</span>
                </div>
                <div className={"flex flex-col items-center gap-2 text-xs font-medium text-slate-600"}>
                    {
                        result.typeResult.slug === 1
                            ? <>
                                <div className={"flex items-center gap-1"}>
                                    <LiaBirthdayCakeSolid className={"text-lg"}/>
                                    <span>العمر</span>
                                </div>
                                <span className={"text-slate-700 font-bold"}>{getDateForHuman(result.student.birth, true).replace("أعوام", "").replace("قبل", "")}</span>
                            </>
                            : <>
                                <div className={"flex items-center gap-1"}>
                                    <MdNumbers className={"text-lg"}/>
                                    <span>الرقم</span>
                                </div>
                                <Link to={`/${getUrlForTypeResults(result.typeResult.slug)}/results/${generateIdFromSlug({
                                    slug: result.result.title,
                                    id: result.result.id
                                })}/number/${generateIdFromSlug({
                                    slug: result.student.name,
                                    id: result.student.number
                                })}`} className={"text-indigo-700 font-bold"}>{result.student.number}</Link>
                            </>
                    }
                </div>
                <div className={"flex flex-col items-center gap-2 text-xs font-medium text-slate-600"}>
                    <div className={"flex items-center gap-1"}>
                        <FaAward className={"text-lg"}/>
                        <span>النتيجة</span>
                    </div>
                    <span
                        onClick={() => {
                            dispatch(resultActions.setResult(getGlobalResultStudent({result, exceptions})))
                            dispatch(resultActions.setOpen(true))
                        }}
                        className={"text-white rounded-lg hover:bg-indigo-500 cursor-pointer p-2 bg-indigo-600 font-bold"}>عرض</span>
                </div>
            </div>
        </div>
    )
}

export function CardRanking({ranking, isBorder = false}) {
    return (
        <div className={classNames({
            "flex p-2 bg-white items-center justify-between": true,
            "border-y ": isBorder
        })}>
            <div
                className={"flex flex-col gap-2 items-center text-xs font-medium text-slate-600"}>
                <div className={"flex items-center gap-1"}>
                    <FaAward className={"text-lg"}/>
                    <span>الوطن</span>
                </div>
                <span
                    className={"text-sm text-green-600 font-bold"}>{getNumberForHuman(ranking.country)}</span>
            </div>
            <hr className={"border self-center h-6 border-dashed"}/>
            <div
                className={"flex flex-col gap-2 items-center text-xs font-medium text-slate-600"}>
                <div className={"flex items-center gap-1"}>
                    <FaAward className={"text-lg"}/>
                    <span>الولاية</span>
                </div>
                <span
                    className={"text-sm text-indigo-600 font-bold"}>{getNumberForHuman(ranking.state)}</span>
            </div>
            <hr className={"border self-center h-6 border-dashed"}/>
            <div
                className={"flex flex-col gap-2 items-center text-xs font-medium text-slate-600"}>
                <div className={"flex items-center gap-1"}>
                    <FaAward className={"text-lg"}/>
                    <span>المقاطعة</span>
                </div>
                <span
                    className={"text-sm text-orange-600 font-bold"}>{getNumberForHuman(ranking.county)}</span>
            </div>
            <hr className={"border self-center h-6 border-dashed"}/>
            <div className={"flex flex-col gap-2 items-center text-xs font-medium text-slate-600"}>
                <div className={"flex items-center gap-1"}>
                    <FaAward className={"text-lg"}/>
                    <span>{ranking.school === 0 ? "المركز" : "المدرسة"}</span>
                </div>
                <span
                    className={"text-sm text-cyan-600 font-bold"}>{ranking.school === 0 ? getNumberForHuman(ranking.center) : getNumberForHuman(ranking.school)}</span>
            </div>
        </div>
    )
}

export function Search({statesData = {}, countiesData = {}, isBySchool = false, isByCenter = false, schoolsData = {}, centersData = {}, slug, currentData = {}, resultsData = [], currentPage = "", isTitle}) {
    const fetcher = useFetcher();
    const elementary = useFetcher({key: "elementary"});
    const isSubmitting = fetcher.state === "submitting" || elementary.state === "submitting";
    const res = fetcher.data
    const elementaryRes = elementary.data
    const dispatch = useDispatch()
    const exceptions = useSelector(state => state.exception.data)
    const sectionCard = useRef()
    let pageIndex = useSelector(state => state.pagination.pageIndex)
    const maxPage = useSelector(state => state.pagination.maxPage)
    const stateId = useSelector(state => state.pagination.globals.stateId)
    const countyId = useSelector(state => state.pagination.globals.countyId)
    const schoolId = useSelector(state => state.pagination.globals.schoolId)
    const centerId = useSelector(state => state.pagination.globals.centerId)
    const isPagination = useSelector(state => state.pagination.isPagination)
    const [action, setAction] = useState("")
    const [by, setBy] = useState("")
    const [isSearch, setIsSearch] = useState(false)
    const [title, setTitle] = useState("ابحث الآن عن نتيجتك!")
    const [results, setResults] = useState(resultsData)
    const [message, setMessage] = useState("﴿يَرفَعِ اللَّهُ الَّذينَ آمَنوا مِنكُم وَالَّذينَ أوتُوا العِلمَ دَرَجاتٍ﴾")
    const [value, setValue] = useState("")
    const valueRef = useRef();
    const [target, setTarget] = useState("number")
    const states ={
        data: statesData?.data || [],
        status: statesData?.status || false
    }
    const [counties, setCounties] = useState({
        data: countiesData?.data || [],
        status: countiesData?.status || false
    })
    const [schools, setSchools] = useState({
        data: schoolsData?.data || [],
        status: schoolsData?.status || false
    })
    const [centers, setCenters] = useState({
        data: centersData?.data || [],
        status: centersData?.status || false
    })
    const [error, setError] = useState({})

    async function handelSearch(e) {
        e.preventDefault()
        setAction("submit")
        const validated = Validate.searchResult.safeParse({value})
        if (validated.success) {
            setError({})
            const formData = new FormData();
            formData.append("target", target)
            formData.append("value", value)
            formData.append("action", "search")
            fetcher.submit(formData, {
                method: "POST",
            });
        }else {
            setError(validated.error.format())
        }


    }
    function handelSearchName(e) {
        e.preventDefault()
        setAction("search")
        const validated = Validate.searchResult.safeParse({value})
        if (validated.success) {
            setError({})
            const formData = new FormData();
            formData.append("page", pageIndex)
            formData.append("stateId", stateId)
            formData.append("countyId", countyId)
            formData.append("schoolId", schoolId)
            formData.append("centerId", centerId)
            formData.append("value", value)
            formData.append("action", "searchName")
            elementary.submit(formData, {
                method: "POST",
            });
        }else {
            setError(validated.error.format())
        }


    }
    useEffect(() => {
        if(res){
            if (res.status === "success") {
                setError({})
                if (res.data.count) {
                    dispatch(paginationActions.setMaxPage(res.data.count))
                    setResults(res.data.results)
                    if (res.data.count >= 2) {
                        dispatch(paginationActions.setIsPagination(true))
                    } else {
                        dispatch(paginationActions.setIsPagination(false))
                    }
                } else {
                    setResults([])
                    sectionCard.current.classList.remove("border-red-200")
                    sectionCard.current.classList.add("border-indigo-300")
                    setTitle("مبارك!")
                    setMessage("﴿يَرفَعِ اللَّهُ الَّذينَ آمَنوا مِنكُم وَالَّذينَ أوتُوا العِلمَ دَرَجاتٍ﴾")
                    dispatch(resultActions.setResult(getGlobalResultStudent({result: res.data, exceptions})))

                    setTimeout(() => {
                        dispatch(resultActions.setOpen(true))
                    }, 300)
                }
            }else {
                setResults([])
                sectionCard.current.classList.remove("border-indigo-200")
                sectionCard.current.classList.add("border-red-200")
                setTitle("لا توجد نتيجة!")
                setMessage(res.message)
                setError(res.data)
            }
        }
    }, [res]);

    useEffect(() => {
        if(elementaryRes && elementaryRes.data && elementaryRes.status === "success"){
            if(elementaryRes.data.count){
                dispatch(paginationActions.setMaxPage(elementaryRes.data.count))
                setResults(elementaryRes.data.results)
                if (elementaryRes.data.count >= 2) {
                    dispatch(paginationActions.setIsPagination(true))
                } else {
                    dispatch(paginationActions.setIsPagination(false))
                }
            }else {
                if(elementaryRes.data.length > 1){
                    setResults(elementaryRes.data)
                    dispatch(paginationActions.setIsPagination(false))
                }else {
                    setResults([])
                    sectionCard.current.classList.remove("border-red-200")
                    sectionCard.current.classList.add("border-indigo-300")
                    setTitle("مبارك!")
                    setMessage("﴿يَرفَعِ اللَّهُ الَّذينَ آمَنوا مِنكُم وَالَّذينَ أوتُوا العِلمَ دَرَجاتٍ﴾")
                    dispatch(resultActions.setResult(getGlobalResultStudent({result: elementaryRes.data, exceptions})))

                    setTimeout(() => {
                        dispatch(resultActions.setOpen(true))
                    }, 300)
                }

            }
            switch (elementaryRes.data.type) {
                case "county":
                    setCounties({
                        data: elementaryRes.data.counties,
                        status: elementaryRes.status
                    })
                    break
                case "school":
                    setSchools({
                        data: elementaryRes.data.schools,
                        status: elementaryRes.status
                    })
                    break
                case "center":
                    setCenters({
                        data: elementaryRes.data.centers,
                        status: elementaryRes.status
                    })
                    break
                case "finally":
                    setIsSearch(true)
                    break
            }
        }
    }, [elementaryRes]);

    function handelPagination() {
        const formData = new FormData();
        formData.append("page", pageIndex)
        formData.append("target", target)
        formData.append("value", value)
        formData.append("action", "search")
        fetcher.submit(formData, {
            method: "POST",
        });
    }

    function handelPaginationElementary() {
        const formData = new FormData();
        formData.append("page", pageIndex)
        formData.append("stateId", stateId)
        formData.append("countyId", countyId)
        formData.append("schoolId", schoolId)
        formData.append("centerId", centerId)
        formData.append("by", by)
        formData.append("action", "search")
        elementary.submit(formData, {
            method: "POST",
        });
    }
    return (
        <div ref={sectionCard} className={classNames({
            "bg-white overflow-hidden flex flex-col border-2 rounded-lg": true,
            "gap-3": slug !== 1
        })}>
            {
                slug === 1
                    ? <>
                        <div className={"flex items-center p-2 gap-3"}>
                            {
                                isTitle &&
                                <>
                                    <span
                                        className={"text-indigo-700 hover:text-indigo-600 text-sm outline-0 font-semibold"}>{currentData.name}</span>
                                    <span style={{rotate: "90deg"}}><FaChevronDown
                                        className={"text-sm text-slate-500"}/></span>
                                </>
                            }
                            <div className={classNames({
                                "grid flex-grow p-2 gap-3": true,
                                "grid-cols-1 md:grid-cols-3 lg:grid-cols-5": !isTitle,
                                "grid-cols-1 md:grid-cols-3 lg:md:grid-cols-4": isTitle && currentPage === "state",
                                "grid-cols-1 md:grid-cols-3": isTitle && currentPage === "county",
                                "grid-cols-1 md:grid-cols-2": isTitle && currentPage === "school",
                                "grid-cols-1": isTitle && currentPage === "center",
                            })}>
                                {
                                    states.data.length > 0 &&
                                    <Select
                                        name={"state"}
                                        label={"الولاية"}
                                        labelForOption={"اختر الولاية"}
                                        onChange={(e) => {
                                            setResults([])
                                            setIsSearch(false)
                                            setCounties({
                                                data: [],
                                                status: false
                                            })
                                            setSchools({
                                                data: [],
                                                status: false
                                            })
                                            setCenters({
                                                data: [],
                                                status: false
                                            })
                                            setAction("submit")
                                            setBy("state")
                                            dispatch(paginationActions.setPageIndex(0))
                                            dispatch(paginationActions.setStateId(e.target.value))
                                            const formData = new FormData();
                                            formData.append("stateId", e.target.value)
                                            formData.append("countyId", countyId)
                                            formData.append("schoolId", schoolId)
                                            formData.append("centerId", centerId)
                                            formData.append("by", "state")
                                            formData.append("action", "search")
                                            elementary.submit(formData, {
                                                method: "POST",
                                            });
                                        }}>
                                        {
                                            states.data.map((state, index) =>
                                                <Option key={index} value={state.id} title={state.name}/>
                                            )
                                        }
                                    </Select>
                                }
                                {
                                    counties.data.length > 0 &&
                                    <Select
                                        name={"county"}
                                        labelForOption={"اختر المقاطعة"}
                                        label={"المقاطعة"}
                                        onChange={(e) => {
                                            setResults([])
                                            setIsSearch(false)
                                            dispatch(paginationActions.setPageIndex(0))
                                            dispatch(paginationActions.setCountyId(e.target.value))
                                            setBy("county")
                                            setSchools({
                                                data: [],
                                                status: false
                                            })
                                            setCenters({
                                                data: [],
                                                status: false
                                            })
                                            const formData = new FormData();
                                            formData.append("stateId", stateId)
                                            formData.append("countyId", e.target.value)
                                            formData.append("schoolId", schoolId)
                                            formData.append("centerId", centerId)
                                            formData.append("by", "county")
                                            formData.append("action", "search")
                                            elementary.submit(formData, {
                                                method: "POST",
                                            });
                                        }}>
                                        {
                                            counties.data.map((county, index) =>
                                                <Option key={index} value={county.id} title={county.name}/>
                                            )
                                        }
                                    </Select>
                                }
                                {
                                    schools.data.length > 0 &&
                                    <Select
                                        name={"school"}
                                        labelForOption={"اختر المدرسة"}
                                        label={"المدرسة"}
                                        onChange={async (e) => {
                                            setResults([])
                                            setIsSearch(false)
                                            setCenters({
                                                data: [],
                                                status: false
                                            })
                                            dispatch(paginationActions.setPageIndex(0))
                                            dispatch(paginationActions.setSchoolId(e.target.value))
                                            setBy("school")
                                            const formData = new FormData();
                                            formData.append("stateId", stateId)
                                            formData.append("countyId", countyId)
                                            formData.append("schoolId", e.target.value)
                                            formData.append("centerId", centerId)
                                            formData.append("by", "school")
                                            formData.append("action", "search")
                                            elementary.submit(formData, {
                                                method: "POST",
                                            });
                                        }}>
                                        {
                                            schools.data.map((school, index) =>
                                                <Option key={index} value={school.id} title={school.name}/>
                                            )
                                        }
                                    </Select>
                                }
                                {
                                    centers.data.length > 0 &&
                                    <Select
                                        name={"center"}
                                        labelForOption={"اختر المركز"}
                                        label={"المركز"}
                                        onChange={async (e) => {
                                            setResults([])
                                            setIsSearch(false)
                                            dispatch(paginationActions.setPageIndex(0))
                                            dispatch(paginationActions.setCenterId(e.target.value))
                                            setBy("center")
                                            const formData = new FormData();
                                            formData.append("stateId", stateId)
                                            formData.append("countyId", countyId)
                                            formData.append("schoolId", schoolId)
                                            formData.append("centerId", e.target.value)
                                            formData.append("by", "center")
                                            formData.append("action", "search")
                                            elementary.submit(formData, {
                                                method: "POST",
                                            });
                                        }}>
                                        {
                                            centers.data.map((center, index) =>
                                                <Option key={index} value={center.id} title={center.name}/>
                                            )
                                        }
                                    </Select>
                                }
                                {
                                    currentPage === "center" || isSearch
                                        ? <div className={"flex flex-col gap-2"}>
                                            <label className={"text-xs font-medium text-slate-600"}>اسم الطالب</label>
                                            <SearchUI onChange={e => setValue(e.target.value)}
                                                      isSubmitting={isSubmitting && action === "search"}
                                                      handelSearch={handelSearchName} placeholder={"اكتب اسم الطالب"}
                                                      value={value}/>
                                        </div>
                                        : null
                                }
                            </div>
                        </div>
                        {
                            elementaryRes && elementaryRes.status === "error" &&
                            <div className={"px-2"}>
                                <Error status={"error"} message={elementaryRes.message}/>
                            </div>
                        }
                    </>
                    : <>
                        <div className={"flex flex-col md:flex-row border-b-2 md:h-14 gap-3"}>
                        {
                                isTitle &&
                                <div className={"p-2 flex gap-3 items-center"}>
                                    <span
                                        className={"text-indigo-700 hover:text-indigo-600 text-sm outline-0 font-semibold"}>{currentData.name || currentData.nameAr}</span>
                                    <span style={{rotate: "90deg"}}>
                                        <FaChevronDown className={"text-sm text-slate-500"}/>
                                    </span>
                                </div>
                            }

                                <form onSubmit={handelSearch} className={"flex-grow flex-col md:flex-row flex justify-between gap-3"}>
                                    <div className={"flex max-sm:border-b items-center gap-2"}>
                                        <div className={"p-2 self-center"}>
                                            <BsSearch className={"text-xl text-slate-600"}/>
                                        </div>
                                        <div className={"p-2 self-center flex-grow"}>
                                            <input
                                                ref={valueRef}
                                                name={"value"}
                                                onChange={(e) => {
                                                    if (e.target.value.length === 0) {
                                                        setTitle("ابحث الآن عن نتيجتك!")
                                                        setMessage("﴿يَرفَعِ اللَّهُ الَّذينَ آمَنوا مِنكُم وَالَّذينَ أوتُوا العِلمَ دَرَجاتٍ﴾")
                                                        setResults([])
                                                    }
                                                    setValue(e.target.value)
                                                }}
                                                type={target === "name" ? "text" : "number"}
                                                min={target === "name" ? null : 1}
                                                defaultValue={value}
                                                placeholder={target === "name" ? "اكتب اسم الطالب" : "اكتب رقم الطالب"}
                                                className={"bg-white font-medium text-slate-700 placeholder:text-sm placeholder:font-medium w-full outline-0"}/>
                                        </div>
                                    </div>
                                    <div className={"flex items-center gap-2"}>
                                        <div className={"p-2 flex items-center md:border-r-2"}>
                                            <ul className={"flex gap-4 items-center list-none"}>
                                                <li className={"text-sm font-medium text-slate-600"}>البحث بـــــــ</li>
                                                <li onClick={() => setTarget("number")} className={classNames({
                                                    "text-sm font-semibold cursor-pointer py-1 px-2 border rounded-lg border-dashed": true,
                                                    "text-indigo-700 bg-indigo-50 border-indigo-200": target === "number",
                                                    "text-slate-600 bg-slate-50 border-slate-200": target !== "number",
                                                })}>الرقم
                                                </li>
                                                <li onClick={() => setTarget("name")} className={classNames({
                                                    "text-sm font-semibold cursor-pointer py-1 px-2 border rounded-lg border-dashed": true,
                                                    "text-indigo-700 bg-indigo-50 border-indigo-200": target === "name",
                                                    "text-slate-600 bg-slate-50 border-slate-200": target !== "name",
                                                })}>الاسم
                                                </li>
                                            </ul>
                                        </div>
                                        <div className={"p-2 items-center md:border-r-2 flex gap-3"}>
                                            <Button isLoading={isSubmitting && action === "submit"} title={"بحث"}
                                                    isOnlyIcon={true}/>
                                            {
                                                (results.length > 0 || value.length > 0) &&
                                                <Cancel onClick={() => {
                                                    setValue("")
                                                    valueRef.current.value = ""
                                                    setTitle("ابحث الآن عن نتيجتك!")
                                                    setMessage("﴿يَرفَعِ اللَّهُ الَّذينَ آمَنوا مِنكُم وَالَّذينَ أوتُوا العِلمَ دَرَجاتٍ﴾")
                                                    setResults([])
                                                }}/>
                                            }
                                        </div>
                                    </div>
                                </form>
                        </div>
                        {
                            error?.value &&
                            <div className={"px-2"}>
                                <Error status={"error"} message={error?.value._errors.join()}/>
                            </div>
                        }
                    </>
            }
            {
                results.length > 0 &&
                <div className={"p-2 flex flex-col gap-4"}>
                    <Table th={["الرقم", "الاسم", "الولاية", "المقاطعة", "المدرسة", "النتيجة"]}>
                        {
                            results.map((result, index) =>
                                <Tr key={index}>
                                    <Td value={result.student.number}/>
                                    <Td value={result.student.name}/>
                                    <Td value={
                                        <Link to={"/"}
                                              className={"text-indigo-700 hover:text-indigo-600"}>{result.state?.name}</Link>
                                    }/>
                                    <Td value={
                                        <Link to={"/"}
                                              className={"text-indigo-700 hover:text-indigo-600"}>{result.county?.name}</Link>
                                    }/>
                                    <Td value={
                                        <Link to={"/"}
                                              className={"text-indigo-700 hover:text-indigo-600"}>{result.school?.name}</Link>
                                    }/>
                                    <Td value={
                                        <span
                                            className={"text-xs p-2 bg-indigo-700 hover:bg-indigo-600 text-white rounded-lg font-medium text-center cursor-pointer"}
                                            onClick={() => {
                                                dispatch(resultActions.setResult(getGlobalResultStudent({
                                                    result,
                                                    exceptions
                                                })))
                                                dispatch(resultActions.setOpen(true))
                                            }}>عرض النتيجة</span>
                                    }/>
                                </Tr>
                            )
                        }
                    </Table>
                    {
                        isPagination &&
                        <Pagination onClickPrev={async () => {
                            setAction("prev")
                            dispatch(paginationActions.setDecrementPageIndex((pageIndex -= 1)))
                            slug === 1 ? handelPaginationElementary() : handelPagination()
                        }} onClickNext={async () => {
                            setAction("next")
                            dispatch(paginationActions.setIncrementPageIndex((pageIndex += 1)))
                            slug === 1 ? handelPaginationElementary() : handelPagination()
                        }} pageIndex={pageIndex} current={action} isSubmitting={isSubmitting} maxPage={maxPage}/>
                    }
                </div>
            }
            {
                results.length === 0 &&
                <div className={classNames({
                    "flex -mt-3 items-center bg-stone-50 pb-4 justify-center flex-col gap-4": true,
                    "border-t mt-2": slug === 1,
                })}>
                    <img className={"w-60 h-auto"} src={"/uploads/global/notfound.png"} width={100} height={100}
                         alt={"لا يوجد شيء"}/>
                    <div className={"flex items-center justify-center flex-col gap-4"}>
                        <h2 className={"text-2xl font-bold text-slate-700"}>{title}</h2>
                        <p className={"text-sm font-medium text-slate-600"}>{message}</p>
                    </div>
                </div>
            }
        </div>
    )
}

export function SectionCard({data, isState = true, isType, title, isControl}) {
    const controls = useSelector(state => state.controls.controls)
    console.log(data);
    return (
        <>
            <PageControlButtons isControl={isControl} title={title}/>
            {
                data?.length > 0
                    ? <>
                        {
                            controls.view === "grid" &&
                            <div className={"flex flex-col gap-8"}>
                                <div className={"grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"}>
                                    {
                                        data.map((item, index) =>
                                            <Card isType={isType} key={index} id={item.id}
                                                  count={item.counts} isState={isState} index={index}
                                                  name={item.name || item.nameAr}/>
                                        )
                                    }
                                </div>
                            </div>
                        }
                        {
                            controls.view === "table" &&
                            <Table th={["الاسم", "الناجحون", "الراسبون", "الإجمالي"]}>
                                {
                                    data.map((item, index) =>
                                        <Tr key={index}>
                                            <Td value={
                                                <Link
                                                    to={generateSlug({slug: item.name, id: item.id})}
                                                    className={"flex justify-center items-center gap-2 text-indigo-700 hover:text-indigo-600"}>
                                                    <span>{item.name || item.nameAr}</span>
                                                    <HiOutlineExternalLink />
                                                </Link>
                                            } />
                                            <Td value={getNumberFormat(item.counts.admis)} />
                                            <Td value={getNumberFormat(item.counts.ajourne)} />
                                            <Td value={getNumberFormat(item.counts.all)} />
                                        </Tr>
                                    )
                                }
                            </Table>
                        }
                    </>
                    : <Nothing title={"عفوا 😔"} desc={"المعذرة منك، لم نتمكن من العثور على بيانات. (:"}/>
            }
        </>
    )
}

export function Card(
    {
        index,
        id,
        name,
        isState = false,
        isType = false,
        count = 0,
    }){
    return (
        <div key={index} className={"border flex justify-between gap-2 flex-col bg-white rounded-lg overflow-hidden"}>
            {
                isType
                    ? null
                    : isState
                        ? <img alt={""} className={"border-b w-full object-cover h-28"} width={100} height={100} src={getImageStates(name)} />
                        : <img alt={""} className={"border-b w-full object-cover h-28"} width={100} height={100} src={"/uploads/global/schools/school.jpg"} />
            }
            {
                name.match(/^[a-z0-9_.,'"!?;:& ]+$/i)
                    ? <h2 dir={"ltr"} className={"text-xl ltr p-2 my-4 text-gray-700 font-bold text-center"}>{name.length <= 20 ? name : name.slice(0, 19) + "..."}</h2>
                    : <h2 className={"text-xl ltr p-2 my-4 text-gray-700 font-bold text-center"}>{name.length <= 20 ? name : name.slice(0, 19) + "..."}</h2>
            }
            <hr/>
            <div className={"flex gap-4 items-center p-2 justify-between"}>
                <div className={"flex items-center text-sm text-gray-500 flex-col gap-2"}>
                   <span className={"flex items-center justify-center w-10 h-10 rounded-full border border-indigo-200 bg-indigo-50"}>
                       <PiStudentBold className={"text-lg text-indigo-600"} />
                   </span>
                    {getNumberFormat(count.all)}
                </div>
                <div className={"flex items-center text-sm text-gray-500 flex-col gap-2"}>
                   <span className={"flex items-center justify-center w-10 h-10 rounded-full border border-green-200 bg-green-50"}>
                       <LuUserCheck2 className={"text-lg text-green-600"} />
                   </span>
                    {getNumberFormat(count.admis)}
                </div>
                <div className={"flex items-center text-sm text-gray-500 flex-col gap-2"}>
                   <span className={"flex items-center justify-center w-10 h-10 rounded-full border border-red-200 bg-red-50"}>
                       <LuUserX2 className={"text-lg text-red-600"} />
                   </span>
                    {getNumberFormat(count.ajourne)}
                </div>
            </div>
            <Link
                className={"flex items-center justify-center w-full text-xs p-2 font-medium bg-indigo-700 hover:bg-indigo-600 text-white"}
                to={generateSlug({slug: name, id})}
            >عرض</Link>
        </div>
    )
}

export function ViewResultStudent({result}) {
    const [ids, setIds] = useState([])

    function getDecision(decision) {
        switch (decision) {
            case "ناجح": {
                return <>
                    <span className={"text-xl"}>🎉</span>
                    <span className={"text-2xl text-green-700 font-bold"}>{decision}</span>
                    <span className={"text-xl"}>🎉</span>
                </>
            }
            case "الدورة التكميلية": {
                return <span className={"text-2xl text-yellow-700 font-bold"}>{decision}</span>
            }
            default:
                return <span className={"text-2xl text-slate-700 font-bold"}>{decision}</span>
        }
    }

    return (
        <div className={"flex mx-auto w-full md:w-[350px] flex-col gap-1 bg-stone-50 border rounded-lg"}>
            <div className={"flex flex-col gap-2"}>
                <div className={"flex flex-col px-2 gap-1"}>
                    <FaGraduationCap className={"text-4xl w-full text-center text-indigo-500"}/>
                    <span
                        className={"text-sm w-full text-center font-semibold text-indigo-500"}>#{result.student?.number} - {result.year?.name}{result.session && -
                        <span className={"text-yellow-700"}>{result.session?.name}</span>}</span>
                    <h1 className={"text-xl w-full font-bold text-indigo-600 text-center"}>{result.student?.name}</h1>
                </div>
                <div className={"flex items-center justify-center gap-3"}>
                    {getDecision(result.decision)}
                </div>
                <CardRanking isBorder={true} ranking={{
                    state: result.rankingInState,
                    country: result.rankingInCountry,
                    county: result.rankingInCounty,
                    school: result.rankingInSchool,
                    center: result.rankingInCenter,
                }}/>
            </div>
            <div className={"flex items-center text-sm font-medium text-slate-600 justify-between p-2"}>
                <div className={"flex flex-col gap-1"}>
                    <div className={"flex items-center gap-2"}>
                        <label className={"font-semibold text-slate-700"}>المدرسة</label>
                        {
                            ids.includes(`${getValueForStudentResult({
                                category: result.school,
                                target: "id"
                            })}_${getValueForStudentResult({category: result.school, target: "name"})}`)
                                ? <AiFillEyeInvisible onClick={() => {
                                    if (ids.includes(`${getValueForStudentResult({
                                        category: result.school,
                                        target: "id"
                                    })}_${getValueForStudentResult({category: result.school, target: "name"})}`)) {
                                        setIds(ids.filter(id => id !== `${getValueForStudentResult({
                                            category: result.school,
                                            target: "id"
                                        })}_${getValueForStudentResult({category: result.school, target: "name"})}`))
                                    }
                                }} className={"text-1xl cursor-pointer"}/>
                                : <AiFillEye onClick={() => {
                                    if (!ids.includes(`${getValueForStudentResult({
                                        category: result.school,
                                        target: "id"
                                    })}_${getValueForStudentResult({category: result.school, target: "name"})}`)) {
                                        setIds([...ids, `${getValueForStudentResult({
                                            category: result.school,
                                            target: "id"
                                        })}_${getValueForStudentResult({category: result.school, target: "name"})}`])
                                    }
                                }} className={"text-1xl cursor-pointer"}/>
                        }
                    </div>
                    <Link to={generateSlug({
                        slug: getValueForStudentResult({category: result.school, target: "name"}),
                        id: getValueForStudentResult({category: result.school, target: "id"})
                    })} className={classNames({
                        "text-xs text-indigo-700": true,
                        "blur-sm": ids.includes(`${getValueForStudentResult({
                            category: result.school,
                            target: "id"
                        })}_${getValueForStudentResult({category: result.school, target: "name"})}`)
                    })}>{getValueForStudentResult({category: result.school, target: "name"})}</Link>
                </div>
                <div className={"flex flex-col gap-1"}>
                    <div className={"flex items-center gap-2"}>
                        <label className={"font-semibold text-slate-700"}>المركز</label>
                        {
                            ids.includes(`${getValueForStudentResult({
                                category: result.center,
                                target: "id"
                            })}_${getValueForStudentResult({category: result.center, target: "name"})}`)
                                ? <AiFillEyeInvisible onClick={() => {
                                    if (ids.includes(`${getValueForStudentResult({
                                        category: result.center,
                                        target: "id"
                                    })}_${getValueForStudentResult({category: result.center, target: "name"})}`)) {
                                        setIds(ids.filter(id => id !== `${getValueForStudentResult({
                                            category: result.center,
                                            target: "id"
                                        })}_${getValueForStudentResult({category: result.center, target: "name"})}`))
                                    }
                                }} className={"text-1xl cursor-pointer"}/>
                                : <AiFillEye onClick={() => {
                                    if (!ids.includes(`${getValueForStudentResult({
                                        category: result.center,
                                        target: "id"
                                    })}_${getValueForStudentResult({category: result.center, target: "name"})}`)) {
                                        setIds([...ids, `${getValueForStudentResult({
                                            category: result.center,
                                            target: "id"
                                        })}_${getValueForStudentResult({category: result.center, target: "name"})}`])
                                    }
                                }} className={"text-1xl cursor-pointer"}/>
                        }
                    </div>
                    <Link to={"/" + getValueForStudentResult({category: result.center, target: "id"})}
                          className={classNames({
                              "text-xs text-indigo-700": true,
                              "blur-sm": ids.includes(`${getValueForStudentResult({
                                  category: result.center,
                                  target: "id"
                              })}_${getValueForStudentResult({category: result.center, target: "name"})}`)
                          })}>{getValueForStudentResult({category: result.center, target: "name"})}</Link>
                </div>
            </div>
            <hr/>
            <div className={"flex items-center text-sm font-medium text-gray-500 justify-between p-2"}>
                <div className={"flex flex-col gap-1"}>
                    <div className={"flex items-center gap-2"}>
                        <label className={"font-semibold text-slate-700"}>الولاية</label>
                        {
                            ids.includes(getValueForStudentResult({category: result.state, target: "name"}))
                                ? <AiFillEyeInvisible onClick={() => {
                                    if (ids.includes(getValueForStudentResult({category: result.state, target: "name"}))) {
                                        setIds(ids.filter(id => id !== getValueForStudentResult({
                                            category: result.state,
                                            target: "name"
                                        })))
                                    }
                                }} className={"text-1xl cursor-pointer"}/>
                                : <AiFillEye onClick={() => {
                                    if (!ids.includes(getValueForStudentResult({category: result.state, target: "name"}))) {
                                        setIds([...ids, getValueForStudentResult({category: result.state, target: "name"})])
                                    }
                                }} className={"text-1xl cursor-pointer"}/>
                        }

                    </div>
                    <Link to={`/${getUrlForTypeResults(result.slug)}/results/${generateSlug({
                        slug: result.result.title,
                        id: result.result.id
                    })}//${generateSlug({slug: result.state.name, id: result.state.id})}`}
                          className={classNames({
                              "text-xs text-indigo-700": true,
                              "blur-sm": ids.includes(result.state.name)
                          })}>{result.state.name}</Link>
                </div>
                <div className={"flex flex-col gap-1"}>
                    <div className={"flex items-center gap-2"}>
                        <label className={"font-semibold text-slate-700"}>المقاطعة</label>
                        {
                            ids.includes(getValueForStudentResult({category: result.county, target: "name"}))
                                ? <AiFillEyeInvisible onClick={() => {
                                    if (ids.includes(getValueForStudentResult({category: result.county, target: "name"}))) {
                                        setIds(ids.filter(id => id !== getValueForStudentResult({
                                            category: result.county,
                                            target: "name"
                                        })))
                                    }
                                }} className={"text-1xl cursor-pointer"}/>
                                : <AiFillEye onClick={() => {
                                    if (!ids.includes(getValueForStudentResult({
                                        category: result.county,
                                        target: "name"
                                    }))) {
                                        setIds([...ids, getValueForStudentResult({
                                            category: result.county,
                                            target: "name"
                                        })])
                                    }
                                }} className={"text-1xl cursor-pointer"}/>
                        }
                    </div>
                    <Link to={"/" + getValueForStudentResult({category: result.county, target: "id"})}
                          className={classNames({
                              "text-xs text-indigo-700": true,
                              "blur-sm": ids.includes(getValueForStudentResult({
                                  category: result.county,
                                  target: "name"
                              }))
                          })}>{getValueForStudentResult({category: result.county, target: "name"})}</Link>
                </div>
            </div>
            {
                result.grade !== null &&
                <div className={"flex items-center text-sm font-medium text-gray-500 justify-between p-2"}>
                    <div className={"flex flex-col gap-1"}>
                        <div className={"flex items-center gap-2"}>
                            <label className={"font-semibold text-slate-700"}>المعدل</label>
                            {
                                ids.includes(result.grade)
                                    ? <AiFillEyeInvisible onClick={() => {
                                        if (ids.includes(result.grade)) {
                                            setIds(ids.filter(id => id !== result.grade))
                                        }
                                    }} className={"text-1xl cursor-pointer"}/>
                                    : <AiFillEye onClick={() => {
                                        if (!ids.includes(result.grade)) {
                                            setIds([...ids, result.grade])
                                        }
                                    }} className={"text-1xl cursor-pointer"}/>
                            }
                        </div>
                        <p className={classNames({
                            "text-xs": true,
                            "blur-sm": ids.includes(result.grade)
                        })}>{result.grade}</p>
                    </div>
                    <div className={"flex flex-col gap-1"}>
                        <div className={"flex items-center gap-2"}>
                            <label className={"font-semibold text-slate-700"}>السنة</label>
                            {
                                ids.includes(result.year.name)
                                    ? <AiFillEyeInvisible onClick={() => {
                                        if (ids.includes(result.year.name)) {
                                            setIds(ids.filter(id => id !== result.year.name))
                                        }
                                    }} className={"text-1xl cursor-pointer"}/>
                                    : <AiFillEye onClick={() => {
                                        if (!ids.includes(result.year.name)) {
                                            setIds([...ids, result.year.name])
                                        }
                                    }} className={"text-1xl cursor-pointer"}/>
                            }
                        </div>
                        <p className={classNames({
                            "text-xs": true,
                            "blur-sm": ids.includes(result.year.name)
                        })}>{result.year.name}</p>
                    </div>
                </div>
            }
            <hr/>
            <div className={"flex items-center text-sm font-medium text-gray-500 justify-between p-2"}>
                <div className={"flex flex-col gap-1"}>
                    {
                        result.type !== null
                            ? <>
                                <div className={"flex items-center gap-2"}>
                                    <label className={"font-semibold text-slate-700"}>الشعبة</label>
                                    {
                                        ids.includes(result.type.nameAr)
                                            ? <AiFillEyeInvisible onClick={() => {
                                                if (ids.includes(result.type.nameAr)) {
                                                    setIds(ids.filter(id => id !== result.type.nameAr))
                                                }
                                            }} className={"text-1xl cursor-pointer"}/>
                                            : <AiFillEye onClick={() => {
                                                if (!ids.includes(result.type.nameAr)) {
                                                    setIds([...ids, result.type.nameAr])
                                                }
                                            }} className={"text-1xl cursor-pointer"}/>
                                    }
                                </div>
                                <Link to={"/" + result.type.id} className={classNames({
                                    "text-xs text-indigo-700": true,
                                    "blur-sm": ids.includes(result.type.nameAr)
                                })}>{result.type.nameAr}</Link>
                            </>
                            : <>
                                <div className={"flex items-center gap-2"}>
                                    <label className={"font-semibold text-slate-700"}>المسابقة</label>
                                    {
                                        ids.includes(result.typeResult.name)
                                            ? <AiFillEyeInvisible onClick={() => {
                                                if (ids.includes(result.typeResult.name)) {
                                                    setIds(ids.filter(id => id !== result.typeResult.name))
                                                }
                                            }} className={"text-1xl cursor-pointer"}/>
                                            : <AiFillEye onClick={() => {
                                                if (!ids.includes(result.typeResult.name)) {
                                                    setIds([...ids, result.typeResult.name])
                                                }
                                            }} className={"text-1xl cursor-pointer"}/>
                                    }
                                </div>
                                <Link to={"/" + result.typeResult.id} className={classNames({
                                    "text-xs text-indigo-700": true,
                                    "blur-sm": ids.includes(result.typeResult.name)
                                })}>{result.typeResult.name}</Link>
                            </>
                    }
                </div>
                <div className={"flex flex-col gap-1"}>
                    <div className={"flex items-center gap-2"}>
                        <label className={"font-semibold text-slate-700"}>الدرجة</label>
                        {
                            ids.includes(result.degree)
                                ? <AiFillEyeInvisible onClick={() => {
                                    if (ids.includes(result.degree)) {
                                        setIds(ids.filter(id => id !== result.degree))
                                    }
                                }} className={"text-1xl cursor-pointer"}/>
                                : <AiFillEye onClick={() => {
                                    if (!ids.includes(result.degree)) {
                                        setIds([...ids, result.degree])
                                    }
                                }} className={"text-1xl cursor-pointer"}/>
                        }
                    </div>
                    <p className={classNames({
                        "text-xs": true,
                        "blur-sm": ids.includes(result.degree)
                    })}>{result.degree}</p>
                </div>
            </div>
        </div>
    )
}

export function HeaderSection({title, link, isAll = false}) {
    return (
        <div className={"flex justify-between gap-4"}>
            <div className={"flex gap-3"}>
                <div className={"w-1 block rounded-lg bg-gray-500"}/>
                <h2 className={"text-lg font-bold text-gray-600"}>{title}</h2>
            </div>
            {
                !isAll &&
                <Link
                    className={"flex gap-2 rounded-lg items-center text-xs font-medium justify-center p-2 bg-indigo-100 text-indigo-500"}
                    to={link || "/"}>
                    <span>عرض الكل</span>
                    <HiOutlineExternalLink className={"text-lg"}/>
                </Link>
            }
        </div>
    )
}