import Section from "../components/Section.jsx";
import Button from "../components/Button.jsx";
import LinkCategories from "../components/LinkCategories.jsx";
import {AiOutlineException} from "react-icons/ai";
import Input from "../components/Input.jsx";
import {json, useFetcher, useLoaderData} from "@remix-run/react";
import {
    createResult,
    deleteResult,
    getResults, updateResult,
    updateResultPublished, updateResultUploaded,
    uploadResults
} from "../controllers/Result.server.js";
import {
    getSessions,
    getTypes,
    getYears,
    getUnknown
} from "../controllers/ResultSettings.server.js";
import {useEffect, useRef, useState} from "react";
import {useDispatch} from "react-redux";
import {toastActions} from "../redux/slices/toastSlice.js";
import Table, {Td, Tr} from "../components/Table.jsx";
import { getDateForHuman, getNumberFormat} from "../helpers/Global.js";
import {DeleteIcon, EditIcon, Switch, UploadIcon} from "../components/ActionsIcon.jsx";
import Nothing from "../components/Nothing.jsx";
import {FaCalendarDays} from "react-icons/fa6";
import {MdTypeSpecimen} from "react-icons/md";
import {WiMoonAltFirstQuarter} from "react-icons/wi";
import {GrMenu, GrStatusUnknown} from "react-icons/gr";
import Validate from "../helpers/Validate.js";
import CardAdd from "../components/dash/CardAdd.jsx";
import Error from "../components/Error";
import Select, {Option} from "../components/Select.jsx";
import {PageTitle} from "../components/PageControlButtons.jsx";
import {getUserAuthenticated} from "../services/auth.server.js";
import {redirect} from "@remix-run/node";

export const loader = async () => {
    return json({
        results: await getResults(),
        types: await getTypes(),
        years: await getYears(),
        unknown: await getUnknown(),
        sessions: await getSessions()
    });
};

export async function action({ request }) {
    let {action, status, fileResult, file, title, isBac, typeId, sessionId, yearId, id} = Object.fromEntries(await request.formData());
    isBac = isBac === "true"
    console.log("type id: ", typeId)
    const user = await getUserAuthenticated(request)
    if(user && user.role === "ADMIN"){
        switch (action) {
            case "create": {
                return json( await createResult({fileResult, title, isBac, typeId, sessionId, yearId}));
            }
            case "edit": {
                return json( await updateResult(id, {fileResult, file, title, isBac, typeId, sessionId, yearId}));
            }
            case "upload": {
                return json( await uploadResults(id));
            }
            case "updatePublished": {
                return json( await updateResultPublished(id, status));
            }
            case "updateUploaded": {
                return json( await updateResultUploaded(id, status));
            }
            case "delete": {
                return json( await deleteResult(id, file));
            }
        }
    } else {
        return redirect("/")
    }

}

