import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, PieChart } from '@/components/ui/charts';

const Statistics = () => {
  // Sample data for charts
  const tasksByPriorityData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        label: 'Tasks by Priority',
        data: [4, 8, 5],
        backgroundColor: ['#ea384c', '#f97316', '#0ea5e9'],
      },
    ],
  };

  const tasksByStatusData = {
    labels: ['Pending', 'In Progress', 'Completed'],
    datasets: [
      {
        label: 'Tasks by Status',
        data: [7, 3, 6],
        backgroundColor: ['#9b87f5', '#f97316', '#8B5CF6'],
      },
    ],
  };

  const tasksByWorkflowData = {
    labels: ['Productivity', 'Fitness', 'Grocery', 'Personal'],
    datasets: [
      {
        label: 'Tasks by Workflow',
        data: [7, 4, 2, 3],
        backgroundColor: ['#9b87f5', '#0ea5e9', '#f97316', '#8B5CF6'],
      },
    ],
  };

  const tasksCompletionTrendData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Tasks Completed',
        data: [2, 3, 5, 1, 4, 2, 3],
        borderColor: '#9b87f5',
        backgroundColor: 'rgba(155, 135, 245, 0.1)',
        fill: true,
      },
    ],
  };

  const productivityScoreData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Productivity Score',
        data: [65, 75, 90, 60, 85, 70, 75],
        borderColor: '#9b87f5',
        backgroundColor: 'rgba(155, 135, 245, 0.5)',
      },
    ],
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Statistics</h1>
      
      <Tabs defaultValue="weekly">
        <TabsList>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
        </TabsList>
        
        <TabsContent value="weekly" className="space-y-6 mt-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18</div>
                <p className="text-xs text-muted-foreground mt-1">
                  +5 from last week
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Completion Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.3 days</div>
                <p className="text-xs text-muted-foreground mt-1">
                  -0.5 days from last week
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Productivity Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  +8% from last week
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tasks by Status</CardTitle>
                <CardDescription>Current distribution of tasks by status</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart data={tasksByStatusData} className="h-80" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tasks by Priority</CardTitle>
                <CardDescription>Distribution of tasks by priority level</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart data={tasksByPriorityData} className="h-80" />
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Distribution</CardTitle>
                <CardDescription>Number of tasks in each workflow category</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart data={tasksByWorkflowData} className="h-80" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Productivity Score</CardTitle>
                <CardDescription>Daily productivity score for the week</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart data={productivityScoreData} className="h-80" />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Task Completion Trend</CardTitle>
              <CardDescription>Number of tasks completed each day this week</CardDescription>
            </CardHeader>
            <CardContent>
              <LineChart data={tasksCompletionTrendData} className="h-80" />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="monthly" className="mt-6">
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">Monthly statistics will be available in the next version</p>
          </div>
        </TabsContent>
        
        <TabsContent value="yearly" className="mt-6">
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">Yearly statistics will be available in the next version</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Statistics;
