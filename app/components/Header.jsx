import HeaderAuth from "./HeaderAuth";
import {useDispatch, useSelector} from "react-redux";
import NavData from "./navData";
import {Link, useLocation} from "@remix-run/react";
import {FiMenu} from "react-icons/fi";
import {sidebarActions} from "../redux/slices/sidebarSlice.js";

export default function Header ({SITE_TITLE, user}) {
    const dispatch = useDispatch()
    const pathname = useLocation().pathname
    const isOpen = useSelector(state => state.sidebar.isOpen)

    return (
        <section
            className={"flex bg-white border-b justify-between gap-4 py-2 px-4 items-center"}>
            <div className={"flex items-center gap-2"}>
                {
                    pathname.startsWith("/dash") && user
                        ? <button onClick={() => dispatch(sidebarActions.setIsOpen(!isOpen))}
                                  className={"p-2 lg:hidden flex items-center justify-center rounded-lg bg-stone-50 border"}>
                            <FiMenu className={"text-xl text-gray-600"}/>
                        </button>
                        : null
                }

                <Link to={"/"}>
                    <h1 className="text-2xl font-bold text-indigo-700 hover:text-indigo-600">{SITE_TITLE}</h1>
                </Link>
            </div>

            <nav>
                <ul className={"flex flex-wrap gap-x-4 transition items-center list-none"}>
                    <NavData title={"كنكور"} url={"elementary"} />
                    <NavData title={"ابريفه"} url={"middle"} />
                   <NavData title={"بكالوريا"} url={"high"} />
               </ul>
            </nav>
            {/* <div className={"flex gap-4 items-center"}>*/}
            {/*    <HeaderAuth user={user}/>*/}
            {/*</div>*/}
        </section>
    )
}