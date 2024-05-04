
import {json, useLoaderData} from "@remix-run/react";
import {generateIdFromParams} from "../helpers/Global.js";
import {Search, TopResults, TopStudent} from "../components/Results.jsx";
import {
    getCountyById, getResultStudent,
    getTopStudentsByCountyId,
} from "../controllers/public/Result.server.js";

export const loader = async ({params}) => {
    const resultId = generateIdFromParams(params.resultId)
    const countyId = generateIdFromParams(params.countyId)
    return json(({
        county: await getCountyById({countyId, url: "/high"}),
        results: await getTopStudentsByCountyId({countyId, resultId, url: "/high"})
    }))
}

export async function action({ request, params }) {
    const {action, target, value, page} = Object.fromEntries(await request.formData());
    switch (action) {
        case "search": {
            const resultId = generateIdFromParams(params.resultId)
            const countyId = generateIdFromParams(params.countyId)
            const searchBy = "county"
            const isTitle = true
            return json(await getResultStudent({page, resultId, target, value, isTitle, searchBy, searchById: countyId, url: "/high"}));
        }
        default:
            return json({})
    }

}

export default function HighResultsResultIdCounties_index() {
    const {county, results: {data}} = useLoaderData()
    return (
        <>
            <Search isTitle={true} currentData={county} />
            <TopResults title={`العشرة الأول في مقاطعة ${county.name}`}>
                {
                    data.map((result, index) =>
                        <TopStudent key={index} type={result.type} result={result} index={index} />
                    )
                }
            </TopResults>
        </>
    )
}