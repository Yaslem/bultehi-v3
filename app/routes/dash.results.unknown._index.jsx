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
    CreateResultSettings, deleteUnknown, getUnknown,
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
    return json(await getUnknown());
};

export const meta = ({ matches }) => {
    return generatePageTitle({matches, current: "القيمة المجهولة"});
};

export const handle = {
    breadcrumb: () => <Link className={"text-indigo-700 hover:text-indigo-600"} to="/dash/results/types">القيمة المجهولة</Link>,
};

export default function DashResultsUnknown_index() {
    const {status, data: unknown} = useLoaderData();
    const fetcher = useFetcher();
    const res = fetcher.data
    const dispatch = useDispatch()
    const [currentId, setCurrentId] = useState("")
    const [nameAr, setNameAr] = useState("")
    const [nameFr, setNameFr] = useState("")
    const isSubmitting = fetcher.state === "submitting";
    const [error, setError] = useState({})
    const [errorNameFr, setErrorNameFr] = useState(false)
    const [showAdd, setShowAdd] = useState(false)
    const [isEdit, setIsEdit] = useState(false)

    const submit = async (e) => {
        e.preventDefault()
        const validated =  ResultSettingsSchema.safeParse({ name: nameAr })
        if(validated.success){
            setError({})
            if(nameFr.length === 0){
                setErrorNameFr(true)
                return false;
            } else {
                setErrorNameFr(false)
                const formData = new FormData();
                formData.append("nameAr", nameAr)
                formData.append("nameFr", nameFr)
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
                setNameAr("")
                setNameFr("")
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
                <CardAdd isSubmitting={isSubmitting} onSubmit={submit} onClick={() => setShowAdd(false)} title={isEdit ? "تعديل قيمة مجهولة" : "إضافة قيمة مجهولة"}>
                        <Input isError={error?.name} onChange={(e) => setNameAr(e.target.value)} defaultValue={nameAr} type={"text"} name={"nameAr"} label={"الاسم بالعربية"} placeholder={"اكتب اسم القيمة المجهولة بالعربية"} />
                        {
                            error?.name && <Error message={error?.name._errors.join()} />
                        }
                        <Input isError={errorNameFr} onChange={(e) => setNameFr(e.target.value)} defaultValue={nameFr} type={"text"} name={"nameFr"} label={"الاسم بالإنجليزية"} placeholder={"اكتب اسم القيمة المجهولة بالإنجليزية"} />
                        {
                            errorNameFr && <Error message={"اكتب اسم المجهول بالإنجليزية"} />
                        }
                </CardAdd>
            }
            <div className={"flex items-center justify-between gap-4"}>
                <PageTitle title={"القيمة المجهولة"}/>
                {
                    status === "error" &&
                    <Button onClick={() => setShowAdd(true)} title={"إضافة قيمة مجهولة"}/>
                }
            </div>
            {
                status === "success" &&
                <Table th={["الاسم بالعربية", "الاسم بالإنجليزية", "الطلاب", "خيارات"]}>
                    {
                        unknown.map((unknownItem, index) =>
                            <Tr key={index} className={"p-2 even:border-y border-dashed"}>
                                <Td value={unknownItem.nameAr}/>
                                <Td value={unknownItem.nameFr}/>
                                <Td value={0}/>
                                <Td value={
                                    <div className={"flex justify-center items-center gap-3"}>
                                        <EditIcon onClick={ async () => {
                                            setCurrentId(unknownItem.id)
                                            setShowAdd(true)
                                            setNameAr(unknownItem.nameAr)
                                            setNameFr(unknownItem.nameFr)
                                            setIsEdit(true)
                                        }} isLoading={isSubmitting} currentId={currentId} itemId={unknownItem.id} />
                                        <DeleteIcon onClick={ async () => {
                                            setCurrentId(unknownItem.id)
                                            const formData = new FormData();
                                            formData.append("id", unknownItem.id)
                                            formData.append("action", "delete")
                                            await fetcher.submit(formData, {
                                                method: "DELETE",
                                            });
                                        }} isLoading={isSubmitting} currentId={currentId} itemId={unknownItem.id} />
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
    const {action, nameAr, nameFr, id} = Object.fromEntries(await request.formData());
    if(user && user.role === "ADMIN"){
        switch (action) {
            case "create": {
                return json( await CreateResultSettings({name: nameAr, nameFr, model: "unknown"}));
            }
            case "edit": {
                return json( await updateResultSettings({name: nameAr, nameFr, id, model: "unknown"}));
            }
            case "delete": {
                return json( await deleteUnknown(id));
            }
        }
    }else {
        return redirect("/")
    }

}