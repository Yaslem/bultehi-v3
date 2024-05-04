
import { getResultStudent, getTopStudentsByResultId} from "../controllers/public/Result.server.js";
import {json, useLoaderData} from "@remix-run/react";
import {generateIdFromParams} from "../helpers/Global.js";
import {Search, TopResults, TopStudent} from "../components/Results.jsx";

export const loader = async ({params}) => {
    const resultId = generateIdFromParams(params.resultId)
    return json(await getTopStudentsByResultId(resultId, "/high"))
}


export default function HighResultsResultId() {
    const {data} = useLoaderData();
    return (
        <>
            <Search />
            <TopResults title={"الأوائل من كل شعبة"}>
                {
                    data.map((result, index) =>
                        <TopStudent key={index} type={result[0].type} result={result[0]} index={index} />
                    )
                }
            </TopResults>
        </>
    )
}

export async function action({ request, params }) {
    const {action, target, value, page} = Object.fromEntries(await request.formData());
    switch (action) {
        case "search": {
            const resultId = generateIdFromParams(params.resultId)
            const isTitle = false
            return json(await getResultStudent({page, resultId, target, value, isTitle, url: "/high/results"}));
        }
        default:
            return json({})
    }

}