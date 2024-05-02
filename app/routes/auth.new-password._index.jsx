import {toastActions} from "../redux/slices/toastSlice.js";
import {useEffect, useState} from "react";
import Validate from "../helpers/Validate.js";
import {useDispatch} from "react-redux";
import {json, useFetcher, useSearchParams} from "@remix-run/react";
import Input from "../components/Input.jsx";
import Error from "../components/Error.jsx";
import SectionAuth from "../components/auth/SectionAuth.jsx";
import {globalResponse} from "../helpers/SendResponse.server.js";
import {authNewPassword} from "../controllers/Auth.server.js";
import {generatePageTitle} from "../helpers/Global.js";

export const action = async ({request}) => {
    const {token, password} = Object.fromEntries(await request.formData());
    return json(await authNewPassword({password, token}))
}

export const meta = ({ matches }) => {
    return generatePageTitle({matches, current: "تعيين كلمة المرور 🔏"});
};
export default function NewPassword() {
    const newPassword = useFetcher()
    const dispatch = useDispatch()
    const res = newPassword.data
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token")
    const [password, setPassword] = useState("")
    const [error, setError] = useState({})
    const onSubmit = (e) => {
        e.preventDefault()
        if(!token){
            dispatch(toastActions.setIsShow(true))
            dispatch(toastActions.setStatus("error"))
            dispatch(toastActions.setMessage("رمز تأكيد الحساب مطلوب."))
            return;
        }
        const validate =  Validate.newPassword.safeParse({ password })
        if(validate.success){
            setError({})
            const formData = new FormData();
            formData.append("token", token)
            formData.append("password", password)
            newPassword.submit(formData, {
                method: "POST",
            });
        }else {
            setError(validate.error.format())
        }
    }

    useEffect(() => {
        if(res){
            if (res.status === "success") {
                dispatch(toastActions.setIsShow(true))
                dispatch(toastActions.setStatus(res?.status))
                dispatch(toastActions.setMessage(res?.message))
                setPassword("")

            }else {
                dispatch(toastActions.setIsShow(true))
                dispatch(toastActions.setStatus(res?.status))
                dispatch(toastActions.setMessage(res?.message))
                setError(res.data)
            }
        }
    }, [res]);

    return (
        <SectionAuth
            onSubmit={onSubmit}
            title={"تعيين كلمة المرور 🔏"}
            titleSubmit={"تعيين كملة المرور"}
            isLoading={newPassword.state === "submitting"}
            titleButton={"تسجيل الدخول"}
            hrefButton={"/auth/login"}
        >

            <Input
                name={"password"} label={"كلمة المرور"}
                type={"password"}
                placeholder={"⁕⁕⁕⁕⁕⁕⁕⁕"}
                onChange={(e) => setPassword(e.target.value)}
                isError={error?.password}
            />
            {
                error?.password && <Error message={error?.password._errors.join()} />
            }
        </SectionAuth>
    )
}