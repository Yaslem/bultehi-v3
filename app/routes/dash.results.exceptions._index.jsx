import Section from "../components/Section.jsx";
import Button from "../components/Button.jsx";
import Input from "../components/Input.jsx";
import {json, Link, useFetcher, useLoaderData} from "@remix-run/react";
import {useEffect, useState} from "react";
import Table, {Td, Tr} from "../components/Table.jsx";
import {DeleteIcon, EditIcon, Switch} from "../components/ActionsIcon.jsx";
import Nothing from "../components/Nothing.jsx";
import CardAdd from "../components/dash/CardAdd.jsx";
import Error from "../components/Error";
import {
    CreateResultSettings, deleteType,
    getTypes, getYears,
    updateResultSettings
} from "../controllers/ResultSettings.server.js";
import {toastActions} from "../redux/slices/toastSlice.js";
import {useDispatch} from "react-redux";
import {generatePageTitle} from "../helpers/Global.js";
import {PageTitle} from "../components/PageControlButtons.jsx";
import {
    createException,
    deleteException,
    getExceptions,
    getResults,
    updateException, updateExceptionApplied
} from "../controllers/Result.server.js";
import Validate from "../helpers/Validate.js";
import Select, {Option} from "../components/Select.jsx";
import {getUserAuthenticated} from "../services/auth.server.js";
import {redirect} from "@remix-run/node";

export const loader = async () => {
    return json({
        exceptions: await getExceptions(),
        results: await getResults(),
        years: await getYears(),
        types: await getTypes()
    });
};

export const meta = ({ matches }) => {
    return generatePageTitle({matches, current: "الاستثناءات"});
};

