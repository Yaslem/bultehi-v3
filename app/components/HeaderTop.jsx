"use client"
import { HiOutlineMail } from "react-icons/hi";
import { FaWhatsapp } from "react-icons/fa";
import {Link} from "@remix-run/react";


export default function HeaderTop() {
    return (
        <section className="border-b flex justify-between py-2 px-4">
            <ul className={"flex gap-4 text-sm text-gray-600 font-medium list-none"}>
                <Link to={"/about"}>
                    <li className={"hover:text-indigo-600"}>من نحن؟</li>
                </Link>
            </ul>
            <ul className={"flex gap-4 text-sm text-gray-600 font-medium list-none"}>
                <li className={"flex gap-2 items-center"}>
                    <FaWhatsapp className={"text-xl text-green-500"} />
                    <span className={"hidden md:block"}>49474968</span>
                </li>
                <li className={"flex gap-2 items-center"}>
                    <HiOutlineMail className={"text-xl"} />
                    <span className={"hidden md:block"}>yeslem.alshanqyti@gmail.com</span>
                </li>
            </ul>
        </section>
    )
}