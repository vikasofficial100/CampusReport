import { useEffect, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  GitMerge,
  ListChecks,
  Users,
} from "lucide-react";
import { getDashboardAnalytics } from "../services/analyticsService";
import DashboardStats from "../components/DashboardStats";
import ChartCard from "../components/ChartCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";
import UrgencyBadge from "../components/UrgencyBadge";

const Analytics = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
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
    fetchAnalytics();
  }, []);

  if (loading) {
    return <Loader text="Loading analytics..." />;
  }

  if (!dashboard) {
    return (
      <main className="min-h-[calc(100vh-76px)] bg-base p-6 md:p-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          <EmptyState title="Analytics unavailable" message="Please login as admin to view analytics data." />
        </div>
      </main>
    );
  }

  const summary = dashboard.summary || {};

  const stats = [
    {
      label: "Total Complaints",
      value: summary.totalComplaints || 0,
      icon: <ListChecks size={20} />,
    },
    {
      label: "Users",
      value: summary.totalUsers || 0,
      icon: <Users size={20} />,
    },
    {
      label: "High Priority",
      value: summary.totalHighPriority || 0,
      icon: <AlertTriangle size={20} />,
    },
    {
      label: "Resolved",
      value: `${summary.resolutionRate || 0}%`,
      icon: <CheckCircle2 size={20} />,
    },
    {
      label: "Duplicates",
      value: summary.totalDuplicates || 0,
      icon: <GitMerge size={20} />,
    },
    {
      label: "Departments",
      value: summary.totalDepartments || 0,
      icon: <BarChart3 size={20} />,
    },
  ];

  return (
    <main className="min-h-[calc(100vh-76px)] bg-base p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <section className="bg-white p-8 rounded-[10px] border border-border shadow-sm">
          <span className="text-[12px] font-bold text-structural-muted uppercase tracking-wider block mb-2">
            Admin Analytics
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-structural mb-2">
            Complaints Analytics
          </h1>
          <p className="text-[15px] text-structural-muted max-w-2xl">
            View category-wise, status-wise, department-wise, and priority-wise civic issue insights.
          </p>
        </section>

        {/* Top-Level Stats */}
        <DashboardStats stats={stats} />

        {/* Charts Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          <ChartCard title="Category Wise Complaints" data={dashboard.categoryWise} />
          <ChartCard title="Status Wise Complaints" data={dashboard.statusWise} type="pie" />
          <ChartCard title="Urgency Wise Complaints" data={dashboard.urgencyWise} />
          <ChartCard title="Department Wise Complaints" data={dashboard.departmentWise} />
        </section>

        {/* Recent Complaints Table */}
        <section className="bg-white rounded-[10px] border border-border shadow-sm overflow-hidden flex flex-col mt-8">
          <div className="p-6 border-b border-border bg-base/50">
            <h2 className="text-[15px] font-bold text-structural uppercase tracking-wider">Recent Complaints</h2>
          </div>

          {dashboard.recentComplaints?.length === 0 ? (
            <div className="p-8">
              <EmptyState title="No recent complaints" message="No complaints submitted yet." />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-base/30 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-[11px] font-bold text-structural-muted uppercase tracking-wider whitespace-nowrap">ID</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-structural-muted uppercase tracking-wider">Title</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-structural-muted uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-structural-muted uppercase tracking-wider">Urgency</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-structural-muted uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-structural-muted uppercase tracking-wider">Department</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {dashboard.recentComplaints?.map((complaint) => (
                    <tr key={complaint._id} className="hover:bg-base/50 transition-colors">
                      <td className="px-6 py-4 text-[13px] font-mono font-medium text-structural-muted whitespace-nowrap">
                        {complaint.complaintId}
                      </td>
                      <td className="px-6 py-4 text-[14px] font-bold text-structural max-w-[200px] truncate">
                        {complaint.title}
                      </td>
                      <td className="px-6 py-4 text-[13px] text-structural font-medium">
                        {complaint.category}
                      </td>
                      <td className="px-6 py-4">
                        <UrgencyBadge urgency={complaint.urgency} />
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={complaint.status} />
                      </td>
                      <td className="px-6 py-4 text-[13px] text-structural-muted">
                        {complaint.department || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </div>
    </main>
  );
};

export default Analytics