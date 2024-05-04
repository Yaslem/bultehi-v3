
import {json, useFetcher, useLoaderData, useNavigation, useRevalidator} from "@remix-run/react";
import {generateIdFromParams, generatePageTitle} from "../helpers/Global.js";
import {SectionCard} from "../components/Results.jsx";
import {
    getTypesByResultId,
    searchTypes
} from "../controllers/public/Result.server.js";
import Nothing from "../components/Nothing.jsx";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import Section from "../components/Section.jsx";
import {typesActions} from "../redux/slices/typesSlice.js";

export const loader = async ({request, params}) => {
    const url = new URL(request.url);
    const sort = url.searchParams.get("sort") || "desc";
    const resultId = generateIdFromParams(params.resultId)
    return json(await getTypesByResultId({resultId, sort, url: "/high"}))
}

export const meta = ({ matches }) => {
    return generatePageTitle({matches, current: "الشعب"});
};

export async function action({ request, params }) {
    const resultId = generateIdFromParams(params.resultId)
    const url = new URL(request.url);
    const sort = url.searchParams.get("sort") || "desc";
    const {action, value} = Object.fromEntries(await request.formData());
    switch (action) {
        case "search": {
            return json(await searchTypes({resultId, value, sort, url: "/high"}));
        }
        default:
            return json({});
    }

}

export default function HighResultsResultIdCounties_index() {
    let {data, status} = useLoaderData()
    const types = useSelector(state => state.types.data)
    const navigation = useNavigation();
    const search = useFetcher({ key: "search" })
    const res = search.data
    const revalidator = useRevalidator();
    const dispatch = useDispatch()

    useEffect(() => {
        if(revalidator.state === "loading" || navigation.state === "loading"){
            dispatch(typesActions.setTypes(data))
        }
    }, [revalidator.state, navigation.state]);

    useEffect(() => {
        if(res){
            if(res.data){
                dispatch(typesActions.setTypes(res.data))
            }
        } else {
            dispatch(typesActions.setTypes(data))
        }
        
    }, [res]);


    return (
        <>
            {
                status === "success"
                    ? <>
                        <SectionCard isControl={true} isType={true} title={"الشعب"} isState={false} data={types} />
                    </>
                    : <Nothing title={"عفوا 😔"} desc={"المعذرة منك، لم نتمكن من العثور على شعب. (:"}/>
            }
        </>
    )
}