"use client";

import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => { console.error(error); }, [error]);
  return <main className="state-page" role="alert">
    <p className="overline">Ahamed.dev / CareerOS</p>
    <h1>That route hit a <em>temporary snag.</em></h1>
    <p>The rest of the site is still available. Try this page again, or return to the public portfolio.</p>
    <div className="actions"><button className="button primary" type="button" onClick={reset}>Try again</button><a className="button" href="/">Return home</a></div>
  </main>;
}
