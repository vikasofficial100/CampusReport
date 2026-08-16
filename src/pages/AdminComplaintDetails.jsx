import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Save, UserCircle, Brain } from "lucide-react";
import toast from "react-hot-toast";
import {
  getAdminComplaintDetails,
  getAdminDepartments,
  updateAdminComplaint,
} from "../services/adminPanelService"; 
import Loader from "../components/Loader"; 
import StatusBadge from "../components/StatusBadge"; 
import UrgencyBadge from "../components/UrgencyBadge"; 
import ComplaintTimeline from "../components/ComplaintTimeline"; 

const AdminComplaintDetails = () => {
  const { id } = useParams(); 

  const [complaint, setComplaint] = useState(null); 
  const [timeline, setTimeline] = useState([]); 
  const [departments, setDepartments] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [saving, setSaving] = useState(false); 

  const [formData, setFormData] = useState({
    status: "",
    category: "",
    urgency: "",
    aiScore: "",
    department: "",
    adminRemark: "",
  }); 

  const fetchData = async () => {
    try {
      const [complaintData, departmentData] = await Promise.all([
        getAdminComplaintDetails(id), 
        getAdminDepartments(), 
      ]);

      const current = complaintData.complaint; 

      setComplaint(current); 
      setTimeline(complaintData.timeline || []); 
      setDepartments(departmentData.departments || []); 

      setFormData({
        status: current.status || "",
        category: current.category || "",
        urgency: current.urgency || "",
        aiScore: current.aiScore || "",
        department: current.department || "",
        adminRemark: current.adminRemark || "",
      }); 
    } catch (error) {
      toast.error(error.message || "Failed to load complaint"); 
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchData(); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); 

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    })); 
  };

  const handleSave = async (event) => {
    event.preventDefault(); 
    setSaving(true); 

    try {
      const data = await updateAdminComplaint(id, formData); 
      setComplaint(data.complaint); 
      toast.success("Complaint updated"); 
      fetchData(); 
    } catch (error) {
      toast.error(error.message || "Update failed"); 
    } finally {
      setSaving(false); 
    }
  };

  if (loading) return <Loader text="Loading complaint management..." />; 

  if (!complaint) {
    return (
      <main className="min-h-[calc(100vh-76px)] bg-base p-6 md:p-12 flex items-center justify-center">
        <section className="bg-white p-8 md:p-12 rounded-[10px] border border-border shadow-sm text-center max-w-md w-full">
          <h1 className="text-2xl font-bold text-structural mb-8">Complaint not found</h1>
          <Link className="inline-flex items-center justify-center bg-structural/10 text-structural hover:bg-structural/20 font-bold text-[14px] px-6 py-3 rounded-[8px] transition-colors w-full" to="/admin/complaints">
            Back to Complaints
          </Link>
        </section>
      </main>
    ); 
  }

  return (
    <main className="min-h-[calc(100vh-76px)] bg-base p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Back Navigation */}
        <Link to="/admin/complaints" className="inline-flex items-center gap-2 text-[14px] font-bold text-structural-muted hover:text-structural transition-colors mb-8">
          <ArrowLeft size={16} />
          Back to All Complaints 
        </Link>

        {/* Hero Section */}
        <section className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
          <div>
            <span className="inline-block bg-structural/10 text-structural text-xs font-bold px-2.5 py-1 rounded-[6px] mb-4 font-mono">
              {complaint.complaintId} 
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-structural mb-4 leading-tight">
              {complaint.title} 
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={complaint.status} /> 
              <UrgencyBadge urgency={complaint.urgency} /> 
            </div>
          </div>

          <div className="bg-white border border-border p-5 rounded-[10px] shadow-sm flex items-center gap-4 min-w-[250px]">
            <div className="w-12 h-12 bg-structural/10 text-structural rounded-full flex items-center justify-center flex-shrink-0">
              <UserCircle size={28} /> 
            </div>
            <div className="flex flex-col">
              <strong className="text-[14px] text-structural">{complaint.reportedBy?.name || "Student"}</strong> 
              <span className="text-[12px] text-structural-muted">{complaint.reportedBy?.email}</span> 
              <span className="text-[12px] text-structural-muted">{complaint.reportedBy?.phone}</span> 
            </div>
          </div>
        </section>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (Left Column) */}
          <section className="lg:col-span-2 space-y-6">
            
            <div className="bg-white p-6 md:p-8 rounded-[10px] border border-border shadow-sm">
              <h2 className="text-[13px] font-bold text-structural uppercase tracking-wider mb-4 border-b border-border pb-3">Complaint Description</h2> 
              <p className="text-[15px] text-structural-muted leading-relaxed whitespace-pre-wrap">{complaint.description}</p> 
            </div>

            <div className="bg-structural/5 p-6 md:p-8 rounded-[10px] border border-border/50">
              <h2 className="flex items-center gap-2 text-[13px] font-bold text-structural uppercase tracking-wider mb-4 border-b border-border/50 pb-3">
                <Brain size={16} /> AI Analysis 
              </h2>
              <p className="text-[14px] text-structural-muted leading-relaxed mb-6">{complaint.aiReason}</p> 

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-[8px] border border-border shadow-sm flex flex-col items-center text-center">
                  <strong className="text-xl font-black text-structural mb-1">{complaint.aiScore}/100</strong> 
                  <span className="text-[11px] font-bold text-structural-muted uppercase tracking-wider">AI Score</span> 
                </div>
                <div className="bg-white p-4 rounded-[8px] border border-border shadow-sm flex flex-col items-center text-center">
                  <strong className="text-[14px] font-bold text-structural mb-1 truncate w-full">{complaint.category}</strong> 
                  <span className="text-[11px] font-bold text-structural-muted uppercase tracking-wider">Category</span> 
                </div>
                <div className="bg-white p-4 rounded-[8px] border border-border shadow-sm flex flex-col items-center text-center">
                  <strong className="text-[14px] font-bold text-structural mb-1 truncate w-full">{complaint.department || "-"}</strong> 
                  <span className="text-[11px] font-bold text-structural-muted uppercase tracking-wider">Department</span> 
                </div>
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-[10px] border border-border shadow-sm">
              <h2 className="text-[13px] font-bold text-structural uppercase tracking-wider mb-6 border-b border-border pb-3">Timeline</h2> 
              <div className="pl-2">
                <ComplaintTimeline timeline={timeline} /> 
              </div>
            </div>
          </section>

          {/* Sidebar Admin Form (Right Column) */}
          <aside className="bg-white p-6 md:p-8 rounded-[10px] border border-border shadow-sm h-fit">
            <h2 className="text-[15px] font-bold text-structural uppercase tracking-wider mb-6 border-b border-border pb-3">Admin Update Panel</h2> 

            <form onSubmit={handleSave} className="space-y-5">
              
              <div>
                <label className="block text-[12px] font-bold text-structural-muted uppercase tracking-wider mb-1.5">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2.5 bg-base border border-border rounded-[8px] text-sm text-structural focus:border-accent focus:outline-none appearance-none transition-colors">
                  <option value="Submitted">Submitted</option>
                  <option value="AI Analyzed">AI Analyzed</option>
                  <option value="Duplicate Checked">Duplicate Checked</option>
                  <option value="Assigned to Department">Assigned to Department</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Escalated">Escalated</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Closed">Closed</option>
                </select> 
              </div>

              <div>
                <label className="block text-[12px] font-bold text-structural-muted uppercase tracking-wider mb-1.5">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2.5 bg-base border border-border rounded-[8px] text-sm text-structural focus:border-accent focus:outline-none appearance-none transition-colors">
                  <option value="hostel">Hostel</option>
                  <option value="mess">Mess & Dining</option>
                  <option value="electrical">Electrical</option>
                  <option value="water_plumbing">Water & Plumbing</option>
                  <option value="civil_infrastructure">Civil & Infrastructure</option>
                  <option value="sanitation_waste">Sanitation & Waste</option>
                  <option value="security_safety">Security & Safety</option>
                  <option value="medical_health">Medical & Health</option>
                  <option value="it_internet">IT & Internet</option>
                  <option value="library">Library</option>
                  <option value="cse">Dept: Computer Science (CSE)</option>
                  <option value="ece">Dept: Electronics (ECE)</option>
                  <option value="ee">Dept: Electrical (EE)</option>
                  <option value="mechanical">Dept: Mechanical</option>
                  <option value="civil">Dept: Civil</option>
                  <option value="architecture">Dept: Architecture</option>
                  <option value="student_welfare">Student Welfare</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-structural-muted uppercase tracking-wider mb-1.5">Urgency</label>
                <select name="urgency" value={formData.urgency} onChange={handleChange} className="w-full p-2.5 bg-base border border-border rounded-[8px] text-sm text-structural focus:border-accent focus:outline-none appearance-none transition-colors">
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select> 
              </div>

              <div>
                <label className="block text-[12px] font-bold text-structural-muted uppercase tracking-wider mb-1.5">AI Score (Manual Override)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  name="aiScore"
                  value={formData.aiScore}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-base border border-border rounded-[8px] text-sm text-structural focus:border-accent focus:outline-none transition-colors"
                /> 
              </div>

              <div>
                <label className="block text-[12px] font-bold text-structural-muted uppercase tracking-wider mb-1.5">Assign Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-base border border-border rounded-[8px] text-sm text-structural focus:border-accent focus:outline-none appearance-none transition-colors"
                >
                  <option value="">Select Department</option>
                  {departments.map((department) => (
                    <option key={department._id} value={department.name}>
                      {department.name}
                    </option>
                  ))}
                </select> 
              </div>

              <div>
                <label className="block text-[12px] font-bold text-structural-muted uppercase tracking-wider mb-1.5">Admin Remark</label>
                <textarea
                  name="adminRemark"
                  placeholder="Add admin remark..."
                  value={formData.adminRemark}
                  onChange={handleChange}
                  rows="4"
                  className="w-full p-2.5 bg-base border border-border rounded-[8px] text-sm text-structural focus:border-accent focus:outline-none transition-colors"
                /> 
              </div>

              <div className="pt-4 border-t border-border">
                <button 
                  type="submit" 
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-accent text-white font-bold rounded-[8px] shadow-sm hover:bg-accent-hover transition-colors disabled:opacity-50"
                >
                  <Save size={18} />
                  {saving ? "Saving..." : "Save Changes"} 
                </button>
              </div>

            </form>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default AdminComplaintDetails; 