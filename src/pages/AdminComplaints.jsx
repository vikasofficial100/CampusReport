import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileSearch, Search, SlidersHorizontal } from "lucide-react";
import { getAdminComplaints } from "../services/adminPanelService";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";
import UrgencyBadge from "../components/UrgencyBadge";

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    category: "",
    urgency: "",
  });

  const fetchComplaints = async () => {
    setLoading(true);

    try {
      const data = await getAdminComplaints(filters);
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

  const handleFilterSubmit = (event) => {
    event.preventDefault();
    fetchComplaints();
  };

  if (loading) {
    return <Loader text="Loading admin complaints..." />;
  }

  return (
    <main className="min-h-[calc(100vh-76px)] bg-base p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <section className="mb-8">
          <span className="text-[12px] font-bold text-structural-muted uppercase tracking-wider block mb-2">
            Admin Control
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-structural mb-2">
            All Complaints
          </h1>
          <p className="text-[15px] text-structural-muted max-w-2xl">
            Verify, filter, assign, and update civic complaints across the campus.
          </p>
        </section>

        {/* Filter Bar */}
        <form 
          className="bg-white p-4 md:p-6 rounded-[10px] border border-border shadow-sm mb-8 flex flex-col lg:flex-row gap-4 items-end" 
          onSubmit={handleFilterSubmit}
        >
          {/* Search Box */}
          <div className="w-full lg:flex-1">
            <label className="block text-[11px] font-bold text-structural-muted uppercase tracking-wider mb-1.5">Search</label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-structural-muted" />
              <input
                name="search"
                placeholder="Search by ID, title, department..."
                value={filters.search}
                onChange={handleChange}
                className="w-full pl-9 p-2.5 bg-base border border-border rounded-[8px] text-sm text-structural focus:border-accent focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="w-full lg:w-48">
            <label className="block text-[11px] font-bold text-structural-muted uppercase tracking-wider mb-1.5">Status</label>
            <select name="status" value={filters.status} onChange={handleChange} className="w-full p-2.5 bg-base border border-border rounded-[8px] text-sm text-structural focus:border-accent focus:outline-none transition-colors appearance-none">
              <option value="">All Status</option>
              <option value="Submitted">Submitted</option>
              <option value="AI Analyzed">AI Analyzed</option>
              <option value="Duplicate Checked">Duplicate Checked</option>
              <option value="Assigned to Department">Assigned to Department</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Escalated">Escalated</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="w-full lg:w-48">
            <label className="block text-[11px] font-bold text-structural-muted uppercase tracking-wider mb-1.5">Category</label>
            <select name="category" value={filters.category} onChange={handleChange} className="w-full p-2.5 bg-base border border-border rounded-[8px] text-sm text-structural focus:border-accent focus:outline-none transition-colors appearance-none">
              <option value="">All Categories</option>
              <option value="hostel">Hostel</option>
              <option value="mess">Mess & Dining</option>
              <option value="electrical">Electrical</option>
              <option value="water_plumbing">Water & Plumbing</option>
              <option value="civil_infrastructure">Civil & Infra</option>
              <option value="sanitation_waste">Sanitation & Waste</option>
              <option value="it_internet">IT & Internet</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Urgency Filter */}
          <div className="w-full lg:w-40">
            <label className="block text-[11px] font-bold text-structural-muted uppercase tracking-wider mb-1.5">Urgency</label>
            <select name="urgency" value={filters.urgency} onChange={handleChange} className="w-full p-2.5 bg-base border border-border rounded-[8px] text-sm text-structural focus:border-accent focus:outline-none transition-colors appearance-none">
              <option value="">All Urgency</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          {/* Submit Action */}
          <button type="submit" className="w-full lg:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-accent text-white font-bold text-sm rounded-[8px] hover:bg-accent-hover transition-colors shadow-sm">
            <SlidersHorizontal size={16} />
            Apply
          </button>
        </form>

        {/* Complaints Table Section */}
        {complaints.length === 0 ? (
          <EmptyState title="No complaints found" message="Try adjusting your filters or search terms." />
        ) : (
          <section className="bg-white rounded-[10px] border border-border shadow-sm overflow-hidden flex flex-col">
            <div className="flex items-center gap-2 p-5 border-b border-border bg-base/50">
              <FileSearch size={18} className="text-structural-muted" />
              <h2 className="text-[15px] font-bold text-structural">{complaints.length} Complaints Found</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-base border-b border-border">
                  <tr>
                    <th className="px-5 py-4 text-[11px] font-bold text-structural-muted uppercase tracking-wider whitespace-nowrap">ID</th>
                    <th className="px-5 py-4 text-[11px] font-bold text-structural-muted uppercase tracking-wider">Title</th>
                    <th className="px-5 py-4 text-[11px] font-bold text-structural-muted uppercase tracking-wider">Student</th>
                    <th className="px-5 py-4 text-[11px] font-bold text-structural-muted uppercase tracking-wider">Category</th>
                    <th className="px-5 py-4 text-[11px] font-bold text-structural-muted uppercase tracking-wider">Urgency</th>
                    <th className="px-5 py-4 text-[11px] font-bold text-structural-muted uppercase tracking-wider">Status</th>
                    <th className="px-5 py-4 text-[11px] font-bold text-structural-muted uppercase tracking-wider">Department</th>
                    <th className="px-5 py-4 text-[11px] font-bold text-structural-muted uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {complaints.map((complaint) => (
                    <tr key={complaint._id} className="hover:bg-base/50 transition-colors">
                      <td className="px-5 py-4 text-[13px] font-mono font-medium text-structural-muted whitespace-nowrap">
                        {complaint.complaintId}
                      </td>
                      <td className="px-5 py-4 text-[14px] font-bold text-structural max-w-[200px] truncate">
                        {complaint.title}
                      </td>
                      <td className="px-5 py-4 text-[13px] text-structural-muted">
                        {complaint.reportedBy?.name || "Student"}
                      </td>
                      <td className="px-5 py-4 text-[13px] text-structural font-medium">
                        {complaint.category}
                      </td>
                      <td className="px-5 py-4">
                        <UrgencyBadge urgency={complaint.urgency} />
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={complaint.status} />
                      </td>
                      <td className="px-5 py-4 text-[13px] text-structural-muted">
                        {complaint.department || "-"}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          to={`/admin/complaints/${complaint._id}`}
                          className="inline-flex items-center justify-center px-4 py-1.5 bg-structural/10 text-structural hover:bg-structural/20 font-bold text-[12px] rounded-[6px] transition-colors"
                        >
                          Manage
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

export default AdminComplaints;