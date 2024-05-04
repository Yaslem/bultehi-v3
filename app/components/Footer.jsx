import {Link, NavLink} from "@remix-run/react";
import { FaFacebookF } from "react-icons/fa";
import {FiLink} from "react-icons/fi";

export default function Footer(){
    return (
        <footer className={"flex flex-col gap-8 border bg-stone-100 py-2 px-4"}>
            <section className={"flex md:flex-row flex-col gap-4 justify-between items-center"}>
                <h1 className={"text-2xl font-bold text-gray-700"}>بلتيهي</h1>
                <div>
                    <ul className={"flex gap-4 text-gray-600 transition items-center list-none"}>
                        <NavLink
                            className={"relative text-sm hover:font-medium hover:text-indigo-600 transition ease-in-out hover:scale-110 duration-300"}
                            to={"/"}>
                            <li>بكالوريا</li>
                        </NavLink>
                        <NavLink className={"text-sm hover:font-medium hover:text-indigo-600 transition ease-in-out hover:scale-110 duration-300"} to={"/"}>
                            <li>ابرفيه</li>
                        </NavLink>
                        <NavLink className={"text-sm hover:font-medium hover:text-indigo-600 transition ease-in-out hover:scale-110 duration-300"} to={"/"}>
                            <li>كنكور</li>
                        </NavLink>
                    </ul>
                </div>
                <hr />
                <div className={"flex items-center text-gray-600 font-medium text-sm justify-center gap-2"}>
                    <p className={""}>بواسطة</p>
                    <Link className={"text-indigo-600"} target={"_blank"} to={"https://yeslem.dev"}>يسلم - YESLEM</Link>
                    <FiLink />
                </div>
                {/*<form className={"flex items-center gap-4"}>*/}
                {/*    <input*/}
                {/*        className={"p-2 border bg-white focus:ring-2 ring-indigo-500 outline-0 rounded-lg text-xs"}*/}
                {/*        placeholder={"بريدك الإلكتروني"}*/}
                {/*        type={"email"}/>*/}
                {/*    <button className={"flex items-center justify-center p-2 bg-indigo-700 hover:bg-indigo-600 text-white font-medium rounded-lg text-xs"}>اشتراك</button>*/}
                {/*</form>*/}
            </section>
            <section className={"flex items-center justify-between pb-4"}>
                <p className={"text-gray-700 font-medium text-sm"}>بلتيهي، جميع الحقوق محفوظة 1445 هـ</p>
                <div className={"flex items-center gap-4"}>
                    <Link target={"_blank"} to={"https://www.facebook.com/bultehi"}>
                        <span className={"flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 p-2"}>
                        <FaFacebookF className={"text-xl text-blue-600"} />
                    </span>
                    </Link>
                </div>
            </section>
        </footer>
    )
}