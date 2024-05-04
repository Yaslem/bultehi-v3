import {NavLink, useLocation} from "@remix-run/react";
import { GoHomeFill } from "react-icons/go";
import {BsPostcardHeartFill} from "react-icons/bs";
import {GiSpellBook} from "react-icons/gi";
import {FaUserGraduate, FaUsers} from "react-icons/fa";
import {IoSettingsSharp} from "react-icons/io5";
import classNames from 'classnames';
import {useSelector} from "react-redux";
import {IoIosNotifications} from "react-icons/io";
import {AiFillGold} from "react-icons/ai";

export default function Sidebar(){
    const pathname = useLocation().pathname
    const isOpen = useSelector(state => state.sidebar.isOpen)
    const links = [
        {
            title: "الرئيسية",
            icon: <GoHomeFill className={"text-2xl"} />,
            href: "/dash",
            isActive: function () {
                return  this.href === pathname
            }
        },
        {
            title: "النتائج",
            icon: <AiFillGold className={"text-2xl"} />,
            href: "/dash/results",
            isActive: function () {
                return  pathname.includes(this.href)
            }
        },
        {
            title: "الإشعارات",
            icon: <IoIosNotifications className={"text-2xl"} />,
            href: "/dash/notifications",
            isActive: function () {
                return  pathname.includes(this.href)
            }
        },
        // {
        //     title: "الرسائل",
        //     icon: <FaUsers className={"text-2xl"} />,
        //     href: "/dash/users",
        //     isActive: function () {
        //         return  pathname.includes(this.href)
        //     }
        // },
        // {
        //     title: "المستخدمون",
        //     icon: <FaUsers className={"text-2xl"} />,
        //     href: "/dash/users",
        //     isActive: function () {
        //         return  pathname.includes(this.href)
        //     }
        // }
    ]

    return (
        <aside className={classNames({
            "w-full lg:w-[15%] md:max-lg:w-[30%] h-full  z-50 absolute lg:relative top-0 right-0 lg:block lg:border-l bg-stone-50": true,
            "block": isOpen,
            "hidden": !isOpen,
        })}>
            <ul className={"flex flex-col gap-2"}>
                {
                    links.map((link, index) =>
                        <NavLink key={index} to={link.href}>
                            <li
                                className={classNames({
                                    "flex items-center gap-3 p-3 bg-white border": true,
                                    "text-indigo-700 text-base font-bold": link.isActive(),
                                    "text-slate-600 hover:text-indigo-700 font-medium text-sm": !link.isActive(),
                                })}
                            >
                                {link.icon}
                                <span>{link.title}</span>
                            </li>
                        </NavLink>
                    )
                }
            </ul>
        </aside>
    )
}