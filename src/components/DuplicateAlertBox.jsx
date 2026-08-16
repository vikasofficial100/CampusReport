import { GitMerge, Info } from "lucide-react";

const DuplicateAlertBox = ({ duplicate }) => {
  if (!duplicate || !duplicate.isDuplicate) {
    return null;
  }

  const original = duplicate.originalComplaint;

  return (
    <div className="bg-status-amber/10 border border-status-amber/30 p-5 rounded-[10px] flex flex-col sm:flex-row gap-4 items-start">
      <div className="bg-white p-2 rounded-[8px] text-status-amber shadow-sm border border-status-amber/20 flex-shrink-0">
        <GitMerge size={24} />
      </div>

      <div className="flex-1 text-structural">
        <h3 className="font-bold text-[16px] text-structural mb-1">
          Possible Duplicate Complaint Detected
        </h3>
        <p className="text-[14px] text-structural-muted mb-3">
          This issue looks similar to an existing complaint. Your report has been linked to increase priority weight.
        </p>

        {/* Duplicate Meta Stats */}
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="bg-white px-2.5 py-1 rounded-[6px] border border-status-amber/20 text-[12px] font-semibold text-status-amber shadow-sm">
            Similarity: {duplicate.similarityScore || 0}/100
          </span>
          <span className="bg-white px-2.5 py-1 rounded-[6px] border border-status-amber/20 text-[12px] font-semibold text-status-amber shadow-sm">
            Distance: {duplicate.distanceInMeters || 0}m
          </span>
          {original?.complaintId && (
            <span className="bg-white px-2.5 py-1 rounded-[6px] border border-status-amber/20 text-[12px] font-semibold text-structural shadow-sm">
              Original: {original.complaintId}
            </span>
          )}
        </div>

        {/* AI Reason */}
        {duplicate.reason && (
          <div className="flex items-start gap-1.5 text-[13px] text-structural-muted bg-white/50 p-2.5 rounded-[8px] border border-status-amber/10">
            <Info size={16} className="text-status-amber flex-shrink-0 mt-0.5" />
            <span>{duplicate.reason}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DuplicateAlertBox;