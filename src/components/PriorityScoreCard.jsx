import { Brain, ShieldAlert } from "lucide-react";
import UrgencyBadge from "./UrgencyBadge";

const PriorityScoreCard = ({ analysis }) => {
  if (!analysis) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-[10px] border border-border shadow-sm flex flex-col">
      {/* Top Section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="text-[12px] font-bold text-structural-muted uppercase tracking-wider block mb-1">
            AI Priority Analysis
          </span>
          <h3 className="text-3xl font-bold text-structural">
            {analysis.aiScore}<span className="text-xl text-structural-muted font-medium">/100</span>
          </h3>
        </div>

        <div className="w-12 h-12 bg-structural/5 rounded-[10px] border border-border/50 flex items-center justify-center text-accent flex-shrink-0">
          <Brain size={24} />
        </div>
      </div>

      {/* Meta Rows */}
      <div className="space-y-3 mb-5">
        <div className="flex items-center justify-between pb-3 border-b border-border/50">
          <p className="text-[13px] font-medium text-structural-muted">Category</p>
          <strong className="text-[13px] font-bold text-structural">{analysis.category}</strong>
        </div>

        <div className="flex items-center justify-between pb-3 border-b border-border/50">
          <p className="text-[13px] font-medium text-structural-muted">Urgency</p>
          <UrgencyBadge urgency={analysis.urgency} />
        </div>

        <div className="flex items-center justify-between pb-2">
          <p className="text-[13px] font-medium text-structural-muted">Department</p>
          <strong className="text-[13px] font-bold text-structural">{analysis.department}</strong>
        </div>
      </div>

      {/* AI Reason Box */}
      <div className="flex items-start gap-2.5 p-3.5 bg-base border border-border/70 rounded-[8px] mt-auto">
        <ShieldAlert size={16} className="text-status-amber mt-0.5 flex-shrink-0" />
        <p className="text-[13px] text-structural-muted leading-relaxed">
          {analysis.aiReason}
        </p>
      </div>
    </div>
  );
};

export default PriorityScoreCard;