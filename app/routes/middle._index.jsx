import {json, Link, useLoaderData} from "@remix-run/react";
import {getPublicAllResults} from "../controllers/public/Result.server.js";
import Section from "../components/Section.jsx";
import Table, {Td, Tr} from "../components/Table.jsx";
import {generatePageTitle, generateSlug, getNumberFormat} from "../helpers/Global.js";
import Nothing from "../components/Nothing.jsx";
import {PageControlButtons} from "../components/PageControlButtons.jsx";

export const loader = async () => {
    return json({
        results: await getPublicAllResults({slug: "2", byCategory: "middle"}),
        TITLE_MIDDLE: process.env.TITLE_MIDDLE,
    })
}

export const meta = ({ matches, data }) => {
    return generatePageTitle({matches, current: data.TITLE_MIDDLE});
};

export const handle =  {
    breadcrumb: () => <Link className={"text-indigo-700 hover:text-indigo-600"} to="/middle/results">مسابقة ختم الدروس الإعدادية</Link>,
};

export default function Middle_index() {
    const {results: {status, data: results}, TITLE_MIDDLE} = useLoaderData();
    return (
        <Section>
            <PageControlButtons isControl={false} title={TITLE_MIDDLE} />
            {
                status === "success" &&
                <Table th={["العنوان", "السنة", "النوع", "الناجحون", "الراسبون", "الإجمالي"]}>
                    {
                        results.map((result, index) =>
                            <Tr key={index}>
                                <Td value={
                                    <Link to={generateSlug({slug: result.title, id: result.id})} className={"text-indigo-700 hover:text-indigo-600"}>{result.title}</Link>
                                } />
                                <Td value={result.year.name} />
                                <Td value={result.type.name} />
                                <Td value={getNumberFormat(result.counts.admis)} />
                                <Td value={getNumberFormat(result.counts.ajourne)} />
                                <Td value={getNumberFormat(result._count.results)} />
                            </Tr>
                        )
                    }
                </Table>
            }
            {status === "error" && <Nothing title={"عفوا 😔"} desc={"المعذرة منك، لم نتمكن من العثور على نتائج. (:"}/>}
        </Section>
    )
}