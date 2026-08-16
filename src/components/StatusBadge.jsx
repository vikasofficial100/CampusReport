const badgeConfig = {
  critical: {
    label: "Critical",
    className: "bg-error/10 text-error border-error/20",
  },
  high: {
    label: "High",
    className: "bg-error/10 text-error border-error/20",
  },
  medium: {
    label: "Medium",
    className: "bg-status-amber/10 text-accent border-status-amber/20",
  },
  low: {
    label: "Low",
    className: "bg-status-green/10 text-status-green border-status-green/20",
  },
  submitted: {
    label: "Submitted",
    className: "bg-base-alt text-structural-muted border-border",
  },
  "in progress": {
    label: "In Progress",
    className: "bg-status-amber/10 text-accent border-status-amber/20",
  },
  resolved: {
    label: "Resolved",
    className: "bg-status-green/10 text-status-green border-status-green/20",
  },
  closed: {
    label: "Closed",
    className: "bg-base-alt text-structural-muted border-border",
  },
};

const fallbackBadge = {
  label: "Unknown",
  className: "bg-base-alt text-structural-muted border-border",
};

const StatusBadge = ({ status = "" }) => {
  const key = String(status).trim().toLowerCase();
  const config = badgeConfig[key] || fallbackBadge;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full border text-[12px] font-semibold leading-none ${config.className}`}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;
