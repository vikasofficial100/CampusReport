import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Updated to more muted, structural colors to match the design system
const chartColors = ["#3E4C5E", "#4C8C5B", "#D9822B", "#B3413E", "#5C7CFA", "#20C997"];

const normalizeData = (data = []) => {
  return data.map((item) => ({
    name: item._id || "Unknown",
    count: item.count || 0,
  }));
};

const ChartCard = ({ title, data = [], type = "bar" }) => {
  const chartData = normalizeData(data);

  return (
    <div className="bg-white p-6 rounded-[10px] border border-border shadow-sm flex flex-col h-full">
      <h3 className="text-lg font-bold text-structural mb-6">{title}</h3>

      {chartData.length === 0 ? (
        <div className="flex-grow flex items-center justify-center text-sm text-structural-muted">
          <p>No chart data available yet.</p>
        </div>
      ) : (
        <div className="flex-grow w-full h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            {type === "pie" ? (
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="count"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={chartColors[index % chartColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '10px', border: '1px solid #E3DED7', boxShadow: '0 2px 8px rgba(62, 76, 94, 0.08)' }}
                />
              </PieChart>
            ) : (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E3DED7" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#8A94A6" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#8A94A6" }} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#F5F3F0' }}
                  contentStyle={{ borderRadius: '10px', border: '1px solid #E3DED7', boxShadow: '0 2px 8px rgba(62, 76, 94, 0.08)' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={chartColors[index % chartColors.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ChartCard;