import * as React from "react";
import {
  Bar,
  Line,
  Pie,
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";

// Bar Chart Component
export const BarChart = ({
  data,
  className,
}: {
  data: any;
  className?: string;
}) => {
  const chartData = data.labels.map((label: string, i: number) => ({
    name: label,
    value: data.datasets[0].data[i],
  }));

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <ChartContainer className={className} config={{}}>
          <RechartsBarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="value"
              fill={data.datasets[0].backgroundColor[0] || "#8884d8"}
            />
          </RechartsBarChart>
        </ChartContainer>
      </ResponsiveContainer>
    </div>
  );
};

// Line Chart Component
export const LineChart = ({
  data,
  className,
}: {
  data: any;
  className?: string;
}) => {
  const chartData = data.labels.map((label: string, i: number) => ({
    name: label,
    value: data.datasets[0].data[i],
  }));

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <ChartContainer className={className} config={{}}>
          <RechartsLineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke={data.datasets[0].borderColor || "#8884d8"}
              fill={
                data.datasets[0].backgroundColor || "rgba(136, 132, 216, 0.1)"
              }
              fillOpacity={0.3}
            />
          </RechartsLineChart>
        </ChartContainer>
      </ResponsiveContainer>
    </div>
  );
};

// Pie Chart Component
export const PieChart = ({
  data,
  className,
}: {
  data: any;
  className?: string;
}) => {
  const chartData = data.labels.map((label: string, i: number) => ({
    name: label,
    value: data.datasets[0].data[i],
    fill: data.datasets[0].backgroundColor[i] || "#8884d8",
  }));

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <ChartContainer className={className} config={{}}>
          <RechartsPieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            />
            <Tooltip />
            <Legend />
          </RechartsPieChart>
        </ChartContainer>
      </ResponsiveContainer>
    </div>
  );
};
