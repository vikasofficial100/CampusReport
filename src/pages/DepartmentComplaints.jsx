import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ClipboardList, Search, SlidersHorizontal } from "lucide-react";
import { getAssignedDepartmentComplaints } from "../services/departmentPanelService";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";
import UrgencyBadge from "../components/UrgencyBadge";

const DepartmentComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    urgency: "",
  });

  const fetchComplaints = async () => {
    setLoading(true);

    try {
      const data = await getAssignedDepartmentComplaints(filters);
      setComplaints(data.complaints || []);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (event) => {
    setFilters((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleFilter = (event) => {
    event.preventDefault();
    fetchComplaints();
  };

  if (loading) {
    return <Loader text="Loading assigned complaints..." />;
  }

  return (
    <main className="min-h-[calc(100vh-76px)] bg-base px-6 py-8 md:px-10 md:py-12 text-structural">
      <div className="max-w-7xl mx-auto space-y-8">
        <section className="bg-white border border-border rounded-[10px] shadow-sm p-6 md:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-structural-muted mb-3">
                Department staff
              </p>
              <h1 className="text-3xl md:text-4xl font-extrabold text-structural leading-tight">
                Assigned complaints
              </h1>
              <p className="mt-3 text-[15px] md:text-base text-structural-muted leading-relaxed">
                View, accept, update, and resolve complaints assigned to your department.
              </p>
            </div>

            <div className="rounded-[10px] border border-border bg-base px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-wider text-structural-muted">Open items</p>
              <p className="mt-1 text-2xl font-extrabold text-structural">{complaints.length}</p>
            </div>
          </div>
        </section>

        <form
          className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.8fr)_repeat(3,minmax(0,1fr))] gap-4"
          onSubmit={handleFilter}
        >
          <div className="flex items-center gap-3 rounded-[10px] border border-border bg-white px-4 py-3 shadow-sm">
            <Search size={18} className="text-structural-muted shrink-0" />
            <input
              name="search"
              className="w-full bg-transparent text-structural placeholder:text-structural-muted focus:outline-none"
              placeholder="Search by complaint ID, title, or location"
              value={filters.search}
              onChange={handleChange}
            />
          </div>

          <select
            name="status"
            className="rounded-[10px] border border-border bg-white px-4 py-3 text-structural shadow-sm focus:border-accent focus:outline-none"
            value={filters.status}
            onChange={handleChange}
          >
            <option value="">All status</option>
            <option value="Assigned to Department">Assigned to Department</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Escalated">Escalated</option>
          </select>

          <select
            name="urgency"
            className="rounded-[10px] border border-border bg-white px-4 py-3 text-structural shadow-sm focus:border-accent focus:outline-none"
            value={filters.urgency}
            onChange={handleChange}
          >
            <option value="">All urgency</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>

          <button className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-accent px-5 py-3 font-semibold text-white shadow-sm hover:bg-accent-hover transition-colors">
            <SlidersHorizontal size={18} />
            Apply filters
          </button>
        </form>

        {complaints.length === 0 ? (
          <div className="bg-white border border-border rounded-[10px] shadow-sm p-6 md:p-8">
            <EmptyState
              title="No assigned complaints"
              message="There are no complaints assigned to your department yet."
            />
          </div>
        ) : (
          <section className="bg-white border border-border rounded-[10px] shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-base">
              <div className="w-10 h-10 rounded-[10px] bg-structural/10 text-structural flex items-center justify-center">
                <ClipboardList size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-structural">{complaints.length} assigned complaints</h2>
                <p className="text-sm text-structural-muted">Open a complaint to update its work progress.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left">
                <thead className="bg-base text-structural-muted text-xs uppercase tracking-[0.18em]">
                  <tr>
                    <th className="px-6 py-4 font-bold">ID</th>
                    <th className="px-6 py-4 font-bold">Title</th>
                    <th className="px-6 py-4 font-bold">Student</th>
                    <th className="px-6 py-4 font-bold">Urgency</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="px-6 py-4 font-bold">AI Score</th>
                    <th className="px-6 py-4 font-bold">Location</th>
                    <th className="px-6 py-4 font-bold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {complaints.map((complaint) => (
                    <tr key={complaint._id} className="hover:bg-base/70 transition-colors">
                      <td className="px-6 py-4 font-semibold text-accent">{complaint.complaintId}</td>
                      <td className="px-6 py-4 font-semibold text-structural">{complaint.title}</td>
                      <td className="px-6 py-4 text-structural-muted">{complaint.reportedBy?.name || "Student"}</td>
                      <td className="px-6 py-4">
                        <UrgencyBadge urgency={complaint.urgency} />
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={complaint.status} />
                      </td>
                      <td className="px-6 py-4 font-semibold text-structural">{complaint.aiScore}/100</td>
                      <td className="px-6 py-4 text-structural-muted">{complaint.location?.address || "N/A"}</td>
                      <td className="px-6 py-4 text-center">
                        <Link
                          className="inline-flex items-center justify-center rounded-[10px] bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent-hover transition-colors"
                          to={`/department/complaints/${complaint._id}`}
                        >
                          Work on it
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default DepartmentComplaints;