export const handle = {
    breadcrumb: () => <Link className={"text-indigo-700 hover:text-indigo-600"} to="/dash/results/exceptions">الاستثناءات</Link>,
};
export default function DashResultsExceptions_index() {
    const {exceptions, results, years, types} = useLoaderData();
    const fetcher = useFetcher();
    const res = fetcher.data
    const dispatch = useDispatch()
    const [currentId, setCurrentId] = useState("")
    const [name, setName] = useState()
    const [value, setValue] = useState()
    const [degree, setDegree] = useState()
    const [applied, setApplied] = useState(false)
    const [action, setAction] = useState("")
    const [ref, setRef] = useState()
    const [resultId, setResultId] = useState()
    const [yearId, setYearId] = useState()
    const [typeId, setTypeId] = useState()
    const isSubmitting = fetcher.state === "submitting";
    const [error, setError] = useState({})
    const [showAdd, setShowAdd] = useState(false)
    const [isEdit, setIsEdit] = useState(false)

    const submit = async (e) => {
        e.preventDefault()
        const validated = Validate.createException.safeParse({name, value, degree, ref, typeId: parseInt(typeId), yearId: parseInt(yearId), resultId: parseInt(resultId)})
        if(validated.success){
            setError({})
            const formData = new FormData();
            formData.append("name", name)
            formData.append("value", value)
            formData.append("degree", degree)
            formData.append("ref", ref)
            formData.append("resultId", resultId)
            formData.append("yearId", yearId)
            formData.append("typeId", typeId)
            formData.append("action", isEdit ? "edit" : "create")
            if(isEdit){
                formData.append("id", currentId)
            }
            fetcher.submit(formData, {
                method: isEdit ? "PUT" : "POST",
            });
        } else {
            setError(validated.error.format())
        }

    }

    useEffect(() => {
        if(res){
            dispatch(toastActions.setIsShow(true))
            dispatch(toastActions.setStatus(res?.status))
            dispatch(toastActions.setMessage(res?.message))
            if(res?.status === "success"){
                setShowAdd(false)
                setName(undefined)
                setValue(undefined)
                setDegree(undefined)
                setRef(undefined)
                setYearId(undefined)
                setTypeId(undefined)
                setResultId(undefined)
            }else {
                setError(res?.data)
            }
        }
    }, [res]);

    return (
        <Section>
            {
                showAdd &&
                <CardAdd isSubmitting={isSubmitting}
                         onSubmit={submit} onClick={() => setShowAdd(false)}
                         title={isEdit ? "تعديل استثناء" : "إضافة استثناء"}>
                    <div className={"flex gap-3"}>
                        <Input
                            onChange={(e) => setName(e.target.value)}
                            isError={error?.name}
                            defaultValue={name}
                            type={"text"}
                            name={"name"}
                            label={"الاسم"}
                            placeholder={"اكتب اسم الاستناء"} error={
                            error?.name && <Error message={error?.name._errors.join()}/>
                        }/>
                        <Input
                            onChange={(e) => setRef(e.target.value)}
                            isError={error?.ref}
                            defaultValue={ref}
                            type={"text"}
                            name={"ref"}
                            label={"المرجع"}
                            placeholder={"اكتب المرجع"} error={
                            error?.ref && <Error message={error?.ref._errors.join()}/>
                        }/>
                    </div>
                    <div className={"flex gap-3"}>
                        <Input
                            onChange={(e) => setDegree(e.target.value)}
                            isError={error?.degree}
                            defaultValue={degree}
                            type={"text"}
                            name={"degree"}
                            label={"الدرجة"}
                            placeholder={"اكتب الدرجة"} error={
                            error?.degree && <Error message={error?.degree._errors.join()}/>
                        }/>
                        <Input
                            onChange={(e) => setValue(e.target.value)}
                            isError={error?.value}
                            defaultValue={value}
                            type={"text"}
                            name={"value"}
                            label={"القيمة"}
                            placeholder={"اكتب القيمة"} error={
                            error?.value && <Error message={error?.value._errors.join()}/>
                        }/>
                    </div>
                    <Select
                        name={"resultId"}
                        onChange={(e) => setResultId(e.target.value)}
                        label={"النتيجة"}
                        defaultValue={resultId}
                        isError={error?.resultId} error={
                        error?.resultId && <Error message={error?.resultId._errors.join()}/>
                    }>
                        {
                            results.data.map((result, index) =>
                                <Option key={index} value={result.id} selected={yearId} title={result.title}/>
                            )
                        }
                    </Select>
                    <div className={"flex gap-3"}>
                        <Select
                            name={"typeId"}
                            onChange={(e) => {
                                setTypeId(e.target.value)
                            }}
                            label={"النوع"}
                            defaultValue={typeId}
                            isError={error?.typeId} error={
                            error?.typeId && <Error message={error?.typeId._errors.join()}/>
                        }>
                            {
                                types.data.map((type, index) =>
                                    <Option key={index} value={type.id} selected={typeId} title={type.name}/>
                                )
                            }
                        </Select>
                        <Select
                            name={"yearId"}
                            onChange={(e) => setYearId(e.target.value)}
                            label={"السنة"}
                            defaultValue={yearId}
                            isError={error?.yearId} error={
                            error?.yearId && <Error message={error?.yearId._errors.join()}/>
                        }>
                            {
                                years.data.map((year, index) =>
                                    <Option key={index} value={year.id} selected={yearId} title={year.name}/>
                                )
                            }
                        </Select>
                    </div>
                </CardAdd>
            }
            <div className={"flex items-center justify-between gap-4"}>
                <PageTitle title={"الاستثناءات"}/>
                <Button onClick={() => {
                    if (types.status === "error" || years.status === "error" || results.status === "error") {
                        setShowAdd(false)
                        dispatch(toastActions.setIsShow(true))
                        dispatch(toastActions.setStatus("error"))
                        dispatch(toastActions.setMessage("تأكّد من إضافة السنوات أو الأنواع أو النتائج."))
                    } else {
                        setShowAdd(true)
                    }
                }} title={"إضافة استثناء"}/>
            </div>
            {
                exceptions.status === "success" &&
                    <Table th={["الاسم", "المرجع", "الدرجة", "القيمة", "الحالة", "النتيجة", "السنة", "النوع", "خيارات"]}>
                        {
                            exceptions.data.map((exception, index) =>
                                <Tr key={index}>
                                    <Td value={exception.name} />
                                    <Td value={exception.ref} />
                                    <Td value={exception.degree} />
                                    <Td value={exception.value} />
                                    <Td value={
                                        <Switch name={"applied"} value={exception.id} checked={exception.applied}
                                                onChange={async (e) => {
                                                    const formData = new FormData();
                                                    formData.append("id", exception.id)
                                                    formData.append("status", e.target.checked)
                                                    formData.append("action", "updateExceptionApplied")
                                                    fetcher.submit(formData, {
                                                        method: "PATCH",
                                                    });
                                                }}/>
                                    }/>
                                    <Td value={exception.result.title}/>
                                    <Td value={exception.year.name}/>
                                    <Td value={exception.type.name}/>
                                    <Td value={
                                        <div className={"flex items-center justify-center gap-3"}>
                                            <EditIcon onClick={async () => {
                                                setCurrentId(exception.id)
                                                setAction("edit")
                                                setShowAdd(true)
                                                setName(exception.name)
                                                setValue(exception.value)
                                                setRef(exception.ref)
                                                setDegree(exception.degree)
                                                setYearId(exception.yearId)
                                                setTypeId(exception.typeId)
                                                setResultId(exception.resultId)
                                                setIsEdit(true)

                                            }} isLoading={isSubmitting} itemId={exception.id} action={action} currentId={currentId} />
                                            <DeleteIcon onClick={ async () => {
                                                setCurrentId(exception.id)
                                                setAction("delete")
                                                dispatch(toastActions.setIsShow(false))
                                                const formData = new FormData();
                                                formData.append("id", exception.id)
                                                formData.append("action", "delete")
                                                await fetcher.submit(formData, {
                                                    method: "DELETE",
                                                });
                                            }} isLoading={isSubmitting} action={action} currentId={currentId} itemId={exception.id} />
                                        </div>
                                    } />
                                </Tr>
                            )
                        }
                    </Table>
            }
            {exceptions.status === "error" && <Nothing title={"عفوا 😔"} desc={"المعذرة منك، لم نتمكن من العثور على استثناءات، يرجى إضافة استثناء جديد لعرضه. (:"}/>}
        </Section>
    )
}

export async function action({request}) {
    const user = await getUserAuthenticated(request)
    let {name, value, degree, ref, typeId, resultId, yearId, status, action, id} = Object.fromEntries(await request.formData());
    status = status === "true"
    if(user && user.role === "ADMIN"){
        switch (action) {
            case "create": {
                return json(await createException({name, value, degree, ref, typeId, resultId, yearId}));
            }
            case "edit": {
                return json(await updateException(id,{name, value, degree, ref, typeId, resultId, yearId}));
            }
            case "delete": {
                return json(await deleteException(id));
            }
            case "updateExceptionApplied": {
                return json(await updateExceptionApplied(id, status));
            }
        }
    } else {
        return redirect("/")
    }


}