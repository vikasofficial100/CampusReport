import { CheckCircle2, Clock, AlertTriangle, SearchX, Activity, Users, MapPin, ArrowLeft, FolderOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Components you already successfully created
import ChartCard from "../components/ChartCard";
import ComplaintCard from "../components/ComplaintCard";
import ComplaintTimeline from "../components/ComplaintTimeline";
import DashboardStats from "../components/DashboardStats";
import DuplicateAlertBox from "../components/DuplicateAlertBox";

// ==========================================
// INLINE COMPONENTS (No separate files needed)
// ==========================================

const PageHeader = ({ title, description, showBack = false }) => {
  const navigate = useNavigate();
  return (
    <div className="mb-8">
      {showBack && (
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-1.5 text-[13px] font-semibold text-structural-muted hover:text-structural transition-colors mb-4"
        >
          <ArrowLeft size={16} /> Back
        </button>
      )}
      <h1 className="text-2xl md:text-3xl font-bold text-structural">{title}</h1>
      {description && <p className="text-[14px] text-structural-muted mt-2">{description}</p>}
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon = Activity, trend }) => {
  return (
    <div className="bg-white p-5 rounded-[10px] border border-border shadow-sm flex items-start justify-between">
      <div>
        <h3 className="text-[12px] font-bold text-structural-muted uppercase tracking-wider mb-1">{title}</h3>
        <span className="text-3xl font-bold text-structural">{value}</span>
        {trend && <p className="text-[13px] text-structural-muted mt-2">{trend}</p>}
      </div>
      <div className="w-12 h-12 bg-structural/5 rounded-[10px] border border-border/50 flex items-center justify-center text-structural">
        <Icon size={24} />
      </div>
    </div>
  );
};

const EmptyState = ({ title = "No Data Found", message = "There is nothing to display here right now.", icon: Icon = FolderOpen }) => {
  return (
    <div className="w-full py-16 px-6 flex flex-col items-center justify-center text-center bg-base border-2 border-dashed border-border rounded-[10px]">
      <div className="w-16 h-16 bg-white border border-border rounded-full flex items-center justify-center text-structural-muted mb-4 shadow-sm">
        <Icon size={32} />
      </div>
      <h3 className="text-lg font-bold text-structural">{title}</h3>
      <p className="text-[14px] text-structural-muted mt-2 max-w-sm">{message}</p>
    </div>
  );
};

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================

const TestPage = () => {
  // Mock Data
  const mockChartData = [
    { _id: "Electrical", count: 42 },
    { _id: "Plumbing", count: 28 },
    { _id: "Internet", count: 85 },
  ];

  const mockComplaint = {
    _id: "mongo_id_123",
    complaintId: "CMP-2026-0816",
    title: "WiFi Router down in Brahmaputra Hostel",
    description: "The main router on the second floor has been blinking red since yesterday evening.",
    urgency: "High",
    status: "In Progress",
    aiScore: 88,
    createdAt: new Date().toISOString(),
    location: { address: "Brahmaputra Hostel, 2nd Floor" }
  };

  const mockTimeline = [
    { _id: "1", title: "Complaint Submitted", message: "User reported the issue via portal.", status: "Submitted", createdAt: new Date().toISOString() },
    { _id: "2", title: "Assigned to IT", message: "System automatically routed to Internet/IT department.", status: "Under Review", createdAt: new Date().toISOString() },
    { _id: "3", title: "Technician Dispatched", message: "A technician is on the way to check the router.", status: "In Progress", createdAt: new Date().toISOString() },
  ];

  const mockGridStats = [
    { label: "Active Issues", value: "12", icon: <AlertTriangle /> },
    { label: "Resolved", value: "84", icon: <CheckCircle2 /> },
    { label: "Users Affected", value: "320", icon: <Users /> },
    { label: "Campuses", value: "2", icon: <MapPin /> },
  ];

  const mockDuplicate = {
    isDuplicate: true,
    similarityScore: 92,
    distanceInMeters: 15,
    reason: "AI detected similar keywords ('WiFi', 'Router', 'Brahmaputra') submitted by another user nearby 2 hours ago.",
    originalComplaint: { complaintId: "CMP-2026-0810" }
  };

  return (
    <div className="min-h-[calc(100vh-76px)] bg-base p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        
        <section>
          <PageHeader title="Component Test Lab" description="Previewing reusable UI components." showBack={true} />
          <hr className="border-border" />
        </section>

        <section>
          <h2 className="text-lg font-bold text-structural mb-4">Dashboard Stats Grid</h2>
          <DashboardStats stats={mockGridStats} />
        </section>

        <section>
          <h2 className="text-lg font-bold text-structural mb-4">Duplicate Alerts</h2>
          <DuplicateAlertBox duplicate={mockDuplicate} />
        </section>

        <section>
          <h2 className="text-lg font-bold text-structural mb-4">Complaint Timeline</h2>
          <div className="max-w-2xl bg-white p-6 rounded-[10px] border border-border shadow-sm">
            <ComplaintTimeline timeline={mockTimeline} />
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-structural mb-4">Stat Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Total Complaints" value="1,284" icon={CheckCircle2} trend="+12% from last month" />
            <StatCard title="Pending Review" value="42" icon={Clock} trend="Needs attention" />
            <StatCard title="Critical Issues" value="3" icon={AlertTriangle} trend="Escalated to Admin" />
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-structural mb-4">Empty States</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EmptyState />
            <EmptyState title="No Results Found" message="Try adjusting your filters or searching with a different keyword." icon={SearchX} />
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-structural mb-4">Charts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartCard title="Complaints by Category" data={mockChartData} type="bar" />
          </div>
        </section>

      </div>
    </div>
  );
};

export default TestPage;