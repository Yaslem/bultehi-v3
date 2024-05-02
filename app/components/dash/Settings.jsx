import {useDispatch} from "react-redux";
import {useRef, useState} from "react";
import {toastActions} from "../../redux/slices/toastSlice.js";
import {ResultSettingsSchema} from "../../helpers/Schemas.js";
import Card from "./Card.jsx";
import Input from "../Input.jsx";
import Error from "../Error.jsx"
import {useFetcher, useSubmit} from "@remix-run/react";

export default function Settings({title, model, placeholder, data, status, message}) {
    const submit = useSubmit();
    const fetcher = useFetcher({ key: "add-result-settings" });
    const dispatch = useDispatch()
    const [name, setName] = useState("")
    const [nameFr, setNameFr] = useState("")
    const [slug, setSlug] = useState("")

    const formRef = useRef()
    const error = fetcher.data?.error
    const [errorSlug, setErrorSlug] = useState(false)
    const [errorNameFr, setErrorNameFr] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handel =  async (e) => {

        e.preventDefault()
        setIsLoading(true)
        dispatch(toastActions.setIsShow(false))
        const validated =  ResultSettingsSchema.safeParse({ name })
        if(validated.success) {
            setError({})
            if(model === "session" || model === "type"){
                if(slug.length === 0){
                    setErrorSlug(true)
                    setIsLoading(false)
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
            formData.append("name", name);
            formData.append("nameFr", nameFr);
            formData.append("model", model);
            formData.append("slug", slug);
            // setIsLoading(true)
            submit(formData, { method: "post" });
            // const { message, status, data } = await ResultSettings({name, nameFr, model, slug})
            // if(status === "success"){
            //     formRef.current.reset()
            //     setIsLoading(false)
            //     setErrorNameFr(false)
            //     setErrorSlug(false)
            //     dispatch(toastActions.setIsShow(true))
            //     dispatch(toastActions.setStatus(status))
            //     dispatch(toastActions.setMessage(message))
            // }else {
            //     dispatch(toastActions.setIsShow(true))
            //     dispatch(toastActions.setStatus(status))
            //     dispatch(toastActions.setMessage(message))
            //     setIsLoading(false)
            //     setError(data)
            // }
        } else {
            setIsLoading(false)
            setError(validated.error.format())
        }

    }
    return (
        <Card data={data} status={status} message={message} model={model} formRef={formRef} title={title} isLoading={isLoading} handel={handel}>
            {
                model === "year" &&
                <>
                    <Input
                        isError={error?.name}
                        type={"number"}
                        name={"name"}
                        placeholder={placeholder}
                    />
                    {
                        error?.name && error?.model === "year" && <Error message={error?.name._errors.join()} />
                    }
                </>
            }
            {
                model !== "year" &&
                <>
                    <Input
                        isError={error?.name}
                        type={"text"}
                        name={"name"}
                        placeholder={placeholder}
                    />
                    {
                        error?.name && error?.model === model === "type" ? "type" : model === "unknown" ? "unknown" : "session" && <Error message={error?.name._errors.join()} />
                    }
                    {
                        model === "unknown"
                            ? <>
                                <Input
                                    isError={errorNameFr}
                                    type={"text"}
                                    name={"nameFr"}
                                    placeholder={`اكتب الاسم بالإنكليزية`}
                                />
                                {
                                    errorNameFr && <Error message={`اكتب الاسم بالإنكليزية`} />
                                }
                            </>
                            : <Input
                                isError={errorSlug}
                                type={"text"}
                                name={"slug"}
                                placeholder={`اكتب الرقم المختصر ${model === "type" ? "للنوع" : "للدورة"}`}
                            />
                    }
                    {
                        errorSlug && <Error message={`رجاء اكتب الرقم المختصر ${model === "type" ? "للنوع" : "للدورة"}`} />
                    }
                </>
            }
        </Card>
    )
}