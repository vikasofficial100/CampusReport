import { useEffect, useState } from "react"; 
import { Link, useParams } from "react-router-dom"; 
import {
  ArrowLeft,
  Brain,
  Building2,
  CalendarDays,
  Image as ImageIcon,
  MapPin,
  UserCircle,
} from "lucide-react"; 
import { getComplaintById } from "../services/complaintService"; 
import Loader from "../components/Loader"; 
import StatusBadge from "../components/StatusBadge"; 
import UrgencyBadge from "../components/UrgencyBadge"; 
import ComplaintTimeline from "../components/ComplaintTimeline"; 
import FeedbackForm from "../components/FeedbackForm"; 

const ComplaintDetails = () => {
  const { id } = useParams(); 

  const [complaint, setComplaint] = useState(null); 
  const [timeline, setTimeline] = useState([]); 
  const [loading, setLoading] = useState(true); 

  const fetchComplaint = async () => {
    try {
      const data = await getComplaintById(id); 
      setComplaint(data.complaint); 
      setTimeline(data.timeline || []); 
    } catch (error) {
      console.error(error.message); 
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchComplaint(); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); 

  if (loading) {
    return <Loader text="Loading complaint details..." />; 
  }

  if (!complaint) {
    return (
      <main className="min-h-[calc(100vh-76px)] bg-base p-6 md:p-12 flex items-center justify-center">
        <section className="bg-white p-8 md:p-12 rounded-[10px] border border-border shadow-sm text-center max-w-md w-full">
          <h1 className="text-2xl font-bold text-structural mb-3">Complaint not found</h1>
          <p className="text-[14px] text-structural-muted mb-8">The complaint may not exist or you may not have access.</p>
          <Link className="inline-flex items-center justify-center bg-structural/10 text-structural hover:bg-structural/20 font-bold text-[14px] px-6 py-3 rounded-[8px] transition-colors w-full" to="/my-complaints">
            Back to My Complaints 
          </Link>
        </section>
      </main>
    ); 
  }

  return (
    <main className="min-h-[calc(100vh-76px)] bg-base p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Back Navigation */}
        <Link to="/my-complaints" className="inline-flex items-center gap-2 text-[14px] font-bold text-structural-muted hover:text-structural transition-colors mb-8">
          <ArrowLeft size={16} /> 
          Back to My Complaints 
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

          <div className="flex flex-col items-center justify-center bg-white border border-border p-4 rounded-[10px] shadow-sm min-w-[120px]">
            <Brain size={24} className="text-accent mb-2" /> 
            <small className="text-[11px] font-bold text-structural-muted uppercase tracking-wider mb-1">AI Score</small> 
            <strong className="text-xl font-black text-structural">{complaint.aiScore}/100</strong> 
          </div>
        </section>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (Left Column) */}
          <section className="lg:col-span-2 space-y-6">
            
            <div className="bg-white p-6 md:p-8 rounded-[10px] border border-border shadow-sm">
              <h2 className="text-[13px] font-bold text-structural uppercase tracking-wider mb-4 border-b border-border pb-3">Description</h2> 
              <p className="text-[15px] text-structural-muted leading-relaxed whitespace-pre-wrap">{complaint.description}</p> 
            </div>

            {complaint.aiReason && (
              <div className="bg-structural/5 p-6 md:p-8 rounded-[10px] border border-border/50">
                <h2 className="flex items-center gap-2 text-[13px] font-bold text-structural uppercase tracking-wider mb-4 border-b border-border/50 pb-3">
                  <Brain size={16} /> AI Reason 
                </h2>
                <p className="text-[14px] text-structural-muted leading-relaxed">{complaint.aiReason}</p> 
              </div>
            )}

            <div className="bg-white p-6 md:p-8 rounded-[10px] border border-border shadow-sm">
              <h2 className="text-[13px] font-bold text-structural uppercase tracking-wider mb-6 border-b border-border pb-3">Status Timeline</h2> 
              <div className="pl-2">
                <ComplaintTimeline timeline={timeline} /> 
              </div>
            </div>

            {/* Render Feedback Form if resolved/closed */}
            <div className="bg-white p-6 md:p-8 rounded-[10px] border border-border shadow-sm">
              <FeedbackForm complaint={complaint} onSuccess={fetchComplaint} /> 
            </div>
            
          </section>

          {/* Sidebar Metadata (Right Column) */}
          <aside className="space-y-6">
            
            <div className="bg-white p-6 rounded-[10px] border border-border shadow-sm space-y-5">
              <h3 className="text-[13px] font-bold text-structural uppercase tracking-wider border-b border-border pb-3">Complaint Info</h3> 

              <div className="flex items-start gap-3">
                <Building2 size={18} className="text-structural-muted flex-shrink-0 mt-0.5" /> 
                <div>
                  <span className="block text-[11px] font-bold text-structural-muted uppercase tracking-wider mb-0.5">Department</span>
                  <span className="text-[14px] font-semibold text-structural">{complaint.department}</span> 
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-structural-muted flex-shrink-0 mt-0.5" /> 
                <div>
                  <span className="block text-[11px] font-bold text-structural-muted uppercase tracking-wider mb-0.5">Location</span>
                  <span className="text-[14px] font-semibold text-structural leading-snug block">{complaint.location?.address}</span> 
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CalendarDays size={18} className="text-structural-muted flex-shrink-0 mt-0.5" /> 
                <div>
                  <span className="block text-[11px] font-bold text-structural-muted uppercase tracking-wider mb-0.5">Reported On</span>
                  <span className="text-[14px] font-semibold text-structural">{new Date(complaint.createdAt).toLocaleString()}</span> 
                </div>
              </div>

              <div className="flex items-start gap-3">
                <UserCircle size={18} className="text-structural-muted flex-shrink-0 mt-0.5" /> 
                <div>
                  <span className="block text-[11px] font-bold text-structural-muted uppercase tracking-wider mb-0.5">Reported By</span>
                  <span className="text-[14px] font-semibold text-structural">{complaint.reportedBy?.name || "Citizen"}</span> 
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[10px] border border-border shadow-sm">
              <h3 className="text-[13px] font-bold text-structural uppercase tracking-wider border-b border-border pb-3 mb-4">Category</h3> 
              <span className="inline-block bg-base border border-border text-structural text-[13px] font-bold px-3 py-1.5 rounded-[6px]">
                {complaint.category} 
              </span>
            </div>

            <div className="bg-white p-6 rounded-[10px] border border-border shadow-sm">
              <h3 className="text-[13px] font-bold text-structural uppercase tracking-wider border-b border-border pb-3 mb-4">Complaint Image</h3> 

              {complaint.imageUrl ? ( 
                <a href={complaint.imageUrl} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-[8px] border border-border hover:opacity-90 transition-opacity">
                  <img
                    className="w-full h-auto object-cover max-h-48"
                    src={complaint.imageUrl} 
                    alt={complaint.title} 
                  />
                </a>
              ) : (
                <div className="w-full py-8 bg-base border border-border border-dashed rounded-[8px] flex flex-col items-center justify-center text-structural-muted">
                  <ImageIcon size={24} className="mb-2 opacity-50" /> 
                  <p className="text-[13px] font-medium">No image added</p> 
                </div>
              )}
            </div>

          </aside>
        </div>
      </div>
    </main>
  );
};

export default ComplaintDetails; 