import { Link } from "react-router-dom";
import { Brain, CalendarDays, MapPin } from "lucide-react";
import StatusBadge from "./StatusBadge"; // Reusing the unified badge we built

const ComplaintCard = ({ complaint }) => {
  return (
    <article className="bg-white p-5 rounded-[10px] border border-border shadow-sm flex flex-col gap-4 transition-shadow hover:shadow-md">
      {/* Top Section */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <span className="text-[12px] font-bold text-structural-muted uppercase tracking-wider block mb-1">
            {complaint.complaintId}
          </span>
          <h3 className="text-[17px] font-bold text-structural leading-tight">
            {complaint.title}
          </h3>
        </div>
        <StatusBadge status={complaint.urgency} />
      </div>

      {/* Description */}
      <p className="text-sm text-structural-muted line-clamp-2">
        {complaint.description}
      </p>

      {/* Metadata Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-[13px] text-structural-muted bg-base p-3 rounded-[8px] border border-border/50">
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-structural" />
          <span className="truncate">{complaint.location?.address || "No address"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Brain size={14} className="text-structural" />
          <span>AI Score: <strong className="text-structural">{complaint.aiScore}/100</strong></span>
        </div>
        <div className="flex items-center gap-2 sm:col-span-2">
          <CalendarDays size={14} className="text-structural" />
          <span>{new Date(complaint.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex items-center justify-between pt-2 border-t border-border mt-auto">
        <StatusBadge status={complaint.status} />
        <Link 
          to={`/complaints/${complaint._id}`}
          className="text-[13px] font-semibold text-accent hover:text-accent-hover transition-colors"
        >
          View Details →
        </Link>
      </div>
    </article>
  );
};

export default ComplaintCard;