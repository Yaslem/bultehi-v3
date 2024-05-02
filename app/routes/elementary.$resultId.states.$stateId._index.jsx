import {json, useLoaderData} from "@remix-run/react";
import {generateIdFromParams, generatePageTitle} from "../helpers/Global.js";
import {
    getDataForElementaryFilter,
    getPublicAllCountiesByStateIdAndResultId,
    getStateById,
    getTopStudentsByStateId, searchNameStudent
} from "../controllers/public/Result.server.js";
import {Search, TopResults, TopStudent} from "../components/Results.jsx";
import {getResultById} from "../controllers/Result.server.js";

export const loader = async ({params}) => {
    const resultId = generateIdFromParams(params.resultId)
    const stateId = generateIdFromParams(params.stateId)
    const {data: result} =  await getResultById(resultId)
    return json(({
        slug: result.type.slug,
        state: await getStateById({stateId, url: "/elementary/results"}),
        counties: await getPublicAllCountiesByStateIdAndResultId({resultId, stateId, url: "/elementary/results"}),
        results: await getTopStudentsByStateId({stateId, resultId, url: "/elementary/results"})
    }))
}

export async function action({ request, params }) {
    const resultId = generateIdFromParams(params.resultId)
    const stateId = generateIdFromParams(params.stateId)
    const {action, countyId, schoolId, by, value, centerId, page} = Object.fromEntries(await request.formData());
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

export const meta = ({ matches, data }) => {
    return generatePageTitle({matches, current: data.state.name});
};

export default function MiddleResultsResultIdStatesStateId_index() {
    const {state, slug, counties, results: {data}} = useLoaderData()

    return (
        <>
            <Search currentPage={"state"} slug={slug} countiesData={{data: counties.data, status: counties.status}} isTitle={true} currentData={state} />
            <TopResults title={`العشرة الأول في ولاية ${state.name}`}>
                {
                    data.map((result, index) =>
                        <TopStudent key={index} result={result} index={index} />
                    )
                }
            </TopResults>
        </>
    )
}