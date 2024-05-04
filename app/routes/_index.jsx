import { Link } from "@remix-run/react";
import {useEffect, useState} from "react";

export default function Index() {
    const [width, setWidth] = useState(0)
    useEffect(() => {
        document.addEventListener("resize", () => {
            setWidth(window.innerWidth)
        })

    }, []);
  return (
      <div className={"flex flex-col"}>
          <div className={"bg-purple-50 p-2 md:p-5 pb-10 justify-between flex-col-reverse md:flex-row gap-5 flex items-center"}>
              <div className={"flex w-2/3 flex-col gap-5"}>
                  <h2 className={"text-3xl md:text-6xl leading-[3rem] md:leading-[5rem] font-bold text-black/80"}>تعرف على <span className={"text-indigo-700 underline decoration-wavy underline-offset-8"}>بلتيهك</span> وبلتيهات أحبائك.. واصنع الفرحة!</h2>
                  <p className={"leading-8 font-medium text-black/70 text-sm"}>
                      <Link className={"text-indigo-700 hover:text-indigo-600"} to={"/"}>بلتيهي</Link> هو موقع يهتم بنشر
                      نتائج المسابقات الوطنية <strong>التعليمية</strong>، وهو موقع غير حكومي، والنتائج المعروضة عليه هي
                      نتائج رسمية، منشورة من طرف وزارة التعليم الأساسي.
                  </p>
              </div>
              <div className={"w-1/3 flex items-center justify-center overflow-hidden bg-amber-400/50 rounded-tl-[70%_60%] rounded-tr-[30%_40%] rounded-br-[30%_40%] rounded-bl-[30%_60%]"}>
                  <img className={""} src={"/uploads/global/home.png"}/>
              </div>

          </div>
          <div className={"-mt-4 border-t-2 bg-white rounded-t-[30px]"}>
              <div className={"grid grid-cols-2 md:grid-cols-3 p-5 justify-center gap-4"}>
                  <div className={"flex bg-white flex-col gap-2 p-2 shadow-md border rounded-lg"}>
                      <img className={"rounded-lg"} src={"/uploads/global/elementary.png"}/>
                      <h2 className={"text-xl text-center font-bold text-black/80"}>كنكور</h2>
                      <Link
                          className={"bg-indigo-700 text-white flex items-center justify-center p-2 rounded-lg hover:bg-indigo-600"}
                          to={"/elementary"}>عرض</Link>
                  </div>
                  <div className={"flex bg-white flex-col gap-2 p-2 shadow-md border rounded-lg"}>
                      <img className={"rounded-lg"} src={"/uploads/global/middle.png"}/>
                      <h2 className={"text-xl text-center font-bold text-black/80"}>ابريفه</h2>
                      <Link
                          className={"bg-indigo-700 text-white flex items-center justify-center p-2 rounded-lg hover:bg-indigo-600"}
                          to={"/middle"}>عرض</Link>
                  </div>
                  <div className={"flex bg-white flex-col gap-2 p-2 shadow-md border rounded-lg"}>
                      <img className={"rounded-lg"} src={"/uploads/global/high.png"}/>
                      <h2 className={"text-xl text-center font-bold text-black/80"}>بكالوريا</h2>
                      <Link
                          className={"bg-indigo-700 text-white flex items-center justify-center p-2 rounded-lg hover:bg-indigo-600"}
                          to={"/high"}>عرض</Link>
                  </div>
              </div>

          </div>
      </div>
  );
}
