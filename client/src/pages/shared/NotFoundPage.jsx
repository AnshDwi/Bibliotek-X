import { Link } from "react-router-dom";

export const NotFoundPage = () => (
  <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
    <p className="text-sm uppercase tracking-[0.35em] text-sky-300/80">404</p>
    <h1 className="mt-4 text-4xl font-semibold text-white">Signal not found</h1>
    <p className="mt-3 max-w-md text-sm text-slate-400">
      The route you requested is not mapped inside the Bibliotek X experience yet.
    </p>
    <Link to="/" className="mt-6 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-950">
      Return home
    </Link>
  </div>
);

