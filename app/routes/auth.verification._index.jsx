import {json, Link, useFetcher, useSearchParams} from "@remix-run/react";
import {useDispatch} from "react-redux";
import {toastActions} from "../redux/slices/toastSlice.js";
import {useCallback, useEffect, useState} from "react";
import {globalResponse} from "../helpers/SendResponse.server.js";
import {authVerification} from "../controllers/Auth.server.js";
import Error from "../components/Error.jsx";
import {TbProgress} from "react-icons/tb";
import {generatePageTitle} from "../helpers/Global.js";

export const action = async ({request}) => {
    const {token} = Object.fromEntries(await request.formData());
    return json(await authVerification(token))
}

export const meta = ({ matches }) => {
    return generatePageTitle({matches, current: "تأكيد حسابك 🔏"});
};

export default function Verification() {
    const verification = useFetcher()
    const dispatch = useDispatch()
    const res = verification.data
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token")
    const [message, setMessage] = useState("")

    const handel = useCallback( async () => {
        if(!token){
            setMessage("رمز تأكيد الحساب مطلوب.")
            return;
        }
        const formData = new FormData();
        formData.append("token", token)
        verification.submit(formData, {
            method: "POST",
        });

    }, [token])

    useEffect(() => {
        if(res){
            if (res.status === "success") {
                dispatch(toastActions.setIsShow(true))
                dispatch(toastActions.setStatus(res?.status))
                dispatch(toastActions.setMessage(res?.message))

            }else {
                dispatch(toastActions.setIsShow(true))
                dispatch(toastActions.setStatus(res?.status))
                dispatch(toastActions.setMessage(res?.message))
                setMessage(res.data)
            }
        }
    }, [res]);

    useEffect(  () => {
        handel()
    }, [token, handel])

    return (
        <section className={"w-[300px] mx-auto mb-5 mt-10 flex flex-col gap-4"}>
            <h1 className={"font-bold text-2xl text-slate-700 text-center"}>الدخول 🔏</h1>
            <div className={"bg-white rounded-lg p-2 border border-dashed flex flex-col gap-y-4"}>
                <p className={"text-xs text-center text-slate-600 font-medium"}>تأكيد حسابك</p>
                {
                    verification.state === "submitting" &&
                    <div className={"flex items-center justify-center w-full"}>
                        <TbProgress className={"text-4xl text-indigo-600 animate-spin"} />
                    </div>
                }

                {
                    message && <Error message={message}/>
                }
            </div>

            <Link
                className={"text-sm text-slate-500 flex items-center gap-2 justify-center font-medium text-center"}
                to={"/auth/login"}>الذهاب<span className={"text-indigo-700 hover:text-indigo-600 transition-all"}>لتسجيل الدخول</span>
            </Link>
        </section>
    )
}