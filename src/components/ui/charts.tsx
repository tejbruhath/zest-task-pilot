
import * as React from "react";
import {
  Bar,
  Line,
  Pie,
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  PieChart as RechartsPieChart,
  ResponsiveContainer
} from "recharts";
import {
  ChartContainer
} from "@/components/ui/chart";

// Bar Chart Component
export const BarChart = ({ 
  data, 
  className 
}: { 
  data: any;
  className?: string;
}) => {
  return (
    <ChartContainer className={className} config={{}}>
      <RechartsBarChart data={data.labels.map((label: string, i: number) => ({
        name: label,
        value: data.datasets[0].data[i]
      }))}>
        <Bar
          dataKey="value"
          fill={data.datasets[0].backgroundColor[0] || "#8884d8"}
        />
      </RechartsBarChart>
    </ChartContainer>
  );
};

// Line Chart Component
export const LineChart = ({ 
  data, 
  className 
}: { 
  data: any;
  className?: string;
}) => {
  return (
    <ChartContainer className={className} config={{}}>
      <RechartsLineChart data={data.labels.map((label: string, i: number) => ({
        name: label,
        value: data.datasets[0].data[i]
      }))}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={data.datasets[0].borderColor || "#8884d8"}
          fill={data.datasets[0].backgroundColor || "transparent"}
        />
      </RechartsLineChart>
    </ChartContainer>
  );
};

// Pie Chart Component
export const PieChart = ({ 
  data, 
  className 
}: { 
  data: any;
  className?: string;
}) => {
  return (
    <ChartContainer className={className} config={{}}>
      <RechartsPieChart>
        <Pie
          data={data.labels.map((label: string, i: number) => ({
            name: label,
            value: data.datasets[0].data[i],
            fill: data.datasets[0].backgroundColor[i] || "#8884d8"
          }))}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label={({ name, value }) => `${name}: ${value}`}
        />
      </RechartsPieChart>
    </ChartContainer>
  );
};
