import {json, useLoaderData} from "@remix-run/react";
import {generateIdFromParams, generatePageTitle} from "../helpers/Global.js";
import {getResultStudent, getStateById, getTopStudentsByStateId} from "../controllers/public/Result.server.js";
import {Search, TopResults, TopStudent} from "../components/Results.jsx";

export const loader = async ({params}) => {
    const resultId = generateIdFromParams(params.resultId)
    const stateId = generateIdFromParams(params.stateId)
    return json(({
        state: await getStateById({stateId, url: "/middle/results"}),
        results: await getTopStudentsByStateId({stateId, resultId, url: "/middle/results"})
    }))
}

export async function action({ request, params }) {
    const {action, target, value, page} = Object.fromEntries(await request.formData());
    switch (action) {
        case "search": {
            const resultId = generateIdFromParams(params.resultId)
            const stateId = generateIdFromParams(params.stateId)
            const searchBy = "state"
            const isTitle = true
            return json(await getResultStudent({page, resultId, target, value, isTitle, searchBy, searchById: stateId, url: "/middle/results"}));
        }
        default:
            return json({})
    }

}

export const meta = ({ matches, data }) => {
    return generatePageTitle({matches, current: data.state.name});
};

export default function MiddleResultsResultIdStatesStateId_index() {
    const {state, results: {data}} = useLoaderData()
    return (
        <>
            <Search isTitle={true} currentData={state} />
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