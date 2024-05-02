import {json, useLoaderData} from "@remix-run/react";
import {getPublicResults} from "../controllers/public/Result.server.js";
import Results from "../components/Results.jsx";
import {Header} from "../components/Results.jsx";
import {FcLike} from "react-icons/fc";
import {FaRegComment} from "react-icons/fa";
import {TbFileDownload, TbLocationShare} from "react-icons/tb";
import {IoIosBookmark} from "react-icons/io";
import {AiOutlineLike} from "react-icons/ai";
import {MdChromeReaderMode} from "react-icons/md";

export const loader = async () => {
    return json({
        results: await getPublicResults("2"),
        title: process.env.TITLE_MIDDLE
    })
}

export default function High_index() {
    const {results: resultsProps, title} = useLoaderData();
    return (
        <section className={"flex flex-col mb-4 gap-y-12"}>
            <div className={"border-4 self-center rounded-lg border-dashed w-28"} />
            {
                resultsProps.status === "success" &&
                <>
                    <Results link={"/middle/results"} title={title} resultsProps={resultsProps}/>
                    <div className={"border-4 self-center rounded-lg border-dashed w-28"}/>
                </>
            }
            <div className={"flex flex-col px-4 gap-4"}>
                <Header title={"المقالات"} />
                <div className={"grid grid-cols-4 gap-4"}>
                    <div className={"flex flex-col gap-4 border rounded-lg p-2"}>
                        <div className={"flex gap-4"}>
                            <img className={"w-10 h-10 rounded-full object-cover"} width={40} height={40} src={"/files/images/1.jpg"} alt={""}/>
                            <div className={"flex flex-col gap-2"}>
                                <h2 className={"font-bold text-sm text-gray-600"}>يسلم أحمد ناجم</h2>
                                <span className={"text-xs font-medium text-gray-500"}>1445-12-20 | 2023-12-20</span>
                            </div>
                        </div>
                        <img className={"w-full self-center h-52 object-cover rounded-lg"} width={100} height={100} src={"/files/images/2.jpg"} alt={""}/>
                        <h1 className={"text-center mb-10 font-bold text-gray-700"}>عنان المقال</h1>
                        <hr />
                        <div className={"flex justify-between items-center"}>
                            <div className={"flex items-center gap-4"}>
                                <FcLike className={"text-xl text-gray-600 hover:text-gray-500 cursor-pointer"} />
                                <FaRegComment className={"text-xl text-gray-600 hover:text-gray-500 cursor-pointer"} />
                                <TbLocationShare className={"text-xl text-gray-600 hover:text-gray-500 cursor-pointer"} />
                            </div>
                            <IoIosBookmark className={"text-xl text-gray-600 hover:text-gray-500 cursor-pointer"}/>
                        </div>
                        <hr />
                        <div className={"flex items-center gap-3 text-xs text-gray-500 font-medium"}>
                            <span>29229 إعجابا</span>
                            <span className={"font-bold -mt-3 text-xl"}>.</span>
                            <span>292 تعليقا</span>
                        </div>
                    </div>
                    <div className={"flex flex-col gap-4 border rounded-lg p-2"}>
                        <div className={"flex gap-4"}>
                            <img className={"w-10 h-10 rounded-full object-cover"} width={40} height={40} src={"/files/images/1.jpg"} alt={""}/>
                            <div className={"flex flex-col gap-2"}>
                                <h2 className={"font-bold text-sm text-gray-600"}>يسلم أحمد ناجم</h2>
                                <span className={"text-xs font-medium text-gray-500"}>2023-12-20</span>
                            </div>
                        </div>
                        <img className={"w-full self-center h-52 object-cover rounded-lg"} width={100} height={100} src={"/files/images/2.jpg"} alt={""}/>
                        <h1 className={"text-center mb-10 font-bold text-gray-700"}>عنان المقال</h1>
                        <hr />
                        <div className={"flex justify-between items-center"}>
                            <div className={"flex items-center gap-4"}>
                                <FcLike className={"text-xl text-gray-600 hover:text-gray-500 cursor-pointer"} />
                                <FaRegComment className={"text-xl text-gray-600 hover:text-gray-500 cursor-pointer"} />
                                <TbLocationShare className={"text-xl text-gray-600 hover:text-gray-500 cursor-pointer"} />
                            </div>
                            <IoIosBookmark className={"text-xl text-gray-600 hover:text-gray-500 cursor-pointer"}/>
                        </div>
                        <hr />
                        <div className={"flex items-center gap-4 text-xs text-gray-500 font-medium"}>
                            <span>29229 إعجابا</span>
                            <span>292 تعليقا</span>
                        </div>
                    </div>
                    <div className={"flex flex-col gap-4 border rounded-lg p-2"}>
                        <div className={"flex gap-4"}>
                            <img className={"w-10 h-10 rounded-full object-cover"} width={40} height={40} src={"/files/images/1.jpg"} alt={""}/>
                            <div className={"flex flex-col gap-2"}>
                                <h2 className={"font-bold text-sm text-gray-600"}>يسلم أحمد ناجم</h2>
                                <span className={"text-xs font-medium text-gray-500"}>2023-12-20</span>
                            </div>
                        </div>
                        <img className={"w-full self-center h-52 object-cover rounded-lg"} width={100} height={100} src={"/files/images/2.jpg"} alt={""}/>
                        <h1 className={"text-center mb-10 font-bold text-gray-700"}>عنان المقال</h1>
                        <hr />
                        <div className={"flex justify-between items-center"}>
                            <div className={"flex items-center gap-4"}>
                                <FcLike className={"text-xl text-gray-600 hover:text-gray-500 cursor-pointer"} />
                                <FaRegComment className={"text-xl text-gray-600 hover:text-gray-500 cursor-pointer"} />
                                <TbLocationShare className={"text-xl text-gray-600 hover:text-gray-500 cursor-pointer"} />
                            </div>
                            <IoIosBookmark className={"text-xl text-gray-600 hover:text-gray-500 cursor-pointer"}/>
                        </div>
                        <hr />
                        <div className={"flex items-center gap-4 text-xs text-gray-500 font-medium"}>
                            <span>29229 إعجابا</span>
                            <span>292 تعليقا</span>
                        </div>
                    </div>
                    <div className={"flex flex-col gap-4 border rounded-lg p-2"}>
                        <div className={"flex gap-4"}>
                            <img className={"w-10 h-10 rounded-full object-cover"} width={40} height={40} src={"/files/images/1.jpg"} alt={""}/>
                            <div className={"flex flex-col gap-2"}>
                                <h2 className={"font-bold text-sm text-gray-600"}>يسلم أحمد ناجم</h2>
                                <span className={"text-xs font-medium text-gray-500"}>2023-12-20</span>
                            </div>
                        </div>
                        <img className={"w-full self-center h-52 object-cover rounded-lg"} width={100} height={100} src={"/files/images/2.jpg"} alt={""}/>
                        <h1 className={"text-center mb-10 font-bold text-gray-700"}>عنان المقال</h1>
                        <hr />
                        <div className={"flex justify-between items-center"}>
                            <div className={"flex items-center gap-4"}>
                                <FcLike className={"text-xl text-gray-600 hover:text-gray-500 cursor-pointer"} />
                                <FaRegComment className={"text-xl text-gray-600 hover:text-gray-500 cursor-pointer"} />
                                <TbLocationShare className={"text-xl text-gray-600 hover:text-gray-500 cursor-pointer"} />
                            </div>
                            <IoIosBookmark className={"text-xl text-gray-600 hover:text-gray-500 cursor-pointer"}/>
                        </div>
                        <hr />
                        <div className={"flex items-center gap-4 text-xs text-gray-500 font-medium"}>
                            <span>29229 إعجابا</span>
                            <span>292 تعليقا</span>
                        </div>
                    </div>
                    <div className={"flex flex-col gap-4 border rounded-lg p-2"}>
                        <div className={"flex gap-4"}>
                            <img className={"w-10 h-10 rounded-full object-cover"} width={40} height={40} src={"/files/images/1.jpg"} alt={""}/>
                            <div className={"flex flex-col gap-2"}>
                                <h2 className={"font-bold text-sm text-gray-600"}>يسلم أحمد ناجم</h2>
                                <span className={"text-xs font-medium text-gray-500"}>2023-12-20</span>
                            </div>
                        </div>
                        <img className={"w-full self-center h-52 object-cover rounded-lg"} width={100} height={100} src={"/files/images/2.jpg"} alt={""}/>
                        <h1 className={"text-center mb-10 font-bold text-gray-700"}>عنان المقال</h1>
                        <hr />
                        <div className={"flex justify-between items-center"}>
                            <div className={"flex items-center gap-4"}>
                                <FcLike className={"text-xl text-gray-600 hover:text-gray-500 cursor-pointer"} />
                                <FaRegComment className={"text-xl text-gray-600 hover:text-gray-500 cursor-pointer"} />
                                <TbLocationShare className={"text-xl text-gray-600 hover:text-gray-500 cursor-pointer"} />
                            </div>
                            <IoIosBookmark className={"text-xl text-gray-600 hover:text-gray-500 cursor-pointer"}/>
                        </div>
                        <hr />
                        <div className={"flex items-center gap-4 text-xs text-gray-500 font-medium"}>
                            <span>29229 إعجابا</span>
                            <span>292 تعليقا</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"border-4 self-center rounded-lg border-dashed w-28"} />
            <div className={"flex flex-col px-4 gap-4"}>
                <Header title={"الكتب المدرسية"} />
                <div className={"grid grid-cols-5 gap-4"}>
                    <div className={"bg-white rounded-lg border p-2 flex flex-col gap-4"}>
                        <img className={"w-fit self-center h-60 rounded-lg"} width={100} height={100} src={"/files/images/5.jpg"} alt={""}/>
                        <h1 className={"text-gray-600 text-xl font-bold text-center"}>عنوان الكتاب</h1>
                        <p className={"text-sm text-center font-medium text-gray-500"}>محمد يسلم الشنقيطي</p>
                        <span className={"font-bold text-sm text-indigo-500"}>343 أوقية</span>
                        <hr/>
                        <div className={"flex justify-between gap-2"}>
                            <span className={"p-2 flex justify-center items-center rounded-full w-10 h-10 cursor-pointer bg-yellow-50 border border-yellow-200"}>
                                <TbFileDownload className={"text-2xl text-yellow-700 hover:text-yellow-600"} />
                            </span>
                            <span className={"p-2 flex justify-center items-center rounded-full w-10 h-10 cursor-pointer bg-red-50 border border-red-200"}>
                                <AiOutlineLike className={"text-2xl text-red-700 hover:text-red-600"}  />
                            </span>
                            <span className={"p-2 flex justify-center items-center rounded-full w-10 h-10 cursor-pointer bg-green-50 border border-green-200"}>
                                <MdChromeReaderMode className={"text-2xl text-green-700 hover:text-green-600"}  />
                            </span>
                        </div>
                    </div>
                    <div className={"bg-white rounded-lg border p-2 flex flex-col gap-4"}>
                        <img className={"w-fit self-center h-60 rounded-lg"} width={100} height={100} src={"/files/images/5.jpg"} alt={""}/>
                        <h1 className={"text-gray-600 text-xl font-bold text-center"}>عنوان الكتاب</h1>
                        <p className={"text-sm text-center font-medium text-gray-500"}>محمد يسلم الشنقيطي</p>
                        <span className={"font-bold text-sm text-indigo-500"}>343 أوقية</span>
                        <hr/>
                        <div className={"flex justify-between gap-2"}>
                            <span className={"p-2 flex justify-center items-center rounded-full w-10 h-10 cursor-pointer bg-yellow-50 border border-yellow-200"}>
                                <TbFileDownload className={"text-2xl text-yellow-700 hover:text-yellow-600"} />
                            </span>
                            <span className={"p-2 flex justify-center items-center rounded-full w-10 h-10 cursor-pointer bg-red-50 border border-red-200"}>
                                <AiOutlineLike className={"text-2xl text-red-700 hover:text-red-600"}  />
                            </span>
                            <span className={"p-2 flex justify-center items-center rounded-full w-10 h-10 cursor-pointer bg-green-50 border border-green-200"}>
                                <MdChromeReaderMode className={"text-2xl text-green-700 hover:text-green-600"}  />
                            </span>
                        </div>
                    </div>
                    <div className={"bg-white rounded-lg border p-2 flex flex-col gap-4"}>
                        <img className={"w-fit self-center h-60 rounded-lg"} width={100} height={100} src={"/files/images/5.jpg"} alt={""}/>
                        <h1 className={"text-gray-600 text-xl font-bold text-center"}>عنوان الكتاب</h1>
                        <p className={"text-sm text-center font-medium text-gray-500"}>محمد يسلم الشنقيطي</p>
                        <span className={"font-bold text-sm text-indigo-500"}>343 أوقية</span>
                        <hr/>
                        <div className={"flex justify-between gap-2"}>
                            <span className={"p-2 flex justify-center items-center rounded-full w-10 h-10 cursor-pointer bg-yellow-50 border border-yellow-200"}>
                                <TbFileDownload className={"text-2xl text-yellow-700 hover:text-yellow-600"} />
                            </span>
                            <span className={"p-2 flex justify-center items-center rounded-full w-10 h-10 cursor-pointer bg-red-50 border border-red-200"}>
                                <AiOutlineLike className={"text-2xl text-red-700 hover:text-red-600"}  />
                            </span>
                            <span className={"p-2 flex justify-center items-center rounded-full w-10 h-10 cursor-pointer bg-green-50 border border-green-200"}>
                                <MdChromeReaderMode className={"text-2xl text-green-700 hover:text-green-600"}  />
                            </span>
                        </div>
                    </div>
                    <div className={"bg-white rounded-lg border p-2 flex flex-col gap-4"}>
                        <img className={"w-fit self-center h-60 rounded-lg"} width={100} height={100} src={"/files/images/5.jpg"} alt={""}/>
                        <h1 className={"text-gray-600 text-xl font-bold text-center"}>عنوان الكتاب</h1>
                        <p className={"text-sm text-center font-medium text-gray-500"}>محمد يسلم الشنقيطي</p>
                        <span className={"font-bold text-sm text-indigo-500"}>343 أوقية</span>
                        <hr/>
                        <div className={"flex justify-between gap-2"}>
                            <span className={"p-2 flex justify-center items-center rounded-full w-10 h-10 cursor-pointer bg-yellow-50 border border-yellow-200"}>
                                <TbFileDownload className={"text-2xl text-yellow-700 hover:text-yellow-600"} />
                            </span>
                            <span className={"p-2 flex justify-center items-center rounded-full w-10 h-10 cursor-pointer bg-red-50 border border-red-200"}>
                                <AiOutlineLike className={"text-2xl text-red-700 hover:text-red-600"}  />
                            </span>
                            <span className={"p-2 flex justify-center items-center rounded-full w-10 h-10 cursor-pointer bg-green-50 border border-green-200"}>
                                <MdChromeReaderMode className={"text-2xl text-green-700 hover:text-green-600"}  />
                            </span>
                        </div>
                    </div>
                    <div className={"bg-white rounded-lg border p-2 flex flex-col gap-4"}>
                        <img className={"w-fit self-center h-60 rounded-lg"} width={100} height={100} src={"/files/images/5.jpg"} alt={""}/>
                        <h1 className={"text-gray-600 text-xl font-bold text-center"}>عنوان الكتاب</h1>
                        <p className={"text-sm text-center font-medium text-gray-500"}>محمد يسلم الشنقيطي</p>
                        <span className={"font-bold text-sm text-indigo-500"}>343 أوقية</span>
                        <hr/>
                        <div className={"flex justify-between gap-2"}>
                            <span className={"p-2 flex justify-center items-center rounded-full w-10 h-10 cursor-pointer bg-yellow-50 border border-yellow-200"}>
                                <TbFileDownload className={"text-2xl text-yellow-700 hover:text-yellow-600"} />
                            </span>
                            <span className={"p-2 flex justify-center items-center rounded-full w-10 h-10 cursor-pointer bg-red-50 border border-red-200"}>
                                <AiOutlineLike className={"text-2xl text-red-700 hover:text-red-600"}  />
                            </span>
                            <span className={"p-2 flex justify-center items-center rounded-full w-10 h-10 cursor-pointer bg-green-50 border border-green-200"}>
                                <MdChromeReaderMode className={"text-2xl text-green-700 hover:text-green-600"}  />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"border-4 self-center rounded-lg border-dashed w-28"} />
        </section>
    )
}