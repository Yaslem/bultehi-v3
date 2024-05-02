import {FaChevronDown} from "react-icons/fa";
import {useMatches} from "@remix-run/react";

export default function Breadcrumbs() {
    const matches = useMatches();
    const matchesLength = matches
        .filter(
            (match) =>
                match.handle && match.handle.breadcrumb
        ).length
    return (
        <div className={"px-5 py-2"}>
            <ul className={"list-none overflow-x-auto scrollbar-hide flex-nowrap flex items-center gap-3 font-medium"}>
                {matches
                    .filter(
                        (match) =>
                            match.handle && match.handle.breadcrumb
                    )
                    .map((match, index) => (
                        <li key={index} className={"flex text-nowrap items-center gap-2"}>
                            {match.handle.breadcrumb(match)}
                            {
                                (matchesLength - 1) !== index &&
                                <span style={{rotate: "90deg"}}>
                                <FaChevronDown className={"text-sm text-slate-500"}/>
                            </span>
                            }
                        </li>

                    ))}

            </ul>
        </div>
    )
        ;
}