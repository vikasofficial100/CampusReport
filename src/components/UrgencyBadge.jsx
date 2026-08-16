import { ShieldAlert } from "lucide-react";

const UrgencyBadge = ({ urgency }) => {
  const colorMap = {
    Low: "bg-structural/15 text-structural",
    Medium: "bg-status-amber/15 text-status-amber",
    High: "bg-error/15 text-error",
    Critical: "bg-error/20 text-error font-bold",
  };

  const styles = colorMap[urgency] || "bg-structural/15 text-structural";

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-[6px] text-[12px] font-semibold uppercase tracking-wide ${styles}`}>
      {(urgency === "High" || urgency === "Critical") && <ShieldAlert size={14} />}
      {urgency || "Medium"}
    </span>
  );
};

export default UrgencyBadge;