import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Clock,
  FileWarning,
  Filter,
  MessageSquare,
  ShieldAlert,
  UploadCloud,
} from "lucide-react";

import DashboardStats from "../components/DashboardStats";
import useAuth from "../hooks/useAuth";
import Loader from "../components/Loader";
import { getDepartmentPerformance } from "../services/departmentPanelService";

const DepartmentDashboard = () => {
  const { user } = useAuth();

  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPerformance = async () => {
    try {
      const data = await getDepartmentPerformance();
      setPerformance(data.performance);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformance();
  }, []);

  if (loading) {
    return <Loader text="Loading department dashboard..." />;
  }

  const stats = [
    {
      label: "Assigned",
      value: performance?.assigned || 0,
      icon: <FileWarning />,
    },
    {
      label: "In Progress",
      value: performance?.inProgress || 0,
      icon: <Clock />,
    },
    {
      label: "Resolved",
      value: performance?.resolved || 0,
      icon: <CheckCircle2 />,
    },
    {
      label: "Resolution Rate",
      value: `${performance?.resolutionRate || 0}%`,
      icon: <BarChart3 />,
    },
  ];

  const departmentActions = [
    {
      title: "View assigned complaints",
      icon: <ClipboardList size={18} />,
      path: "/department/complaints",
    },
    {
      title: "Filter by urgency and status",
      icon: <Filter size={18} />,
      path: "/department/complaints",
    },
    {
      title: "Accept complaint and move to In Progress",
      icon: <Clock size={18} />,
      path: "/department/complaints",
    },
    {
      title: "Upload before/after proof",
      icon: <UploadCloud size={18} />,
      path: "/department/complaints",
    },
    {
      title: "Add work remarks",
      icon: <MessageSquare size={18} />,
      path: "/department/complaints",
    },
    {
      title: "Mark complaint as resolved",
      icon: <CheckCircle2 size={18} />,
      path: "/department/complaints",
    },
  ];

  const handleEscalationAccess = () => {
    toast.error("Only Admin and Super Admin can access the Escalation Center.");
  };

  return (
    <main className="min-h-[calc(100vh-76px)] bg-base p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <section className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <span className="text-[13px] font-bold text-structural-muted uppercase tracking-wider mb-2 block">
              Department Staff Dashboard
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-structural mb-3">
              Hello, {user?.name}
            </h1>
            <p className="text-[15px] text-structural-muted max-w-2xl">
              Manage assigned complaints and update resolution progress.
            </p>
          </div>

          <Link 
            to="/department/complaints" 
            className="inline-flex items-center justify-center bg-accent hover:bg-accent-hover text-white font-bold text-[15px] px-8 py-3 rounded-[8px] shadow-sm transition-colors whitespace-nowrap gap-2"
          >
            <ClipboardList size={18} />
            View Assigned Complaints
          </Link>
        </section>

        <div className="mb-8">
          <DashboardStats stats={stats} />
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 bg-white border border-border rounded-[10px] shadow-sm p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-structural/10 rounded-[10px] flex items-center justify-center text-structural">
                <ClipboardList size={24} />
              </div>
              <h2 className="text-xl font-bold text-structural">Department Workflow</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {departmentActions.map((action) => (
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

          <div className="flex flex-col gap-6">
            <div className="bg-white border border-border rounded-[10px] shadow-sm p-6 flex flex-col justify-between h-full">
              <div>
                <div className="w-12 h-12 bg-structural/10 rounded-[10px] flex items-center justify-center text-structural mb-4">
                  <UploadCloud size={24} />
                </div>
                <h3 className="text-[16px] font-bold text-structural mb-2">Resolution Proof</h3>
                <p className="text-[14px] text-structural-muted mb-6">
                  Upload before and after proof images after work completion.
                </p>
              </div>
              <Link to="/department/complaints" className="text-center w-full py-2.5 border border-border rounded-[8px] text-[14px] font-semibold text-structural hover:bg-structural/5 transition-colors">
                Open Work Panel
              </Link>
            </div>

            <div className="bg-white border border-border rounded-[10px] shadow-sm p-6 flex flex-col justify-between h-full">
              <div>
                <div className="w-12 h-12 bg-structural/10 rounded-[10px] flex items-center justify-center text-structural mb-4">
                  <ShieldAlert size={24} />
                </div>
                <h3 className="text-[16px] font-bold text-structural mb-2">Escalation Watch</h3>
                <p className="text-[14px] text-structural-muted mb-6">
                  Unresolved complaints can be escalated automatically.
                </p>
              </div>
              
              <button
                type="button"
                onClick={handleEscalationAccess}
                className="text-center w-full py-2.5 border border-border rounded-[8px] text-[14px] font-semibold text-structural hover:bg-structural/5 transition-colors"
              >
                View Escalations
              </button>
            </div>
          </div>
          
        </section>
      </div>
    </main>
  );
};

export default DepartmentDashboard;
