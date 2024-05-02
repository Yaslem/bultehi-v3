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
    CreateResultSettings,
    deleteYear,
    getYears,
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
    return json(await getYears());
};

export const meta = ({ matches }) => {
    return generatePageTitle({matches, current: "السنوات"});
};

export const handle = {
    breadcrumb: () => <Link className={"text-indigo-700 hover:text-indigo-600"} to="/dash/results/years">السنوات</Link>,
};
export default function DashResultsYears_index() {
    const {status, data: years} = useLoaderData();
    const fetcher = useFetcher();
    const res = fetcher.data
    const dispatch = useDispatch()
    const [currentId, setCurrentId] = useState("")
    const [name, setName] = useState("")
    const isSubmitting = fetcher.state === "submitting";
    const [error, setError] = useState({})
    const [showAdd, setShowAdd] = useState(false)
    const [isEdit, setIsEdit] = useState(false)

    const submit = async (e) => {
        e.preventDefault()
        const validated =  ResultSettingsSchema.safeParse({ name })
        if(validated.success){
            const formData = new FormData();
            formData.append("name", name)
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
                setName("")
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
                <CardAdd isSubmitting={isSubmitting} onSubmit={submit} onClick={() => setShowAdd(false)} title={isEdit ? "تعديل سنة" : "إضافة سنة"}>
                        <Input onChange={(e) => setName(e.target.value)} defaultValue={name} type={"text"} name={"name"} label={"الاسم"} placeholder={"اكتب اسم السنة"} />
                        {
                            error?.name && <Error message={error?.name._errors.join()} />
                        }
                </CardAdd>
            }
            <div className={"flex items-center justify-between gap-4"}>
                <PageTitle title={"السنوات"}/>
                <Button onClick={() => setShowAdd(true)} title={"إضافة سنة"}/>
            </div>
            {
                status === "success" &&
                <Table th={["الاسم", "الطلاب", "خيارات"]}>
                    {
                        years.map((year, index) =>
                            <Tr key={index} className={"p-2 even:border-y border-dashed"}>
                                <Td value={year.name}/>
                                <Td value={0}/>
                                <Td value={
                                    <div className={"flex justify-center items-center gap-3"}>
                                        <EditIcon onClick={ async () => {
                                            setCurrentId(year.id)
                                            setShowAdd(true)
                                            setName(year.name)
                                            setIsEdit(true)
                                        }} isLoading={isSubmitting} currentId={currentId} itemId={year.id} />
                                        <DeleteIcon onClick={ async () => {
                                            setCurrentId(year.id)
                                            const formData = new FormData();
                                            formData.append("id", year.id)
                                            formData.append("action", "delete")
                                            await fetcher.submit(formData, {
                                                method: "DELETE",
                                            });
                                        }} isLoading={isSubmitting} currentId={currentId} itemId={year.id} />
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
    const {name, action, id} = Object.fromEntries(await request.formData());
    if(user && user.role === "ADMIN"){
        switch (action) {
            case "create": {
                if(isNaN(name)) return json({data: {name: {_errors: ["السنة يجب أن تكون رقما."]}}, message: "السنة يجب أن تكون رقما."});
                return json( await CreateResultSettings({name, model: "year"}));
            }
            case "edit": {
                if(isNaN(name)) return json({data: {name: {_errors: ["السنة يجب أن تكون رقما."]}}, message: "السنة يجب أن تكون رقما."});
                return json( await updateResultSettings({id, name, model: "year"}));
            }
            case "delete": {
                return json( await deleteYear(id));
            }
        }
    } else {
        return redirect("/")
    }
}