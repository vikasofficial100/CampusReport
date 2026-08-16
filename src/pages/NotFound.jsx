import { Link } from "react-router-dom";
import { ArrowLeft, Home, ShieldAlert } from "lucide-react";

const NotFound = () => {
  return (
    <main className="min-h-[calc(100vh-76px)] bg-base px-6 py-12 flex items-center justify-center">
      <section className="w-full max-w-2xl bg-white border border-border rounded-[10px] shadow-sm p-8 md:p-12 text-center">
        <div className="mx-auto w-16 h-16 rounded-[10px] bg-structural/10 text-structural flex items-center justify-center mb-6">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <p className="text-xs font-bold uppercase tracking-[0.24em] text-structural-muted mb-3">
          Page not found
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-structural mb-4">
          We can&apos;t find that page
        </h1>
        <p className="text-[15px] md:text-base text-structural-muted leading-relaxed max-w-xl mx-auto">
          The page may have been moved, deleted, or the link may be incorrect. Use one of the actions below to get back to a working section of CampusResolve.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[10px] bg-accent text-white font-semibold shadow-sm hover:bg-accent-hover transition-colors"
          >
            <Home size={18} />
            Back to Home
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[10px] border border-border bg-base text-structural font-semibold hover:bg-white transition-colors"
          >
            <ArrowLeft size={18} />
            Go to Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
};

export default NotFound;
