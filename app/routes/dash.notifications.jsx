import Section from "../components/Section.jsx";
import Button from "../components/Button.jsx";
import Input, {TextArea} from "../components/Input.jsx";
import {json, useFetcher, useLoaderData} from "@remix-run/react";
import Notification from "../controllers/Notification.server.js";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {toastActions} from "../redux/slices/toastSlice.js";
import Table, {Td, Tr} from "../components/Table.jsx";
import { getDateForHuman} from "../helpers/Global.js";
import {DeleteIcon, EditIcon, Switch} from "../components/ActionsIcon.jsx";
import Nothing from "../components/Nothing.jsx";
import Validate from "../helpers/Validate.js";
import CardAdd from "../components/dash/CardAdd.jsx";
import Error from "../components/Error";
import {PageTitle} from "../components/PageControlButtons.jsx";
import {getUserAuthenticated} from "../services/auth.server.js";
import {redirect} from "@remix-run/node";

export const loader = async () => {
    return json(await Notification.getNotifications());
};

export async function action({ request }) {
    let {action, status, body, title, id} = Object.fromEntries(await request.formData());
    status = status === "true"
    const user = await getUserAuthenticated(request)
    if(user && user.role === "ADMIN"){
        switch (action) {
            case "create": {
                return json( await Notification.createNotification({title, body}));
            }
            case "edit": {
                return json( await Notification.updateNotification({title, id, body}));
            }
            case "updatePublished": {
                return json( await Notification.updateStatusNotification({id, status}));
            }
            case "delete": {
                return json( await Notification.deleteNotification({id}));
            }
        }
    } else {
        return redirect("/")
    }

}

export default function NotificationsUI() {
    const notifications = useLoaderData();

    const [showAdd, setShowAdd] = useState(false)
    const dispatch = useDispatch()

    const fetcher = useFetcher();
    const res = fetcher.data
    const isSubmitting = fetcher.state === "submitting";

    const [title, setTitle] = useState()
    const [body, setBody] = useState()

    const [currentId, setCurrentId] = useState("")
    const [action, setAction] = useState("")
    const [isEdit, setIsEdit] = useState(false)

    const [error, setError] = useState({})

    useEffect(() => {
        if(res){
            dispatch(toastActions.setIsShow(true))
            dispatch(toastActions.setStatus(res?.status))
            dispatch(toastActions.setMessage(res?.message))
            if(res?.status === "success"){
                setShowAdd(false)
                setTitle(undefined)
                setBody(undefined)
            }else {
                setError(res?.data)
            }
        }
    }, [res]);


    const handelCreate = async (e) => {
        e.preventDefault()
        dispatch(toastActions.setIsShow(false))

        const validated = Validate.createNotification.safeParse({title, body})

        if(validated.success){
            setError({})
            const formData = new FormData()
            formData.append("action", "create")
            formData.append("title", title)
            formData.append("body", body)
            await fetcher.submit(formData, {
                method: "POST",
            });
        }else {
            setError(validated.error.format())
        }
    }

    const handelUpdate = async (e) => {
        e.preventDefault()
        dispatch(toastActions.setIsShow(false))

        const validated = Validate.createNotification.safeParse({title, body})

        if(validated.success){
            setError({})
            const formData = new FormData()
            formData.append("action", "edit")
            formData.append("id", currentId)
            formData.append("title", title)
            formData.append("body", body)
            await fetcher.submit(formData, {
                method: "PUT",
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
                    onClick={() => {
                        setShowAdd(false)
                        setIsEdit(false)
                        setTitle(undefined)
                        setBody(undefined)
                    }}
                    title={isEdit ? "تعديل الإشعار" : "إضافة إشعار"}
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
                            placeholder={"اكتب عنوان الإشعار"} />
                        {
                            error?.title && <Error message={error?.title._errors.join()} />
                        }
                    <TextArea
                        onChange={(e) => setBody(e.target.value)}
                        isError={error?.body}
                        defaultValue={body}
                        name={"body"}
                        label={"المحتوى"}
                        placeholder={"اكتب محتوى الإشعار"} />
                    {
                        error?.body && <Error message={error?.body._errors.join()} />
                    }
                </CardAdd>
            }
            <div className={"flex items-center justify-between gap-3"}>
                <PageTitle title={"الإشعارات"}/>
                <div className={"flex items-center gap-3"}>
                    <Button onClick={() => {
                        setShowAdd(true)
                    }} title={"إضافة إشعار"}/>
                </div>
            </div>
            {
                notifications.status === "success" &&
                <Table
                    th={["العنوان", "الحالة", "الإنشاء", "تحديث", "خيارات"]}>
                    {
                        notifications.data.map((notification, index) =>
                            <Tr key={index}>
                                <Td value={notification.title}/>
                                <Td value={
                                    <Switch name={notification.title} value={notification.id} checked={notification.isPublished}
                                            onChange={async (e) => {
                                                const formData = new FormData();
                                                formData.append("id", notification.id)
                                                formData.append("status", e.target.checked)
                                                formData.append("action", "updatePublished")
                                                await fetcher.submit(formData, {
                                                    method: "PATCH",
                                                });
                                            }}/>
                                }/>
                                <Td value={getDateForHuman(notification.createdAt, false)}/>
                                <Td value={getDateForHuman(notification.updatedAt, false)}/>
                                <Td value={
                                    <div className={"flex items-center justify-center gap-3"}>
                                        <EditIcon onClick={ async () => {
                                            setCurrentId(notification.id)
                                            setAction("edit")
                                            setShowAdd(true)
                                            setTitle(notification.title)
                                            setBody(notification.body)
                                            setIsEdit(true)

                                        }} isLoading={isSubmitting} itemId={notification.id} action={action} currentId={currentId} />
                                        <DeleteIcon onClick={ async () => {
                                            setCurrentId(notification.id)
                                            setAction("delete")
                                            dispatch(toastActions.setIsShow(false))

                                            const formData = new FormData();
                                            formData.append("id", notification.id)
                                            formData.append("action", "delete")
                                            await fetcher.submit(formData, {
                                                method: "DELETE",
                                            });

                                        }} isLoading={isSubmitting} action={action} currentId={currentId} itemId={notification.id} />
                                    </div>
                                } />
                            </Tr>
                        )
                    }
                </Table>
            }
            {notifications.status === "error" && <Nothing title={"عفوا 😔"} desc={"المعذرة منك، لم نتمكن من العثور على إشعارات، يرجى إضافة إشعار جديد لعرضه. (:"}/>}
        </Section>
    )
}
