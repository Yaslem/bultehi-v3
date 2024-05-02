"use client"
import classNames from "classnames";

export default function TextArea(
    {
        label,
        name,
        onChange,
        placeholder,
        defaultValue,
        isError = false,
    }
) {
    return (
        <div className={"flex flex-col gap-2"}>
            {
                label && <label htmlFor={name} className={"text-xs font-medium text-slate-600"}>{label}</label>
            }
            <textarea
                className={classNames({
                    "bg-white p-2 text-xs font-medium outline-0 focus:ring-2 h-20 min-h-10 focus:ring-indigo-600 border rounded-lg": true,
                    "placeholder:text-red-500 focus:border-0 focus:ring-red-500 border-red-500": isError,
                })}
                id={name}
                name={name}
                autoComplete={name}
                placeholder={placeholder}
                value={defaultValue}
                onChange={onChange}
            ></textarea>
        </div>
    )
}