import { Link } from "react-router-dom";
import { Brain, FilePlus2, MapPinned, ShieldCheck, Timer, ArrowRight, Activity } from "lucide-react";
import useAuth from "../hooks/useAuth";
import DashboardStats from "../components/DashboardStats";

const UserDashboard = () => {
  const { user } = useAuth();

  // Stats array prepared for the DashboardStats component
  const stats = [
    { label: "Trust Score", value: user?.trustScore || 50, icon: <ShieldCheck size={20} /> },
    { label: "Total Reports", value: user?.totalReports || 0, icon: <FilePlus2 size={20} /> },
    { label: "AI Priority", value: "Ready", icon: <Brain size={20} /> },
    { label: "Tracking", value: "OTP", icon: <Timer size={20} /> },
  ];

  return (
    <main className="min-h-[calc(100vh-76px)] bg-base p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-8 rounded-[10px] border border-border shadow-sm">
          <div>
            <span className="text-[12px] font-bold text-structural-muted uppercase tracking-wider block mb-2">
              Citizen Dashboard
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-structural mb-2">
              Hello, {user?.name || "Student"}
            </h1>
            <p className="text-[15px] text-structural-muted">
              Report, track, and verify campus issues from one dashboard.
            </p>
          </div>

          <Link 
            to="/report-issue" 
            className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white font-bold text-[15px] px-8 py-3.5 rounded-[8px] transition-colors shadow-sm whitespace-nowrap"
          >
            <FilePlus2 size={18} />
            Report New Issue
          </Link>
        </section>

        {/* Stats Component */}
        <DashboardStats stats={stats} />

        {/* Dashboard Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Quick Actions (Takes up 1 column, but could stretch if needed) */}
          <div className="bg-white p-6 md:p-8 rounded-[10px] border border-border shadow-sm flex flex-col h-full">
            <h2 className="flex items-center gap-2 text-[15px] font-bold text-structural uppercase tracking-wider mb-6 border-b border-border pb-3">
              <Activity size={18} /> Quick Actions
            </h2>
            <div className="flex flex-col gap-3 flex-grow">
              <Link 
                to="/report-issue" 
                className="flex items-center justify-between p-3.5 bg-base border border-border rounded-[8px] text-[14px] font-bold text-structural hover:border-accent hover:text-accent transition-colors"
              >
                Report new issue <ArrowRight size={16} />
              </Link>
              <Link 
                to="/my-complaints" 
                className="flex items-center justify-between p-3.5 bg-base border border-border rounded-[8px] text-[14px] font-bold text-structural hover:border-accent hover:text-accent transition-colors"
              >
                My complaints <ArrowRight size={16} />
              </Link>
              <Link 
                to="/track-complaint" 
                className="flex items-center justify-between p-3.5 bg-base border border-border rounded-[8px] text-[14px] font-bold text-structural hover:border-accent hover:text-accent transition-colors"
              >
                Track complaint <ArrowRight size={16} />
              </Link>
              <Link 
                to="/map" 
                className="flex items-center justify-between p-3.5 bg-base border border-border rounded-[8px] text-[14px] font-bold text-structural hover:border-accent hover:text-accent transition-colors"
              >
                View public heatmap <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Public Heatmap */}
          <div className="bg-white p-6 md:p-8 rounded-[10px] border border-border shadow-sm flex flex-col text-center items-center justify-center">
            <div className="w-14 h-14 bg-structural/10 text-structural rounded-[10px] flex items-center justify-center mb-5">
              <MapPinned size={28} />
            </div>
            <h3 className="text-lg font-bold text-structural mb-2">Public Heatmap</h3>
            <p className="text-[14px] text-structural-muted leading-relaxed mb-6">
              View civic issue hotspots around the campus areas.
            </p>
            <Link 
              to="/map" 
              className="inline-flex items-center justify-center bg-structural/10 text-structural hover:bg-structural/20 font-bold text-[14px] px-6 py-2.5 rounded-[8px] transition-colors mt-auto w-full"
            >
              Open Map
            </Link>
          </div>

          {/* AI Priority Engine */}
          <div className="bg-white p-6 md:p-8 rounded-[10px] border border-border shadow-sm flex flex-col text-center items-center justify-center">
            <div className="w-14 h-14 bg-structural/10 text-structural rounded-[10px] flex items-center justify-center mb-5">
              <Brain size={28} />
            </div>
            <h3 className="text-lg font-bold text-structural mb-2">AI Priority Engine</h3>
            <p className="text-[14px] text-structural-muted leading-relaxed">
              Your complaints are automatically analyzed with AI-assisted urgency logic to ensure critical hazards are routed immediately.
            </p>
          </div>

        </section>
      </div>
    </main>
  );
};

export default UserDashboard;