export default function DashResults_index() {
    const {results, types, years, sessions, unknown} = useLoaderData();

    const [showAdd, setShowAdd] = useState(false)
    const [showCate, setShowCate] = useState(false)
    const menuCateRef = useRef()
    const dispatch = useDispatch()

    const fetcher = useFetcher();
    const res = fetcher.data
    const isSubmitting = fetcher.state === "submitting";

    const [title, setTitle] = useState()
    const [file, setFile] = useState()
    const [newFile, setNewFile] = useState()
    const [isNewFile, setIsNewFile] = useState(false)

    const [yearId, setYearId] = useState()
    const [typeId, setTypeId] = useState()
    const [sessionId, setSessionId] = useState()

    const [currentId, setCurrentId] = useState("")
    const [action, setAction] = useState("")
    const [isEdit, setIsEdit] = useState(false)

    const [error, setError] = useState({})
    const [isBac, setIsBac] = useState(false)

    useEffect(() => {
        if(res){
            dispatch(toastActions.setIsShow(true))
            dispatch(toastActions.setStatus(res?.status))
            dispatch(toastActions.setMessage(res?.message))
            if(res?.status === "success"){
                setShowAdd(false)
                setTitle(undefined)
                setYearId(undefined)
                setTypeId(undefined)
                setFile(undefined)
            }else {
                setError(res?.data)
            }
        }
    }, [res]);


    const handelCreate = async (e) => {
        e.preventDefault()
        dispatch(toastActions.setIsShow(false))
        const validated = isBac ? Validate.createResult.safeParse({title, typeId, yearId, sessionId, file}) : Validate.createResult.safeParse({title, typeId, yearId, file})
        if(validated.success){
            setError({})
            const formData = new FormData()
            formData.append("action", "create")
            formData.append("fileResult", file)
            formData.append("title", title)
            formData.append("isBac", isBac)
            formData.append("typeId", typeId)
            formData.append("sessionId", sessionId)
            formData.append("yearId", yearId)
            await fetcher.submit(formData, {
                method: "POST",
                encType: "multipart/form-data"
            });
        }else {
            setError(validated.error.format())
        }
    }

    const handelUpdate = async (e) => {
        e.preventDefault()
        dispatch(toastActions.setIsShow(false))

        const validated = isBac ? Validate.updateResult.safeParse({title, yearId, sessionId}) : Validate.updateResult.safeParse({title, yearId})

        if(validated.success){
            setError({})
            const formData = new FormData()
            formData.append("action", "edit")
            formData.append("id", currentId)
            formData.append("fileResult", newFile)
            formData.append("file", file)
            formData.append("title", title)
            formData.append("isBac", isBac)
            formData.append("typeId", typeId)
            formData.append("sessionId", sessionId)
            formData.append("yearId", yearId)
            await fetcher.submit(formData, {
                method: "PUT",
                encType: "multipart/form-data"
            });
        }else {
            setError(validated.error.format())
        }
    }

    return (
        <Section>
            {
                showAdd &&
                <CardAdd
                    onClick={() => setShowAdd(false)}
                    title={isEdit ? "تعديل النتيجة" : "إضافة نتيجة"}
                    onSubmit={isEdit ? handelUpdate : handelCreate}
                    isSubmitting={isSubmitting}
                >
                        <Input
                            onChange={(e) => setTitle(e.target.value)}
                            isError={error?.title}
                            defaultValue={title}
                            type={"text"}
                            name={"title"}
                            label={"العنوان"}
                            placeholder={"اكتب عنوان النتيجة"} />
                        {
                            error?.title && <Error message={error?.title._errors.join()} />
                        }
                        <div className={"grid grid-cols-2 gap-2"}>
                            {
                                !isEdit &&
                                <>
                                    <div className={"flex flex-col gap-2"}>
                                        <Select
                                            name={"typeId"}
                                            onChange={(e) => {
                                                setTypeId(e.target.value.toString().split("ISSLUG").shift())
                                                if(Number(e.target.value.toString().split("ISSLUG").pop()) === 5) {
                                                    setIsBac(true)
                                                } else {
                                                    setIsBac(false)
                                                }
                                            }}
                                            label={"النوع"}
                                            defaultValue={typeId}
                                            isError={error?.typeId}>
                                            {
                                                types.data.map((type, index) =>
                                                    <Option key={index} value={`${type.id}ISSLUG${type.slug}`} selected={typeId} title={type.name} />
                                                )
                                            }
                                        </Select>
                                        {
                                            error?.typeId && <Error message={error?.typeId._errors.join()} />
                                        }
                                    </div>
                                </>
                            }
                            <div className={"flex flex-col gap-2"}>
                                <Select
                                    name={"yearId"}
                                    onChange={(e) => setYearId(e.target.value)}
                                    label={"السنة"}
                                    defaultValue={yearId}
                                    isError={error?.yearId}>
                                    {
                                        years.data.map((year, index) =>
                                            <Option key={index} value={year.id} selected={yearId} title={year.name} />
                                        )
                                    }
                                </Select>
                                {
                                    error?.yearId && <Error message={error?.yearId._errors.join()} />
                                }
                            </div>
                        </div>
                        {
                            isBac &&
                            <Select
                                name={"sessionId"}
                                onChange={(e) => setSessionId(e.target.value)}
                                label={"الدورة"}
                                defaultValue={sessionId}
                                isError={error?.sessionId}>
                                {
                                    sessions.data.map((session, index) =>
                                        <Option key={index} value={session.id} selected={sessionId} title={session.name} />
                                    )
                                }
                            </Select>
                        }
                        {
                            error?.sessionId && <Error message={error?.sessionId._errors.join()} />
                        }
                        {
                            isEdit
                                ? <>
                                    <Switch
                                        title={"ملف جديد؟"}
                                        isTitle={true}
                                        checked={isNewFile}
                                        onChange={(e) => {
                                            if(e.target.checked){
                                                setIsNewFile(true)
                                            } else {
                                                setIsNewFile(false)
                                            }
                                        }} />
                                    {
                                        isNewFile &&
                                        <>
                                            <Input
                                                onChange={(e) => {
                                                    if(isEdit){
                                                        setNewFile(e.target.files[0])
                                                    }else {
                                                        setFile(e.target.files[0])
                                                    }
                                                }}
                                                isError={error?.file}
                                                type={"file"}
                                                name={"file"} />
                                            {
                                                error?.file && <Error message={error?.file._errors.join()} />
                                            }
                                        </>
                                    }
                                </>
                                : <>
                                    <Input
                                        onChange={(e) => {
                                            if(isEdit){
                                                setNewFile(e.target.files[0])
                                            }else {
                                                setFile(e.target.files[0])
                                            }
                                        }}
                                        isError={error?.file}
                                        type={"file"}
                                        name={"file"}
                                        label={"ملف النتائج"} />
                                    {
                                        error?.file && <Error message={error?.file._errors.join()} />
                                    }
                                </>
                        }
                </CardAdd>
            }
            <div className={"flex items-center justify-between gap-3"}>
                <PageTitle title={"النتائج"}/>
                <div className={"flex items-center gap-3"}>
                    <div className={"flex items-center relative gap-3"}>
                        <div onClick={() => setShowCate(!showCate)}
                             className={"flex btn-click-menu bg-white cursor-pointer text-indigo-700 hover:text-indigo-600 p-2 border rounded-lg items-center justify-center ml-0 mr-auto"}>
                            <GrMenu className={"btn-click-menu"}/>
                        </div>
                        {
                            showCate &&
                            <ul ref={menuCateRef} id={"menu-cate"}
                                className={"flex z-10 shadow-md absolute left-0 top-10 overflow-hidden bg-white border rounded-lg flex-col gap-2"}>
                                <LinkCategories
                                    link={"/exceptions"}
                                    title={"الاستثناءات"}
                                    icon={<AiOutlineException
                                        className={"text-2xl text-slate-600 group-hover:text-white"}/>}/>
                                <LinkCategories
                                    link={"/years"}
                                    title={"السنوات"}
                                    icon={<FaCalendarDays
                                        className={"text-2xl text-slate-600 group-hover:text-white"}/>}/>
                                <LinkCategories
                                    link={"/sessions"}
                                    title={"الدورات"}
                                    icon={<WiMoonAltFirstQuarter
                                        className={"text-2xl text-slate-600 group-hover:text-white"}/>}/>
                                <LinkCategories
                                    link={"/types"}
                                    title={"الأنواع"}
                                    icon={<MdTypeSpecimen
                                        className={"text-2xl text-slate-600 group-hover:text-white"}/>}/>
                                <LinkCategories
                                    link={"/unknown"}
                                    title={"القيمة المجهولة"}
                                    icon={<GrStatusUnknown
                                        className={"text-2xl text-slate-600 group-hover:text-white"}/>}/>
                            </ul>
                        }
                    </div>
                    <Button onClick={() => {
                        if (sessions.status === "error" || types.status === "error" || unknown.status === "error" || years.status === "error") {
                            setShowAdd(false)
                            dispatch(toastActions.setIsShow(true))
                            dispatch(toastActions.setStatus("error"))
                            dispatch(toastActions.setMessage("تأكّد من إضافة السنوات أو الأنواع أو الدورات."))
                        } else {
                            setShowAdd(true)
                        }

                    }} title={"إضافة نتيجة"}/>
                </div>
            </div>
            {
                results.status === "success" &&
                <Table
                    th={["العنوان", "السنة", "النوع", "الدورة", "الإجمالي", "آخر تحديث", "حالة النشر", "حالة التحميل", "خيارات"]}>
                    {
                        results.data.map((result, index) =>
                            <Tr key={index}>
                                <Td value={result.title}/>
                                <Td value={result.year.name}/>
                                <Td value={result.type.name}/>
                                <Td value={result.session ? result.session.name : "---"}/>
                                <Td value={getNumberFormat(result._count.results)}/>
                                <Td value={getDateForHuman(result.updatedAt, false)}/>
                                <Td value={
                                    <Switch name={result.title} value={result.id} checked={result.isPublished}
                                            onChange={async (e) => {
                                                const formData = new FormData();
                                                formData.append("id", result.id)
                                                formData.append("status", e.target.checked)
                                                formData.append("action", "updatePublished")
                                                await fetcher.submit(formData, {
                                                    method: "PATCH",
                                                });
                                            }}/>
                                }/>
                                <Td value={
                                    <Switch name={result.title} value={result.id} checked={result.isUploaded}
                                            onChange={async (e) => {
                                                const formData = new FormData();
                                                formData.append("id", result.id)
                                                formData.append("status", e.target.checked)
                                                formData.append("action", "updateUploaded")
                                                fetcher.submit(formData, {
                                                    method: "PATCH",
                                                });
                                            }}/>
                                } />
                                <Td value={
                                    <div className={"flex items-center justify-center gap-3"}>
                                        <EditIcon onClick={ async () => {
                                            setCurrentId(result.id)
                                            setAction("edit")
                                            setShowAdd(true)
                                            setTitle(result.title)
                                            setFile(result.file)
                                            setYearId(result.yearId)
                                            if(result.type.slug === 5){
                                                setIsBac(true)
                                                setSessionId(result.sessionId)
                                            } else {
                                                setIsBac(false)
                                            }
                                            setIsEdit(true)

                                        }} isLoading={isSubmitting} itemId={result.id} action={action} currentId={currentId} />
                                        <UploadIcon onClick={ async () => {
                                            setAction("upload")
                                            setCurrentId(result.id)
                                            const formData = new FormData();
                                            formData.append("id", result.id)
                                            formData.append("action", "upload")
                                            await fetcher.submit(formData, {
                                                method: "PUT",
                                            });

                                        }} isLoading={isSubmitting} action={action} itemId={result.id} currentId={currentId} />
                                        <DeleteIcon onClick={ async () => {
                                            setCurrentId(result.id)
                                            setAction("delete")
                                            dispatch(toastActions.setIsShow(false))

                                            const formData = new FormData();
                                            formData.append("id", result.id)
                                            formData.append("file", result.file)
                                            formData.append("action", "delete")
                                            await fetcher.submit(formData, {
                                                method: "DELETE",
                                            });

                                        }} isLoading={isSubmitting} action={action} currentId={currentId} itemId={result.id} />
                                    </div>
                                } />
                            </Tr>
                        )
                    }
                </Table>
            }
            {results.status === "error" && <Nothing title={"عفوا 😔"} desc={"المعذرة منك، لم نتمكن من العثور على نتائج، يرجى إضافة نتائج جديدة لعرضها. (:"}/>}
        </Section>
    )
}
