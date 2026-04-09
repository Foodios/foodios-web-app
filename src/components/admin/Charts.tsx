import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';

// Data for main AreaChart
const mainData = [
  { month: 'Jan', current: 15, previous: 20 },
  { month: 'Feb', current: 18, previous: 15 },
  { month: 'Mar', current: 12, previous: 22 },
  { month: 'Apr', current: 20, previous: 12 },
  { month: 'May', current: 15, previous: 14 },
  { month: 'Jun', current: 18, previous: 17 },
  { month: 'Jul', current: 24, previous: 15 },
];

const trafficData = [
  { name: 'Google', value: 80 },
  { name: 'YouTube', value: 30 },
  { name: 'Instagram', value: 100 },
  { name: 'Pinterest', value: 40 },
  { name: 'Facebook', value: 60 },
  { name: 'Twitter', value: 20 },
];

const deviceData = [
  { name: 'Linux', value: 20 },
  { name: 'Mac', value: 24 },
  { name: 'iOS', value: 20 },
  { name: 'Windows', value: 28 },
  { name: 'Android', value: 10 },
  { name: 'Other', value: 23 },
];

const locationData = [
  { name: 'United States', value: 38.6, color: '#000000' },
  { name: 'Canada', value: 22.5, color: '#C4EBA1' },
  { name: 'Mexico', value: 30.8, color: '#95A4FC' },
  { name: 'Other', value: 8.1, color: '#BAEDBD' },
];

interface UserGrowthChartProps {
  labels?: string[];
  onlineData?: number[];
  posData?: number[];
}

export function UserGrowthChart({ labels, onlineData, posData }: UserGrowthChartProps) {
  // Use provided data or fallback to mainData
  const chartData = labels && onlineData && posData 
    ? labels.map((label, index) => ({
        month: label,
        current: onlineData[index] || 0,
        previous: posData[index] || 0
      }))
    : mainData;

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#000000" stopOpacity={0.05}/>
              <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{fontSize: 12, fill: '#A3A3A3'}} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{fontSize: 12, fill: '#A3A3A3'}} 
            tickFormatter={(value) => value >= 1000000 ? `${(value/1000000).toFixed(1)}M` : value.toLocaleString()}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            formatter={(value: any) => [value.toLocaleString() + ' VND', '']}
          />
          <Area 
            type="monotone" 
            dataKey="current" 
            name="Online"
            stroke="#000000" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorCurrent)" 
          />
          <Area 
            type="monotone" 
            dataKey="previous" 
            name="POS"
            stroke="#A3A3A3" 
            strokeWidth={2}
            strokeDasharray="5 5"
            fill="transparent" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

interface TrafficByWebsiteProps {
  data?: { name: string; value: number }[];
}

export function TrafficByWebsite({ data }: TrafficByWebsiteProps) {
  const displayData = data || trafficData;
  return (
    <div className="flex flex-col gap-4">
      {displayData.map((item) => (
        <div key={item.name} className="flex items-center gap-4">
          <span className="w-16 text-[0.75rem] font-medium text-stone-500 whitespace-nowrap overflow-hidden text-ellipsis">{item.name}</span>
          <div className="flex-1 h-3 bg-stone-100 rounded-full overflow-hidden">
            <div 
              className={`h-full ${item.name === 'Instagram' || item.name === 'Facebook' ? 'bg-stone-900' : 'bg-stone-200'} transition-all`} 
              style={{ width: `${item.value}%` }} 
            />
          </div>
        </div>
      ))}
    </div>
  );
}

interface TrafficByDeviceProps {
  data?: { name: string; value: number }[];
}

export function TrafficByDevice({ data }: TrafficByDeviceProps) {
  const displayData = data || deviceData;
  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={displayData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#A3A3A3'}} />
          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#A3A3A3'}} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(1)}k` : v} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={24}>
            {displayData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#95A4FC' : '#BAEDBD'} fillOpacity={entry.name === 'iOS' || entry.name === 'Linux' ? 0.6 : 1} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface TrafficByLocationProps {
  data?: { name: string; value: number; color?: string }[];
}

export function TrafficByLocation({ data }: TrafficByLocationProps) {
  const displayData = data || locationData;
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="h-40 w-40">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={displayData}
              innerRadius={50}
              outerRadius={75}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {displayData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || ['#000000', '#C4EBA1', '#95A4FC', '#BAEDBD'][index % 4]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex-1 flex flex-col gap-3">
        {displayData.map((item, index) => (
          <div key={item.name} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color || ['#000000', '#C4EBA1', '#95A4FC', '#BAEDBD'][index % 4] }} />
              <span className="text-[0.75rem] font-medium text-stone-700">{item.name}</span>
            </div>
            <span className="text-[0.75rem] font-bold text-stone-900">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
interface OrderHealthChartProps {
  data?: { label: string; count: number; color?: string }[];
}

export function OrderHealthChart({ data }: OrderHealthChartProps) {
  if (!data) return null;
  
  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: -20, right: 20 }}>
          <XAxis type="number" hide />
          <YAxis 
            dataKey="label" 
            type="category" 
            axisLine={false} 
            tickLine={false} 
            tick={{fontSize: 11, fontWeight: 'bold', fill: '#78716c'}} 
            width={80}
          />
          <Tooltip 
            cursor={{fill: 'transparent'}}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || '#000'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
