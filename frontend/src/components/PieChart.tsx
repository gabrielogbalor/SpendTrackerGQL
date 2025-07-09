import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
  } from 'recharts';
  
  interface CategoryStat {
    category: string;
    totalAmount: number;
  }
  
  interface Props {
    data: CategoryStat[];
  }
  
  const COLORS = ['#F59E0B', '#3B82F6', '#EF4444', '#60A5FA', '#10B981', '#8B5CF6'];
  
  const CategoryPieChart: React.FC<Props> = ({ data }) => {
    const total = data.reduce((sum, d) => sum + d.totalAmount, 0);
  
    return (
      <div className="h-[380px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="totalAmount"
              nameKey="category"
              cx="50%"
              cy="45%"
              innerRadius="60%"
              outerRadius="80%"
              paddingAngle={3}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [
                `$${value.toLocaleString()}`,
                name,
              ]}
            />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              iconType="square"
              wrapperStyle={{ fontSize: '14px', marginTop: '12px' }}
            />
            {/* Center total label */}
            <text
              x="50%"
              y="45%"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                fontSize: '20px',
                fontWeight: 'bold',
                fill: '#111827',
              }}
            >
              ${total.toLocaleString()}
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  export default CategoryPieChart;
  