import LinkBtn from "./Link";
import {FaUserCog, FaUserTie} from "react-icons/fa";
import {Link, useFetcher} from "@remix-run/react";
import {IoSettingsSharp} from "react-icons/io5";
import {HiOutlineLogout} from "react-icons/hi";
import {useState} from "react";
import {useDispatch} from "react-redux";
import {toastActions} from "../redux/slices/toastSlice.js";

export default function HeaderAuth( { user } ) {
    const logout = useFetcher()
    const dispatch = useDispatch()

    const [show, setShow] = useState(false)

    const links = [
        {
            title: "تسجيل الخروج",
            icon: <HiOutlineLogout className={"text-xl"}/>,
            href: "/"
        }
    ]

    const handel = async () => {
        const formData = new FormData()
        formData.append("action", "logout")
        logout.submit(formData, {
            method: "POST"
        })
    }

    return (
        <section>
            {
                !user && <LinkBtn link={"/auth/login"} title={"تسجيل الدخول"} />
            }
            {
                user &&
                <div className={"relative"}>
                    {
                        !user.image &&
                        <img onClick={() => setShow(!show)} title={user.name}
                             className={"cursor-pointer ring-2 ring-indigo-300 hover:ring-indigo-200 object-cover rounded-full w-10 h-10 border"}
                             src={"/uploads/global/default_logo.png"} alt={"صورة النستخدم"} width={30} height={30}/>
                    }
                    {
                        user.image &&
                        <img onClick={() => setShow(!show)} title={user.name}
                             className={"cursor-pointer ring-2 ring-indigo-300 hover:ring-indigo-200 object-cover rounded-full w-10 h-10 border"} src={user?.image} alt={"صورة النستخدم"} width={30} height={30} />
                    }
                    {
                        show &&
                        <ul className={"p-2 w-36 z-[9999] absolute left-0 top-12 bg-white shadow-md rounded-lg flex flex-col gap-2 border rounded-tl-[0px] rounded-tr-[0px]"}>
                            {
                                links.map((link, index) =>
                                    <>
                                        {
                                            index === links.length - 1
                                                ? <li onClick={() => handel()} className={"flex cursor-pointer items-center gap-3 text-sm font-medium text-slate-600 hover:text-indigo-600"}>
                                                    { link.icon }
                                                    <span className={"text-xs"}>{ link.title }</span>
                                                </li>
                                                : <Link key={index} to={link.href}>
                                                    <li className={"flex items-center gap-3 text-sm font-medium text-slate-600 hover:text-indigo-600"}>
                                                        { link.icon }
                                                        <span className={"text-xs"}>{ link.title }</span>
                                                    </li>
                                                </Link>
                                        }
                                        {
                                            index !== links.length -1 && <hr className={"border h-0 border-dashed"} />
                                        }
                                    </>
                                )
                            }
                        </ul>
                    }
                </div>
            }
        </section>
    )
}