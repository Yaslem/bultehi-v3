import { NavLink } from "@remix-run/react";

export default function NavData({ title, url }) {
    return (
        <li>
            <NavLink
                className={({ isActive }) =>
                    isActive ? "font-medium text-sm p-2 shadow-md bg-indigo-50 border rounded-lg md:text-base text-indigo-600" : "font-medium text-gray-700 hover:text-gray-600"
                 + " text-sm p-2 shadow-md bg-stone-50 border rounded-lg md:text-base"}
                to={"/" + url}>
                {title}
            </NavLink>
        </li>
    )
}