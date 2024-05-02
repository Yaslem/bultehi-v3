import { NavLink } from "@remix-run/react";

export default function NavData({ title, url }) {
    return (
        <li>
            <NavLink
                className={({ isActive }) =>
                    isActive ? "font-medium text-indigo-600" : "font-medium text-gray-700 hover:text-gray-600"
                 + " text-sm md:text-lg"}
                to={"/" + url}>
                {title}
            </NavLink>
        </li>
    )
}