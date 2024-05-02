
const t = () => {
    return (
        <div className="flex flex-col">
            <div className="-m-1.5 overflow-x-auto">
                <div className="p-1.5 min-w-full inline-block align-middle">
                    <div className="border rounded-lg shadow overflow-hidden dark:border-gray-700 dark:shadow-gray-900">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                {
                                    th.map((t, i) =>
                                        <th key={i}
                                            scope="col"
                                            className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-gray-400">{t}</th>
                                    )
                                }
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {children}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function Table(
    {
        th,
        children,
        url
    }) {

    return (
        <div className="flex flex-col">
            <div className="-m-1.5 overflow-x-auto">
                <div className="p-1.5 min-w-full inline-block align-middle">
                    <div className="border rounded-lg overflow-hidden ">
                        <table className="min-w-full divide-y divide-gray-200 ">
                            <thead className="bg-gray-50">
                            <tr>
                                {
                                    th.map((t, i) =>
                                        <th key={i}
                                            className="px-6 py-3 text-center text-sm font-medium text-gray-600">{t}</th>
                                    )
                                }
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 ">
                            {children}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function Td(
    {
        value,
    }) {

    return (
        <td className={"p-3 text-nowrap text-sm text-slate-600 bg-white font-medium text-center"}>{value}</td>
    )
}

export function Tr(
    {
        children,
        key

    }) {

    return (
        <tr key={key} className={"p-2 even:border-y border-dashed text-xs text-gray-700 font-medium"}>{children}</tr>
    )
}