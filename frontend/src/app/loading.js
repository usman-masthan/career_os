export default function Loading() {
  return <main className="state-page" aria-busy="true" aria-live="polite">
    <p className="overline">Ahamed.dev / CareerOS</p>
    <h1>Gathering the <em>evidence.</em></h1>
    <p>Loading the latest public work and capabilities…</p>
    <div className="loading-line" aria-hidden="true" />
  </main>;
}
