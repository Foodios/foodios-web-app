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

export function UserGrowthChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={mainData}>
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
            tickFormatter={(value) => `${value}M`}
          />
          <Tooltip />
          <Area 
            type="monotone" 
            dataKey="current" 
            stroke="#000000" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorCurrent)" 
          />
          <Area 
            type="monotone" 
            dataKey="previous" 
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

export function TrafficByWebsite() {
  return (
    <div className="flex flex-col gap-4">
      {trafficData.map((item) => (
        <div key={item.name} className="flex items-center gap-4">
          <span className="w-16 text-[0.75rem] font-medium text-stone-500">{item.name}</span>
          <div className="flex-1 h-3 bg-stone-100 rounded-full overflow-hidden">
            <div 
              className={`h-full ${item.name === 'Instagram' ? 'bg-stone-900' : 'bg-stone-200'} transition-all`} 
              style={{ width: `${item.value}%` }} 
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TrafficByDevice() {
  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={deviceData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#A3A3A3'}} />
          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#A3A3A3'}} tickFormatter={(v) => `${v}M`} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={24}>
            {deviceData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#95A4FC' : '#BAEDBD'} fillOpacity={entry.name === 'iOS' || entry.name === 'Linux' ? 0.6 : 1} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TrafficByLocation() {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="h-40 w-40">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={locationData}
              innerRadius={50}
              outerRadius={75}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {locationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex-1 flex flex-col gap-3">
        {locationData.map((item) => (
          <div key={item.name} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[0.75rem] font-medium text-stone-700">{item.name}</span>
            </div>
            <span className="text-[0.75rem] font-bold text-stone-900">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
