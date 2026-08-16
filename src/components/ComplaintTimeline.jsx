import { CheckCircle2, Clock } from "lucide-react";

const ComplaintTimeline = ({ timeline = [] }) => {
  if (!timeline.length) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4 text-center bg-base border-2 border-dashed border-border rounded-[10px]">
        <Clock size={28} className="text-structural-muted mb-3" />
        <p className="text-[14px] text-structural-muted">No timeline updates yet.</p>
      </div>
    );
  }

  return (
    <div className="relative pl-6 border-l-2 border-border/50 ml-3 space-y-6">
      {timeline.map((item, index) => (
        <div className="relative" key={item._id || index}>
          {/* Timeline Dot */}
          <div className="absolute -left-[35px] top-1 bg-white p-0.5 rounded-full text-accent">
            <CheckCircle2 size={20} className="fill-accent/10" />
          </div>

          {/* Timeline Content */}
          <div className="bg-white p-4 rounded-[10px] border border-border shadow-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-2">
              <h4 className="font-bold text-structural">{item.title}</h4>
              <span className="text-[12px] text-structural-muted font-medium bg-base px-2 py-0.5 rounded-[4px]">
                {new Date(item.createdAt).toLocaleString()}
              </span>
            </div>

            <p className="text-[14px] text-structural-muted mb-3">{item.message}</p>
            
            <div className="inline-block bg-structural/5 px-2.5 py-1 border border-border/50 rounded-[6px] text-[12px] font-semibold text-structural tracking-wide uppercase">
              Status: {item.status}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ComplaintTimeline;