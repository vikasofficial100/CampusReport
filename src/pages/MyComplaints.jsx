import { useEffect, useMemo, useState } from "react";
import { FileSearch, Search } from "lucide-react";
import { getMyComplaints } from "../services/complaintService";
import ComplaintCard from "../components/ComplaintCard";
import EmptyState from "../components/EmptyState";
import Loader from "../components/Loader";

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchComplaints = async () => {
    try {
      const data = await getMyComplaints();
      setComplaints(data.complaints || []);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const searchText = `${complaint.complaintId} ${complaint.title} ${complaint.description} ${complaint.category}`.toLowerCase();

      const matchesSearch = searchText.includes(search.toLowerCase());

      const matchesStatus = statusFilter
        ? complaint.status === statusFilter
        : true;

      return matchesSearch && matchesStatus;
    });
  }, [complaints, search, statusFilter]);

  if (loading) {
    return <Loader text="Loading your complaints..." />;
  }

  return (
    <main className="min-h-[calc(100vh-76px)] bg-base p-6 md:p-12">
      
      {/* Header Section */}
      <section className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-structural mb-3">
          My Complaints
        </h1>
        <p className="text-[15px] text-structural-muted max-w-2xl">
          Track all your submitted campus issues and their current status.
        </p>
      </section>

      {/* Toolbar Section */}
      <section className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-4 mb-8">
        
        {/* Search Bar */}
        <div className="relative flex-grow">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-structural-muted" />
          <input
            type="text"
            placeholder="Search by ID, title, category..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full pl-10 p-3 bg-white border border-border rounded-[8px] text-sm text-structural focus:border-accent focus:outline-none transition-colors shadow-sm"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="w-full sm:w-64 p-3 bg-white border border-border rounded-[8px] text-sm text-structural focus:border-accent focus:outline-none transition-colors appearance-none shadow-sm cursor-pointer"
        >
          <option value="">All Status</option>
          <option value="Submitted">Submitted</option>
          <option value="AI Analyzed">AI Analyzed</option>
          <option value="Duplicate Checked">Duplicate Checked</option>
          <option value="Assigned to Department">Assigned to Department</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>
        
      </section>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto">
        {filteredComplaints.length === 0 ? (
          <EmptyState
            title="No complaints found"
            message="Submit your first campus issue from the report page." 
          />
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredComplaints.map((complaint) => (
              <ComplaintCard complaint={complaint} key={complaint._id} />
            ))}
          </section>
        )}

        {/* Footer Count Box */}
        <div className="flex items-center gap-2 mt-8 pt-6 border-t border-border text-[13px] font-bold text-structural-muted uppercase tracking-wider">
          <FileSearch size={18} />
          Showing {filteredComplaints.length} of {complaints.length} complaints
        </div>
      </div>

    </main>
  );
};

export default MyComplaints;