import {useEffect, useState} from "react";
import SectionAuth from "../components/auth/SectionAuth.jsx";
import {json, useActionData, useFetcher, useNavigate} from "@remix-run/react";
import {authRegister} from "../controllers/Auth.server.js";
import Validate from "../helpers/Validate.js";
import {globalResponse} from "../helpers/SendResponse.server.js";
import {toastActions} from "../redux/slices/toastSlice.js";
import {useDispatch} from "react-redux";
import Input from "../components/Input.jsx";
import Error from "../components/Error.jsx";
import {generatePageTitle} from "../helpers/Global.js";

export const action = async ({request}) => {
    const {name, email, password} = Object.fromEntries(await request.formData());
    return json(await authRegister({name, email, password}))
}

export const meta = ({ matches }) => {
    return generatePageTitle({matches, current: "تسجيل حساب جديد 🔒"});
};
export default function Register() {
    const register = useFetcher()
    const dispatch = useDispatch()
    const res = register.data
    const navigate = useNavigate();
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState({})
    const onSubmit = (e) => {
        e.preventDefault()
        const validate =  Validate.register.safeParse({ name, email, password })
        if(validate.success){
            setError({})
            const formData = new FormData();
            formData.append("name", name)
            formData.append("email", email)
            formData.append("password", password)
            register.submit(formData, {
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

                setTimeout(() => {
                    navigate("/auth/login")
                }, 2000)
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
            title={"تسجيل حساب جديد 🔒"}
            titleSubmit={"تسجيل الحساب"}
            isLoading={register.state === "submitting"}
            titleButton={"تسجيل الدخول"}
            hrefButton={"/auth/login"}
        >
            <Input
                name={"name"} label={"الاسم"}
                type={"name"}
                placeholder={"اسمك الكامل"}
                onChange={(e) => setName(e.target.value)}
                isError={error?.name}
            />
            {
                error?.name && <Error message={error?.name._errors.join()} />
            }
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