
import {json, useLoaderData} from "@remix-run/react";
import {generateIdFromParams, generatePageTitle} from "../helpers/Global.js";
import {Search, TopResults, TopStudent} from "../components/Results.jsx";
import {
    getCountyById, getResultStudent,
    getTopStudentsByCountyId,
} from "../controllers/public/Result.server.js";

export const loader = async ({params}) => {
    const resultId = generateIdFromParams(params.resultId)
    const countyId = generateIdFromParams(params.countyId)
    return json(({
        county: await getCountyById({countyId, url: "/middle/results"}),
        results: await getTopStudentsByCountyId({countyId, resultId, url: "/middle/results"})
    }))
}

export const meta = ({ matches, data }) => {
    return generatePageTitle({matches, current: data.county.name});
};

export async function action({ request, params }) {
    const {action, target, value, page} = Object.fromEntries(await request.formData());
    switch (action) {
        case "search": {
            const resultId = generateIdFromParams(params.resultId)
            const countyId = generateIdFromParams(params.countyId)
            const searchBy = "county"
            const isTitle = true
            return json(await getResultStudent({page, resultId, target, value, isTitle, searchBy, searchById: countyId, url: "/middle/results"}));
        }
        default:
            return json({})
    }

}

export default function MiddleResultsResultIdCountiesCountyId_index() {
    const {county, results: {data}} = useLoaderData()
    return (
        <>
            <Search isTitle={true} currentData={county} />
            <TopResults title={`العشرة الأول في مقاطعة ${county.name}`}>
                {
                    data.map((result, index) =>
                        <TopStudent key={index} result={result} index={index} />
                    )
                }
            </TopResults>
        </>
    )
}