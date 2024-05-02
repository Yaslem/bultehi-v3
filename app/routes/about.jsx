import {Link} from "@remix-run/react"
export default function About() {
    return (
        <div className={"flex flex-col bg-white border rounded-lg m-4 md:my-4 md:mx-auto gap-3 max-w-[400px] text-gray-600 text-justify p-4"}>
                <p className={"leading-8"}>
                    <Link className={"text-indigo-700 hover:text-indigo-600"} to={"/"}>بلتيهي</Link> هو موقع يهتم بنشر نتائج المسابقات الوطنية <strong>التعليمية</strong>، وهو موقع غير حكومي، والنتائج المعروضة عليه هي نتائج رسمية، منشورة من طرف وزارة التعليم الأساسي.
                </p>
                <p>وقد تم نشر الموقع بتارخ: 01-01-1444 هـ</p>
                <p>لاقتراحاتكم أو استفساراتكم: يرجى التواصل مع الرقم التالي (واتساب): 49474968</p>
        </div>
    )
}