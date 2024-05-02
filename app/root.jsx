import { cssBundleHref } from "@remix-run/css-bundle";
import {
  json, Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration, useLoaderData,
} from "@remix-run/react";
import {Provider} from 'react-redux';
import store from './redux/store'
import stylesheet from "./globals.css";
import Header from "./components/Header";
import HeaderTop from "./components/HeaderTop";
import Footer from "./components/Footer";
import Global from "./components/Global";
import {globalResponse} from "./helpers/SendResponse.server";
import {getUserAuthenticated, logOut} from "./services/auth.server";
import middleware from "./services/middleware.server";
import Notify from "./components/Notify";
import {Progressbar} from "./components/Progressbar.jsx";
export const links = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: stylesheet },
];

export const loader = async ({request}) => {
  await middleware(request)
  return json(globalResponse({user: await getUserAuthenticated(request)}));
};

export const action = async ({request}) => {
  const {action} = Object.fromEntries(await request.formData())
  if(action === "logout"){
    await logOut(request)
  }
  return null;
}

export const handle = {
  breadcrumb: () => (
      <Link className={"text-indigo-700 hover:text-indigo-600"} to="/">الرئيسية</Link>
  ),
};

export const meta = ({data}) => {
  return [{
    title: `${data.SITE_TITLE}`,
    description: data.SITE_DESCRIPTION
  }];
};


export default function App() {
  const {SITE_TITLE, user} = useLoaderData();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className={"h-[calc(100vh-85.34px)]"}>
      <Provider store={store}>
        <div className={"bg-white"}>
          <HeaderTop/>
          <Header user={user} SITE_TITLE={SITE_TITLE}/>
          {/*<DropdownMenuDemo />*/}
        </div>
        <main className={"flex h-full flex-col"}>
          <Notify />
          <section className={"flex-grow bg-stone-50"}>
            <Outlet/>
          </section>
          <Footer/>
        </main>
        <Global />
        <ScrollRestoration/>
        <Scripts/>
        <LiveReload/>
        <Progressbar />
      </Provider>
      </body>
    </html>
  );
}
