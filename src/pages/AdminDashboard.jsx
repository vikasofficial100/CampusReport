import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  CheckCircle2,
  GitMerge,
  ListChecks,
  MapPinned,
  Repeat2,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Users,
  ChevronRight
} from "lucide-react";

import DashboardStats from "../components/DashboardStats"; 
import useAuth from "../hooks/useAuth"; 
import Loader from "../components/Loader"; 
import ChartCard from "../components/ChartCard"; 
import { getDashboardAnalytics } from "../services/analyticsService"; 

const AdminDashboard = () => {
  const { user } = useAuth(); 

  const [dashboard, setDashboard] = useState(null); 
  const [loading, setLoading] = useState(true); 

  const fetchDashboard = async () => {
    try {
      const data = await getDashboardAnalytics(); 
      setDashboard(data.dashboard); 
    } catch (error) {
      console.error(error.message); 
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchDashboard(); 
  }, []); 

  if (loading) {
    return <Loader text="Loading admin dashboard..." />; 
  }

  const summary = dashboard?.summary || {}; 

  const stats = [
    {
      label: "All Complaints",
      value: summary.totalComplaints || 0, 
      icon: <ListChecks size={20} />, 
    },
    {
      label: "Users",
      value: summary.totalUsers || 0, 
      icon: <Users size={20} />, 
    },
    {
      label: "Duplicates",
      value: summary.totalDuplicates || 0, 
      icon: <GitMerge size={20} />, 
    },
    {
      label: "Resolution Rate",
      value: `${summary.resolutionRate || 0}%`, 
      icon: <BarChart3 size={20} />, 
    },
  ];

  const adminActions = [
    {
      title: "View & manage all complaints", 
      icon: <ListChecks size={18} />, 
      path: "/admin/complaints", 
    },
    {
      title: "Verify complaints", 
      icon: <UserCheck size={18} />, 
      path: "/admin/complaints", 
    },
    {
      title: "Assign or reassign department", 
      icon: <Repeat2 size={18} />, 
      path: "/admin/complaints", 
    },
    {
      title: "Monitor department progress", 
      icon: <CheckCircle2 size={18} />, 
      path: "/admin/complaints", 
    },
    {
      title: "View analytics dashboard", 
      icon: <BarChart3 size={18} />, 
      path: "/analytics", 
    },
    {
      title: "View public heatmap", 
      icon: <MapPinned size={18} />, 
      path: "/map", 
    },
    {
      title: "Escalation center", 
      icon: <ShieldAlert size={18} />, 
      path: "/escalations", 
    },
    {
      title: "Student feedback", 
      icon: <Users size={18} />, 
      path: "/feedback", 
    },
  ];

  return (
    <main className="min-h-[calc(100vh-76px)] bg-base p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-8 rounded-[10px] border border-border shadow-sm">
          <div>
            <span className="text-[12px] font-bold text-structural-muted uppercase tracking-wider block mb-2">
              Admin Dashboard 
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-structural mb-2">
              Welcome, {user?.name} 
            </h1>
            <p className="text-[15px] text-structural-muted">
              Monitor complaints, verify reports, assign departments, and analyze civic data. 
            </p>
          </div>

          <Link 
            to="/analytics" 
            className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white font-bold text-[15px] px-8 py-3.5 rounded-[8px] transition-colors shadow-sm whitespace-nowrap"
          >
            <BarChart3 size={18} /> 
            View Analytics 
          </Link>
        </section>

        {/* Stats Grid */}
        <DashboardStats stats={stats} /> 

        {/* Action Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Controls List */}
          <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-[10px] border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
              <div className="w-10 h-10 bg-structural/10 text-structural rounded-[8px] flex items-center justify-center">
                <ShieldCheck size={24} /> 
              </div>
              <h2 className="text-xl font-bold text-structural">Admin Controls</h2> 
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {adminActions.map((action) => (
                <Link 
                  to={action.path} 
                  key={action.title}
                  className="flex items-center justify-between p-4 bg-base border border-border rounded-[8px] text-[14px] font-semibold text-structural hover:border-accent hover:text-accent transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-structural-muted group-hover:text-accent transition-colors">
                      {action.icon} 
                    </span>
                    {action.title} 
                  </div>
                  <ChevronRight size={16} className="text-structural-muted group-hover:text-accent opacity-50 group-hover:opacity-100 transition-all" />
                </Link>
              ))}
            </div>
          </div>

          {/* Side Cards */}
          <div className="space-y-6 flex flex-col">
            <div className="bg-white p-6 md:p-8 rounded-[10px] border border-border shadow-sm flex-1 flex flex-col items-center text-center justify-center">
              <div className="w-14 h-14 bg-structural/10 text-structural rounded-[10px] flex items-center justify-center mb-4">
                <MapPinned size={28} /> 
              </div>
              <h3 className="text-lg font-bold text-structural mb-2">Heatmap & Zones</h3> 
              <p className="text-[13px] text-structural-muted leading-relaxed mb-6">
                Identify red, yellow, and green civic issue zones. 
              </p>
              <Link to="/map" className="w-full py-2.5 bg-structural/10 text-structural hover:bg-structural/20 font-bold text-[13px] rounded-[8px] transition-colors mt-auto">
                Open Heatmap 
              </Link>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-[10px] border border-border shadow-sm flex-1 flex flex-col items-center text-center justify-center">
              <div className="w-14 h-14 bg-structural/10 text-structural rounded-[10px] flex items-center justify-center mb-4">
                <BarChart3 size={28} /> 
              </div>
              <h3 className="text-lg font-bold text-structural mb-2">Analytics</h3> 
              <p className="text-[13px] text-structural-muted leading-relaxed mb-6">
                Category-wise, status-wise, and department-wise data. 
              </p>
              <Link to="/analytics" className="w-full py-2.5 bg-structural/10 text-structural hover:bg-structural/20 font-bold text-[13px] rounded-[8px] transition-colors mt-auto">
                Open Analytics 
              </Link>
            </div>
          </div>

        </section>

        {/* Charts Section */}
        {dashboard && (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
            <ChartCard title="Category Overview" data={dashboard.categoryWise} /> 
            <ChartCard
              title="Status Overview" 
              data={dashboard.statusWise} 
              type="pie" 
            />
          </section>
        )}
      </div>
    </main>
  );
};

export default AdminDashboard; 