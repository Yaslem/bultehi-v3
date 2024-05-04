import {json, Link, useLoaderData} from "@remix-run/react";
import {getPublicAllResults} from "../controllers/public/Result.server.js";
import Section from "../components/Section.jsx";
import Table, {Td, Tr} from "../components/Table.jsx";
import {generatePageTitle, generateSlug, getNumberFormat} from "../helpers/Global.js";
import Nothing from "../components/Nothing.jsx";
import {PageControlButtons} from "../components/PageControlButtons.jsx";

export const loader = async () => {
    return json({
        results: await getPublicAllResults({slug: "5", byCategory: "high"}),
        TITLE_HIGH: process.env.TITLE_HIGH,
    })
}

export const meta = ({ matches, data }) => {
    return generatePageTitle({matches, current: data.TITLE_HIGH});
};

export const handle =  {
    breadcrumb: () => <Link className={"text-indigo-700 hover:text-indigo-600"} to="/high">مسابقة ختم الدروس الثانوية</Link>,
};

export default function HighResults_index() {
    const {results: {status, data: results}, TITLE_HIGH} = useLoaderData();
    return (
        <Section>
            <PageControlButtons isControl={false} title={TITLE_HIGH} />
            {
                status === "success" &&
                <Table th={["العنوان", "السنة", "النوع", "الناجحون", "الراسبون",  "الدورة", "الإجمالي"]}>
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
                                <Td value={getNumberFormat(result.counts.sessionnaire)} />
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