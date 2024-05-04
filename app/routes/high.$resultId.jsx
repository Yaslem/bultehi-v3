
import {getResultById} from "../controllers/public/Result.server.js";
import {json, Outlet, useLoaderData} from "@remix-run/react";
import {generateIdFromParams, generatePageTitle} from "../helpers/Global.js";
import ResultsTop from "../components/ResultsTop.jsx";

export const loader = async ({params}) => {
    const resultId = generateIdFromParams(params.resultId)
    return json(await getResultById({resultId, url: "/high"}))
}


export const meta = ({ matches, data }) => {
    return generatePageTitle({matches, current: data.title});
};

export default function HighResultsResultId() {
    const result = useLoaderData();
    return (
        <section className={"flex px-5 flex-col gap-3 mb-3"}>
            <ResultsTop url={"high"} type={result.type} session={result.session} year={result.year} />
            <hr />
            <Outlet/>
        </section>
    )
}