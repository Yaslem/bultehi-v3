import classNames from "classnames";
export default function Select(
    {
        label,
        labelForOption = "اختر",
        name,
        onChange,
        children,
        defaultValue,
        isError = false,
        error = null
    }){

    return (
        <div className={"flex w-full flex-col gap-2"}>
            {
                label && <label htmlFor={name} className={"text-xs font-medium text-slate-600"}>{label}</label>
            }
            <select
                className={classNames({
                    "bg-stone-50 w-full p-2 text-xs font-medium outline-0 focus:ring-2 focus:ring-indigo-600 border rounded-lg text-slate-600": true,
                    "placeholder:text-red-500 focus:border-0 focus:ring-red-500 border-red-500": isError
                })}
                id={name}
                defaultValue={defaultValue}
                name={name}
                autoComplete={name}
                onChange={onChange}>
                <Option key={0} value={""} isDisabled={true} isSelected={true} title={labelForOption} />
                { children }
            </select>
            { error }
        </div>
    )
}

export function Option({key, isSelected, isDisabled = false, value, title}) {
    return (
        <option key={key} disabled={isDisabled} selected={isSelected} value={value}>{title}</option>
    )
}