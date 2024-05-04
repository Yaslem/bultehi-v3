
import {
    getStatesByResultId, searchStates
} from "../controllers/public/Result.server.js";
import {json, Link, useFetcher, useLoaderData, useNavigation, useRevalidator} from "@remix-run/react";
import {generateIdFromParams, generatePageTitle} from "../helpers/Global.js";
import {SectionCard} from "../components/Results.jsx";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {statesActions} from "../redux/slices/statesSlice.js";
import Nothing from "../components/Nothing.jsx";

export const loader = async ({params, request}) => {
    const url = new URL(request.url);
    const sort = url.searchParams.get("sort") || "desc";
    const resultId = generateIdFromParams(params.resultId)
    return json(await getStatesByResultId({sort, resultId, url: "/high"}))
}

export async function action({ request, params }) {
    const resultId = generateIdFromParams(params.resultId)
    const url = new URL(request.url);
    const sort = url.searchParams.get("sort") || "desc";
    const {action, value} = Object.fromEntries(await request.formData());
    switch (action) {
        case "search": {
            return json(await searchStates({resultId, value, sort, url: "/high"}));
        }
        default:
            return json({});
    }

}
export const meta = ({ matches }) => {
    return generatePageTitle({matches, current: "الولايات"});
};

export const handle =  {
    breadcrumb: () => <Link className={"text-indigo-700 hover:text-indigo-600"} to="/high/schools">الولايات</Link>,
};

export default function HighResultsResultIdStates_index() {
    const {data, status} = useLoaderData()
    const states = useSelector(state => state.states.data)
    const revalidator = useRevalidator();
    const navigation = useNavigation();
    const dispatch = useDispatch()
    const search = useFetcher({ key: "search" })
    const res = search.data

    useEffect(() => {
        if(revalidator.state === "loading" || navigation.state === "loading"){
            dispatch(statesActions.setStates(data))
        }
    }, [revalidator.state, navigation.state]);

    useEffect(() => {
        if(res){
            if(res.data){
                dispatch(statesActions.setStates(res.data))
            }
        } else {
            dispatch(statesActions.setStates(data))
        }

    }, [res]);


    return (
        <>
            {
                status === "success"
                    ? <SectionCard isControl={true} title={"الولايات"} isPagination={false} data={states} nameData={"states"} isAll={true} />
                    : <Nothing title={"عفوا 😔"} desc={"المعذرة منك، لم نتمكن من العثور على ولايات. (:"}/>
            }
        </>
    )
}