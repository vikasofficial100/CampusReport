import { Inbox } from "lucide-react";

const EmptyState = ({
  title = "No data found",
  message = "There is nothing to show right now.",
  action = null,
  icon: Icon = Inbox,
}) => {
  return (
    <div className="w-full py-14 px-6 flex flex-col items-center justify-center text-center bg-base border-2 border-dashed border-border rounded-[10px]">
      <div className="w-14 h-14 bg-white border border-border rounded-full flex items-center justify-center text-structural-muted mb-4 shadow-sm">
        <Icon size={28} />
      </div>
      <h3 className="text-lg font-bold text-structural">{title}</h3>
      <p className="text-[14px] text-structural-muted mt-1.5 max-w-sm">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;