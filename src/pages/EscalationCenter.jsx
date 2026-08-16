import { useEffect, useState } from "react";
import { AlertTriangle, RefreshCw, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";
import {
  getEscalations,
  runAutoEscalationCheck,
  updateEscalationStatus,
} from "../services/escalationService";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

const statusOptions = ["Open", "Reviewed", "Resolved"];

const EscalationCenter = () => {
  const [escalations, setEscalations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  const fetchEscalations = async () => {
    try {
      const data = await getEscalations();
      setEscalations(data.escalations || []);
    } catch (error) {
      toast.error(error.message || "Failed to load escalations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEscalations();
  }, []);

  const handleRunCheck = async () => {
    setChecking(true);

    try {
      const data = await runAutoEscalationCheck();
      toast.success(`Auto check complete. ${data.escalatedCount} escalated.`);
      fetchEscalations();
    } catch (error) {
      toast.error(error.message || "Auto escalation failed");
    } finally {
      setChecking(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateEscalationStatus(id, { status });
      toast.success("Escalation status updated");
      fetchEscalations();
    } catch (error) {
      toast.error(error.message || "Update failed");
    }
  };

  if (loading) {
    return <Loader text="Loading escalation center..." />;
  }

  return (
    <main className="min-h-[calc(100vh-76px)] bg-base px-6 py-8 md:px-10 md:py-12 text-structural">
      <div className="max-w-7xl mx-auto space-y-8">
        <section className="bg-white border border-border rounded-[10px] shadow-sm p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-structural-muted mb-3">
                Admin escalation
              </p>
              <h1 className="text-3xl md:text-4xl font-extrabold text-structural leading-tight">
                Escalation center
              </h1>
              <p className="mt-3 text-[15px] md:text-base text-structural-muted leading-relaxed">
                Review unresolved high-priority complaints and keep escalation records up to date.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-[10px] border border-border bg-base px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-wider text-structural-muted">Escalations</p>
                <p className="mt-1 text-2xl font-extrabold text-structural">{escalations.length}</p>
              </div>
              <button
                className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-accent px-5 py-3 font-semibold text-white shadow-sm hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleRunCheck}
                disabled={checking}
              >
                <RefreshCw size={18} className={checking ? "animate-spin" : ""} />
                {checking ? "Checking..." : "Run auto check"}
              </button>
            </div>
          </div>
        </section>

        {escalations.length === 0 ? (
          <div className="bg-white border border-border rounded-[10px] shadow-sm p-6 md:p-8">
            <EmptyState
              title="No escalations yet"
              message="Run auto check or manually escalate complaints from the admin panel."
            />
          </div>
        ) : (
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {escalations.map((item) => (
              <article
                key={item._id}
                className="bg-white border border-border rounded-[10px] shadow-sm p-6"
              >
                <div className="flex flex-col sm:flex-row gap-5">
                  <div className="w-14 h-14 rounded-[10px] bg-accent/10 text-accent flex items-center justify-center shrink-0">
                    <ShieldAlert size={28} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="inline-flex items-center rounded-full bg-structural/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-structural">
                        ID: {item.complaintId}
                      </span>
                      <span className="inline-flex items-center rounded-full border border-border bg-base px-3 py-1 text-xs font-semibold text-structural-muted">
                        {item.escalationType}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-structural">
                      {item.complaint?.title || "Complaint"}
                    </h3>
                    <p className="mt-2 text-sm md:text-[15px] text-structural-muted leading-relaxed">
                      {item.reason}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full border border-border bg-base px-3 py-1 text-xs font-semibold text-structural">
                        {item.oldLevel} → {item.newLevel}
                      </span>
                      <span className="rounded-full border border-border bg-base px-3 py-1 text-xs font-semibold text-structural">
                        {new Date(item.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="sm:pl-5 sm:border-l border-border flex-shrink-0">
                    <div className="flex items-center gap-2 text-structural-muted mb-3">
                      <AlertTriangle size={18} />
                      <span className="text-sm font-semibold">Status</span>
                    </div>
                    <select
                      className="w-full sm:w-40 rounded-[10px] border border-border bg-white px-4 py-3 text-structural focus:border-accent focus:outline-none"
                      value={item.status}
                      onChange={(event) => handleStatusChange(item._id, event.target.value)}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
};

export default EscalationCenter;
