import {IoCalendarOutline} from "react-icons/io5";
import {useRef, useState} from "react";
import {useDispatch} from "react-redux";
import {MdEdit, MdTypeSpecimen} from "react-icons/md";
import {WiMoonAltFirstQuarter} from "react-icons/wi";
import {BsTrash3Fill} from "react-icons/bs";
import {TbProgress} from "react-icons/tb";
import Error from "../../components/Error";
import {GrStatusUnknown} from "react-icons/gr";
import {toastActions} from "../../redux/slices/toastSlice.js";
import {ResultSettingsSchema} from "../../helpers/Schemas.js";
import Input from "../Input.jsx";
import Button from "../Button.jsx";
import Nothing from "../Nothing.jsx";
import {useFetcher} from "@remix-run/react";

export default function Card({data, status, message, model, title, handel, isLoading, formRef, children }) {
    const fetcher = useFetcher({ key: "add-result-settings" });
    const isSubmitting = fetcher.state === "submitting";
    const dispatch = useDispatch()
    const [isLoadingEdit, setIsLoadingEdit] = useState(false)
    const [isLoadingD, setIsLoading] = useState(false)
    const [currentId, setCurrentId] = useState()
    const [isEdit, setIsEdit] = useState(false)

    const [name, setName] = useState("")
    const [nameFr, setNameFr] = useState("")
    const [slug, setSlug] = useState("")
    const [placeholder, setPlaceholder] = useState("")

    const formRefEdit = useRef()
    const [error, setError] = useState({})
    const [errorSlug, setErrorSlug] = useState(false)
    const [errorNameFr, setErrorNameFr] = useState(false)

    const getIcon = () => {
        switch (model) {
            case "type":
                return <MdTypeSpecimen className={"text-2xl"} />
            case "year":
                return <IoCalendarOutline className={"text-2xl"} />
            case "session":
                return <WiMoonAltFirstQuarter className={"text-2xl"} />
            case "unknown":
                return <GrStatusUnknown className={"text-2xl"} />
        }
    }

    const getPlaceholder= () => {
        switch (model) {
            case "type":
                return  setPlaceholder("اكتب اسم النوع")
            case "year":
                return  setPlaceholder("اكتب اسم السنة")
            case "session":
                return  setPlaceholder("اكتب اسم الدورة")
            case "unknown":
                return  setPlaceholder("اكتب اسم القيمة الافتراضية")
        }
    }

    const getMessage = () => {
        switch (model) {
            case "type":
                return  "المعذرة منك، لم نتمكن من العثور على أنواع، يرجى إضافة أنواع جديدة لعرضها. (:"
            case "year":
                return  "المعذرة منك، لم نتمكن من العثور على سنوات، يرجى إضافة سنوات جديدة لعرضها. (:"
            case "session":
                return  "المعذرة منك، لم نتمكن من العثور على دورات، يرجى إضافة دورات جديدة لعرضها. (:"
            case "unknown":
                return  "المعذرة منك، لم نتمكن من العثور على قيم افتراضية، يرجى إضافة قيم جديدة لعرضها. (:"
        }
    }

    const deleteItem = async (id) => {
        const formData = new FormData();
        formData.append("id", id);
        formData.append("target", model);
        setIsLoading(true)
        // submit(formData, { method: "delete" });
        fetcher.submit(formData, {
            method: "POST",
        });
        // const { message, status, data } = model === "type" ? await deleteType(id) : model === "year" ? await deleteYear(id) : model === "unknown" ? await deleteUnknown(id) : await deleteSession(id)
        // if(status === "success"){
        //     setIsLoading(false)
        //     dispatch(toastActions.setIsShow(true))
        //     dispatch(toastActions.setStatus(status))
        //     dispatch(toastActions.setMessage(message))
        // }else {
        //     dispatch(toastActions.setIsShow(true))
        //     dispatch(toastActions.setStatus(status))
        //     dispatch(toastActions.setMessage(message))
        //     setIsLoading(false)
        // }
    }

    const handelEdit =  async (e) => {

        e.preventDefault()
        setIsLoadingEdit(true)
        dispatch(toastActions.setIsShow(false))
        const validated =  ResultSettingsSchema.safeParse({ name })
        if(validated.success) {
            setError({})
            if(model === "session" || model === "type"){
                if(slug.length === 0){
                    setErrorSlug(true)
                    setIsLoadingEdit(false)
                    return false;
                }
            }
            if(model === "unknown"){
                if(nameFr.length === 0){
                    setErrorNameFr(true)
                    setIsLoading(false)
                    return false;
                }
            }
            const formData = new FormData();
            formData.append("id", currentId);
            formData.append("name", name);
            formData.append("nameFr", nameFr);
            formData.append("model", model);
            formData.append("slug", slug);
            // submit(formData, { method: "patch" });
            // const { message, status, data } = await updateResultSettings({id: currentId, name, nameFr, model, slug})
            // if(status === "success"){
            //     formRefEdit.current.reset()
            //     setErrorSlug(false)
            //     setErrorNameFr(false)
            //     setIsLoadingEdit(false)
            //     dispatch(toastActions.setIsShow(true))
            //     dispatch(toastActions.setStatus(status))
            //     dispatch(toastActions.setMessage(message))
            //     setIsEdit(false)
            // }else {
            //     dispatch(toastActions.setIsShow(true))
            //     dispatch(toastActions.setStatus(status))
            //     dispatch(toastActions.setMessage(message))
            //     setIsLoadingEdit(false)
            //     setError(data)
            // }
        } else {
            setIsLoadingEdit(false)
            setError(validated.error.format())
        }

    }

    return (
        <div className={"flex flex-col gap-3 p-2 bg-white border border-dashed rounded-lg"}>
            <h3 className={"text-lg font-bold text-slate-700"}>{title}</h3>
            <fetcher.Form method="post" className={"flex gap-2"}>
                <input type={"hidden"} name={"model"} defaultValue={model} />
                <div className={"flex-grow flex flex-col gap-2"}>
                    {
                        isEdit &&
                        <>
                            {
                                model === "year" &&
                                <>
                                    <Input
                                        onChange={(e) => setName(e.target.value)}
                                        isError={error?.name}
                                        type={"number"}
                                        name={"type"}
                                        defaultValue={name}
                                        placeholder={placeholder}
                                    />
                                    {
                                        error?.name && <Error message={error?.name._errors.join()}/>
                                    }
                                </>
                            }
                            {
                                model !== "year" &&
                                <>
                                    <Input
                                        onChange={(e) => setName(e.target.value)}
                                        isError={error?.name}
                                        type={"text"}
                                        name={model === "type" ? "type" : model === "unknown" ? "unknown" : "session"}
                                        defaultValue={name}
                                        placeholder={placeholder}
                                    />
                                    {
                                        error?.name && <Error message={error?.name._errors.join()}/>
                                    }
                                    {
                                        model === "unknown"
                                            ? <>
                                                <Input
                                                    onChange={(e) => setNameFr(e.target.value)}
                                                    isError={nameFr}
                                                    type={"text"}
                                                    name={"nameFr"}
                                                    defaultValue={nameFr}
                                                    placeholder={`اكتب الاسم بالإنكليزية`}
                                                />
                                                {
                                                    errorNameFr && <Error message={`اكتب الاسم بالإنكليزية`}/>
                                                }
                                            </>
                                            : <>
                                                <Input
                                                    onChange={(e) => setSlug(e.target.value)}
                                                    isError={errorSlug}
                                                    type={"text"}
                                                    name={"slug"}
                                                    defaultValue={slug}
                                                    placeholder={`اكتب الرقم المختصر ${model === "type" ? "للنوع" : "للدورة"}`}
                                                />
                                                {
                                                    errorSlug && <Error
                                                        message={`رجاء اكتب الرقم المختصر ${model === "type" ? "للنوع" : "للدورة"}`}/>
                                                }
                                            </>
                                    }
                                </>
                            }
                        </>
                    }
                    {
                        !isEdit && children
                    }
                </div>
                <div className={"self-start"}>
                    <Button isOnlyIcon={true} isLoading={isSubmitting}
                            title={isEdit ? "تحديث" : "إضافة"}/>
                </div>
            </fetcher.Form>
            {/*<form ref={isEdit ? formRefEdit : formRef} onSubmit={isEdit ? handelEdit : handel} className={"flex gap-2"}>*/}

            {/*</form>*/}
            <hr/>
            <ul className={"flex flex-col gap-3"}>
                {
                    data !== undefined &&
                    data.map((d, index) =>
                        <li key={index} className={"flex items-center justify-between gap-2 text-slate-600"}>
                            <div className={"flex items-center gap-2"}>
                                {
                                    getIcon()
                                }
                                <span
                                    className={"text-sm font-medium"}>{model === "year" ? `سنة ${d.name}` : d.name || d.nameAr}</span>
                            </div>
                            <div className={"flex items-center gap-3"}>
                                <span onClick={async () => {
                                    setName(d.name || d.nameAr)
                                    setSlug(d.slug)
                                    setNameFr(d.nameFr)
                                    setCurrentId(d.id)
                                    getPlaceholder()
                                    setIsEdit(currentId === d.id ? !isEdit : true)
                                }}
                                      className={"cursor-pointer p-2 flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 border border-dashed border-indigo-200"}>
                                    {
                                        isLoadingEdit && currentId === d.id
                                            ? <TbProgress className={"text-xl text-indigo-600 animate-spin"}/>
                                            : <MdEdit className={"text-xl text-indigo-600 hover:text-indigo-500"}/>
                                    }
                                </span>
                                <span onClick={async () => {
                                    setCurrentId(d.id)
                                    await deleteItem(d.id)
                                }}
                                      className={"cursor-pointer p-2 flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 border border-dashed border-red-200"}>
                                    {
                                        isLoadingD && currentId === d.id
                                            ? <TbProgress className={"text-xl text-red-600 animate-spin"}/>
                                            : <BsTrash3Fill className={"text-xl text-red-600 hover:text-red-500"}/>
                                    }

                                </span>
                            </div>
                        </li>
                    )
                }
                {data === undefined && <Nothing title={"عفوا 😔"} desc={getMessage()}/>}
            </ul>
        </div>
    )
}