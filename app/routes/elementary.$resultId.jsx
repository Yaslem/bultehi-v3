
import {getPublicExceptions, getResultById} from "../controllers/public/Result.server.js";
import {json, Outlet, useLoaderData} from "@remix-run/react";
import {generateIdFromParams, generatePageTitle} from "../helpers/Global.js";
import ResultsTop from "../components/ResultsTop.jsx";
import {exceptionActions} from "../redux/slices/exceptionSlice.js";
import {useEffect} from "react";
import {useDispatch} from "react-redux";

export const loader = async ({params}) => {
    const resultId = generateIdFromParams(params.resultId)
    return json({
        exceptions: await getPublicExceptions(),
        result: await getResultById({resultId, url: "/elementary/results"})
    })
}


export const meta = ({ matches, data }) => {
    return generatePageTitle({matches, current: data.result.title});
};

export default function ElementaryResultsResultId() {
    const {result, exceptions} = useLoaderData();
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(exceptionActions.setData(exceptions))
    }, []);
    return (
        <section className={"flex px-5 flex-col gap-3 mb-3"}>
            <ResultsTop url={"elementary"} type={result.type} session={result.session} year={result.year} />
            <hr />
            <Outlet/>
        </section>
    )
}