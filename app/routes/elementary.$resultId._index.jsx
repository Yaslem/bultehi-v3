
import {
    getDataForElementaryFilter,
    getPublicAllStatesByResultId,
    getTopStudentsByResultIdInElementaryAndInMiddle, searchNameStudent
} from "../controllers/public/Result.server.js";
import {json, useLoaderData} from "@remix-run/react";
import {generateIdFromParams} from "../helpers/Global.js";
import {Search, TopResults, TopStudent} from "../components/Results.jsx";
import {getResultById} from "../controllers/Result.server.js";

export const loader = async ({params}) => {
    const resultId = generateIdFromParams(params.resultId)
    const {data: result} =  await getResultById(resultId)
    return json({
        slug: result.type.slug,
        states: await getPublicAllStatesByResultId(resultId, "/elementary/results"),
        results: await getTopStudentsByResultIdInElementaryAndInMiddle(resultId, "/elementary/results")
    })
}


export default function ElementaryResultsResultId_index() {
    const {states, slug, results: {data}} = useLoaderData();
    console.log(slug)
    return (
        <>
            <Search slug={slug} statesData={{data: states.data, status: states.status}} />
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
    const resultId = generateIdFromParams(params.resultId)
    const {action, stateId, countyId, schoolId, by, value, centerId, page} = Object.fromEntries(await request.formData());
    switch (action) {
        case "search": {
            return json(await getDataForElementaryFilter({resultId, by, stateId, countyId, schoolId, centerId, page}));
        }
        case "searchName": {
            return json(await searchNameStudent({resultId, value, stateId, countyId, schoolId, centerId, page}));
        }
        default:
            return json({})
    }

}