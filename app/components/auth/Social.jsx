import {FaGoogle} from "react-icons/fa";
import {BsFacebook} from "react-icons/bs";
import {signIn} from "next-auth/react";
import {DEFAULT_LOGIN_REDIRECT} from "../../../routes";

export default function Social() {

    const onClick = async (provider) => {
        await signIn(provider, {
            callbackUrl: DEFAULT_LOGIN_REDIRECT
        })
    }

    return (
        <section className={"flex items-start gap-3"}>
            <div onClick={() => onClick("google")} className={"p-2 w-full bg-white cursor-pointer hover:border-indigo-600 rounded-lg border border-dashed items-center flex flex-col gap-2"}>
                <FaGoogle className={"text-2xl text-slate-600"} />
                <span className={"text-xs font-medium text-slate-500"}>جوجل</span>
            </div>
            <div onClick={() => onClick("facebook")} className={"p-2 w-full bg-white cursor-pointer hover:border-indigo-600 rounded-lg border border-dashed items-center flex flex-col gap-2"}>
                <BsFacebook className={"text-2xl text-slate-600"} />
                <span className={"text-xs font-medium text-slate-500"}>فيسبوك</span>
            </div>
        </section>
    )
}