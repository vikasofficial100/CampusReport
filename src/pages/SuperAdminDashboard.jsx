import { Link } from "react-router-dom";
import {
  Activity,
  BarChart3,
  Building2,
  FileText,
  MapPinned,
  MessageSquare,
  Settings,
  Shield,
  ShieldAlert,
  Users,
} from "lucide-react";

import DashboardStats from "../components/DashboardStats";
import useAuth from "../hooks/useAuth";

const SuperAdminDashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      label: "Admins",
      value: "Manage",
      icon: <Users />,
    },
    {
      label: "Departments",
      value: "10",
      icon: <Building2 />,
    },
    {
      label: "System",
      value: "Control",
      icon: <Settings />,
    },
    {
      label: "Analytics",
      value: "Live",
      icon: <BarChart3 />,
    },
  ];

  const superAdminActions = [
    {
      title: "Manage users and roles",
      icon: <Users size={18} />,
      path: "/super-admin/users",
    },
    {
      title: "Manage departments",
      icon: <Building2 size={18} />,
      path: "/super-admin/departments",
    },
    {
      title: "Manage all complaints",
      icon: <FileText size={18} />,
      path: "/admin/complaints",
    },
    {
      title: "View analytics",
      icon: <BarChart3 size={18} />,
      path: "/analytics",
    },
    {
      title: "View public heatmap",
      icon: <MapPinned size={18} />,
      path: "/map",
    },
    {
      title: "Review escalations",
      icon: <ShieldAlert size={18} />,
      path: "/escalations",
    },
    {
      title: "View student feedback",
      icon: <MessageSquare size={18} />,
      path: "/feedback",
    },
    {
      title: "System settings",
      icon: <Settings size={18} />,
      path: "/profile-settings",
    },
  ];

  return (
    <main className="min-h-[calc(100vh-76px)] bg-base p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <section className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <span className="text-[13px] font-bold text-structural-muted uppercase tracking-wider mb-2 block">
              Super Admin Dashboard
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-structural mb-3">
              System Control, {user?.name}
            </h1>
            <p className="text-[15px] text-structural-muted max-w-2xl">
              Manage users, departments, complaints, analytics, escalations, and system rules[cite: 62].
            </p>
          </div>

          <Link 
            to="/super-admin/users" 
            className="inline-flex items-center justify-center bg-accent hover:bg-accent-hover text-white font-bold text-[15px] px-8 py-3 rounded-[8px] shadow-sm transition-colors whitespace-nowrap gap-2"
          >
            <Users size={18} />
            Manage Users
          </Link>
        </section>

        {/* Stats Section */}
        <div className="mb-8">
          <DashboardStats stats={stats} />
        </div>

        {/* Main Dashboard Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Big Feature Card */}
          <div className="lg:col-span-2 bg-white border border-border rounded-[10px] shadow-sm p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-structural/10 rounded-[10px] flex items-center justify-center text-structural">
                <Shield size={24} />
              </div>
              <h2 className="text-xl font-bold text-structural">Super Admin Controls</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {superAdminActions.map((action) => (
                <Link 
                  to={action.path} 
                  key={action.title}
                  className="flex items-center gap-3 p-4 rounded-[8px] border border-border hover:border-accent hover:bg-accent/5 text-[14px] font-semibold text-structural transition-colors"
                >
                  <span className="text-structural-muted">{action.icon}</span>
                  {action.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Action Cards Column */}
          <div className="flex flex-col gap-6">
            
            <div className="bg-white border border-border rounded-[10px] shadow-sm p-6 flex flex-col justify-between h-full">
              <div>
                <div className="w-12 h-12 bg-structural/10 rounded-[10px] flex items-center justify-center text-structural mb-4">
                  <ShieldAlert size={24} />
                </div>
                <h3 className="text-[16px] font-bold text-structural mb-2">High-Level Escalations</h3>
                <p className="text-[14px] text-structural-muted mb-6">
                  Review unresolved and critical complaints[cite: 62].
                </p>
              </div>
              <Link to="/escalations" className="text-center w-full py-2.5 border border-border rounded-[8px] text-[14px] font-semibold text-structural hover:bg-structural/5 transition-colors">
                Open Escalations
              </Link>
            </div>

            <div className="bg-white border border-border rounded-[10px] shadow-sm p-6 flex flex-col justify-between h-full">
              <div>
                <div className="w-12 h-12 bg-structural/10 rounded-[10px] flex items-center justify-center text-structural mb-4">
                  <Activity size={24} />
                </div>
                <h3 className="text-[16px] font-bold text-structural mb-2">System Monitoring</h3>
                <p className="text-[14px] text-structural-muted mb-6">
                  Monitor users, departments, reports, feedback and duplicate activity[cite: 62].
                </p>
              </div>
              <Link to="/analytics" className="text-center w-full py-2.5 border border-border rounded-[8px] text-[14px] font-semibold text-structural hover:bg-structural/5 transition-colors">
                Open Analytics
              </Link>
            </div>
            
          </div>
          
        </section>
      </div>
    </main>
  );
};

export default SuperAdminDashboard;