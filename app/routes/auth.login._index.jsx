import {useEffect, useState} from "react";
import SectionAuth from "../components/auth/SectionAuth.jsx";
import {json, useFetcher} from "@remix-run/react";
import {authLogin} from "../controllers/Auth.server.js";
import Validate from "../helpers/Validate.js";
import {globalResponse} from "../helpers/SendResponse.server.js";
import {toastActions} from "../redux/slices/toastSlice.js";
import {useDispatch} from "react-redux";
import Input from "../components/Input.jsx";
import Error from "../components/Error.jsx";
import {generatePageTitle} from "../helpers/Global.js";
export const action = async ({request}) => {
    const {email, password} = Object.fromEntries(await request.formData());
    return json(await authLogin({email, password, request}))
}

export const meta = ({ matches }) => {
    return generatePageTitle({matches, current: "تسجيل االدخول 🔒"});
};
export default function Login() {
    const login = useFetcher()
    const dispatch = useDispatch()
    const res = login.data
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState({})
    const onSubmit = (e) => {
        e.preventDefault()
        const validate =  Validate.login.safeParse({ email, password })
        if(validate.success){
            setError({})
            const formData = new FormData();
            formData.append("email", email)
            formData.append("password", password)
            login.submit(formData, {
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
                setEmail("")
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
            title={"تسجيل االدخول 🔒"}
            titleSubmit={"دخول"}
            isLoading={login.state === "submitting"}
            titleButton={"تسجيل حساب جديد"}
            hrefButton={"/auth/register"}
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