const DashboardStats = ({ stats = [] }) => {
  if (!stats.length) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((item, index) => (
        <div 
          className="bg-white p-5 rounded-[10px] border border-border shadow-sm flex items-center gap-4 transition-colors hover:border-structural/20 hover:shadow-md" 
          key={item.label || index}
        >
          <div className="w-12 h-12 flex-shrink-0 bg-structural/10 rounded-[10px] flex items-center justify-center text-structural">
            {item.icon}
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-structural leading-none mb-1">
              {item.value}
            </span>
            <span className="text-[12px] font-bold text-structural-muted uppercase tracking-wider">
              {item.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
