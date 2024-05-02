
import {
    getResultStudent,
    getTopStudentsByResultIdInElementaryAndInMiddle
} from "../controllers/public/Result.server.js";
import {json, useLoaderData} from "@remix-run/react";
import {generateIdFromParams} from "../helpers/Global.js";
import {Search, TopResults, TopStudent} from "../components/Results.jsx";

export const loader = async ({params}) => {
    const resultId = generateIdFromParams(params.resultId)
    return json(await getTopStudentsByResultIdInElementaryAndInMiddle(resultId, "/middle/results"))
}


export default function MiddleResultsResultId_index() {
    const {data} = useLoaderData();
    return (
        <>
            <Search />
            <TopResults title={"العشرة الأول"}>
                {
                    data.map((result, index) =>
                        <TopStudent key={index} result={result} index={index} />
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
            return json(await getResultStudent({page, resultId, target, value, isTitle, url: "/middle/results"}));
        }
        default:
            return json({})
    }

}