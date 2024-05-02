import Input from "../components/Input.jsx";
import Error from "../components/Error.jsx";
import SectionAuth from "../components/auth/SectionAuth.jsx";
import {json, useFetcher} from "@remix-run/react";
import {useDispatch} from "react-redux";
import {useEffect, useState} from "react";
import Validate from "../helpers/Validate.js";
import {toastActions} from "../redux/slices/toastSlice.js";
import {globalResponse} from "../helpers/SendResponse.server.js";
import {authReset} from "../controllers/Auth.server.js";
import {generatePageTitle} from "../helpers/Global.js";

export const action = async ({request}) => {
    const {email} = Object.fromEntries(await request.formData());
    return json(await authReset({email}))
}

export const meta = ({ matches }) => {
    return generatePageTitle({matches, current: "تغيير كلمة المرور 🔓"});
};

export default function Reset() {
    const reset = useFetcher()
    const dispatch = useDispatch()
    const res = reset.data
    const [email, setEmail] = useState("")
    const [error, setError] = useState({})
    const onSubmit = (e) => {
        e.preventDefault()
        const validate =  Validate.reset.safeParse({ email })
        if(validate.success){
            setError({})
            const formData = new FormData();
            formData.append("email", email)
            reset.submit(formData, {
                method: "POST",
            });
        }else {
            setError(validate.error.format())
        }
    }

    useEffect(() => {
        if(res){
            dispatch(toastActions.setIsShow(true))
            dispatch(toastActions.setStatus(res?.status))
            dispatch(toastActions.setMessage(res?.message))
            if (res.status === "success") {
                setEmail("")
            }else {
                setError(res.data)
            }
        }
    }, [res]);
    return (
        <SectionAuth
            onSubmit={onSubmit}
            title={"تغيير كلمة المرور 🔓"}
            titleSubmit={"إرسال الرابط"}
            isLoading={reset.state === "submitting"}
            titleButton={"تسجيل الدخول"}
            hrefButton={"/auth/login"}
            isSocial={false}
        >
            <Input
                name={"email"} label={"البريد الإلكتروني"}
                type={"email"}
                placeholder={"بريدك الإلكتروني"}
                onChange={(e) => setEmail(e.target.value)}
                isError={error?.email}
            />
            {
                error?.email && <Error message={error?.email._errors.join()} />
            }
        </SectionAuth>
    )
}