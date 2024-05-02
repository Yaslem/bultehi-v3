import Section from "../components/Section.jsx";
import Title from "../components/dash/Title.jsx";
import Button from "../components/Button.jsx";
import Input from "../components/Input.jsx";
import {json, Link, useFetcher, useLoaderData} from "@remix-run/react";
import {useEffect, useState} from "react";
import Table, {Td, Tr} from "../components/Table.jsx";
import {DeleteIcon, EditIcon} from "../components/ActionsIcon.jsx";
import Nothing from "../components/Nothing.jsx";
import CardAdd from "../components/dash/CardAdd.jsx";
import Error from "../components/Error";
import {
    CreateResultSettings, deleteType,
    getTypes,
    updateResultSettings
} from "../controllers/ResultSettings.server.js";
import {ResultSettingsSchema} from "../helpers/Schemas.js";
import {toastActions} from "../redux/slices/toastSlice.js";
import {useDispatch} from "react-redux";
import {generatePageTitle} from "../helpers/Global.js";
import {PageTitle} from "../components/PageControlButtons.jsx";
import {getUserAuthenticated} from "../services/auth.server.js";
import {redirect} from "@remix-run/node";

export const loader = async () => {
    return json(await getTypes());
};

export const meta = ({ matches }) => {
    return generatePageTitle({matches, current: "الأنواع"});
};

export const handle = {
    breadcrumb: () => <Link className={"text-indigo-700 hover:text-indigo-600"} to="/dash/results/types">الأنواع</Link>,
};
export default function DashResultsTypes_index() {
    const {status, data: types} = useLoaderData();
    const fetcher = useFetcher();
    const res = fetcher.data
    const dispatch = useDispatch()
    const [currentId, setCurrentId] = useState("")
    const [name, setName] = useState("")
    const [slug, setSlug] = useState("")
    const isSubmitting = fetcher.state === "submitting";
    const [error, setError] = useState({})
    const [errorSlug, setErrorSlug] = useState(false)
    const [showAdd, setShowAdd] = useState(false)
    const [isEdit, setIsEdit] = useState(false)

    const submit = async (e) => {
        e.preventDefault()
        const validated =  ResultSettingsSchema.safeParse({ name })
        if(validated.success){
            setError({})
            if(slug.length === 0){
                setErrorSlug(true)
                return false;
            } else {
                setErrorSlug(false)
                const formData = new FormData();
                formData.append("name", name)
                formData.append("slug", slug)
                formData.append("action", isEdit ? "edit" : "create")
                if(isEdit){
                    formData.append("id", currentId)
                }
                fetcher.submit(formData, {
                    method: isEdit ? "PUT" : "POST",
                });
            }
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
                setName("")
                setSlug("")
                setIsEdit(false)
            }else {
                setError(res?.data)
            }
        }
    }, [res]);

    return (
        <Section>
            {
                showAdd &&
                <CardAdd isSubmitting={isSubmitting} onSubmit={submit} onClick={() => setShowAdd(false)} title={isEdit ? "تعديل نوع" : "إضافة نوع"}>
                        <Input isError={error?.name} onChange={(e) => setName(e.target.value)} defaultValue={name} type={"text"} name={"name"} label={"الاسم"} placeholder={"اكتب اسم النوع"} />
                        {
                            error?.name && <Error message={error?.name._errors.join()} />
                        }
                        <Input isError={errorSlug} onChange={(e) => setSlug(e.target.value)} defaultValue={slug} type={"text"} name={"slug"} label={"المرجع"} placeholder={"اكتب المرجع (رقم)"} />
                        {
                            errorSlug && <Error message={"رجاء اكتب المرجع (رقم)"} />
                        }
                </CardAdd>
            }
            <div className={"flex items-center justify-between gap-4"}>
                <PageTitle title={"الأنواع"} />
                <Button onClick={() => setShowAdd(true)} title={"إضافة نوع"}/>
            </div>
            {
                status === "success" &&
                <Table th={["الاسم", "المرجع", "الطلاب", "خيارات"]}>
                    {
                        types.map((type, index) =>
                            <Tr key={index} className={"p-2 even:border-y border-dashed"}>
                                <Td value={type.name}/>
                                <Td value={type.slug}/>
                                <Td value={0}/>
                                <Td value={
                                    <div className={"flex justify-center items-center gap-3"}>
                                        <EditIcon onClick={ async () => {
                                            setCurrentId(type.id)
                                            setShowAdd(true)
                                            setName(type.name)
                                            setSlug(type.slug)
                                            setIsEdit(true)
                                        }} isLoading={isSubmitting} currentId={currentId} itemId={type.id} />
                                        <DeleteIcon onClick={ async () => {
                                            setCurrentId(type.id)
                                            const formData = new FormData();
                                            formData.append("id", type.id)
                                            formData.append("action", "delete")
                                            await fetcher.submit(formData, {
                                                method: "DELETE",
                                            });
                                        }} isLoading={isSubmitting} currentId={currentId} itemId={type.id} />
                                    </div>
                                }/>
                            </Tr>
                        )
                    }
                </Table>
            }
            { status === "error" && <Nothing title={"عفوا 😔"} desc={"المعذرة منك، لم نتمكن من العثور على سنوات، يرجى إضافة سنوات جديدة لعرضها. (:"} /> }
        </Section>
    )
}

export async function action({ request }) {
    const user = await getUserAuthenticated(request)
    const {name, slug, action, id} = Object.fromEntries(await request.formData());
    if(user && user.role === "ADMIN"){
        switch (action) {
            case "create": {
                return json( await CreateResultSettings({name, slug, model: "type"}));
            }
            case "edit": {
                return json( await updateResultSettings({id, name, slug, model: "type"}));
            }
            case "delete": {
                return json( await deleteType(id));
            }
        }
    } else {
        return redirect("/")
    }
}