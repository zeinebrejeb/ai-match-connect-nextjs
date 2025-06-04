"use client"; 
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const SystemAnalytics = () => {
  // Mock data for charts
  const userGrowthData = [
    { month: "Jan", users: 120 },
    { month: "Feb", users: 180 },
    { month: "Mar", users: 240 },
    { month: "Apr", users: 320 },
    { month: "May", users: 450 },
    { month: "Jun", users: 580 }
  ];

  const applicationData = [
    { month: "Jan", applications: 45 },
    { month: "Feb", applications: 68 },
    { month: "Mar", applications: 92 },
    { month: "Apr", applications: 125 },
    { month: "May", applications: 180 },
    { month: "Jun", applications: 234 }
  ];

  const userTypeData = [
    { name: "Candidates", value: 875, color: "#8884d8" },
    { name: "Recruiters", value: 372, color: "#82ca9d" }
  ];

  const jobStatusData = [
    { status: "Active", count: 45 },
    { status: "Paused", count: 12 },
    { status: "Closed", count: 28 },
    { status: "Draft", count: 8 }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Monthly user registration trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        
        <Card>
          <CardHeader>
            <CardTitle>Job Applications</CardTitle>
            <CardDescription>Monthly application submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={applicationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="applications" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
            <CardDescription>Breakdown by user type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        
        <Card>
          <CardHeader>
            <CardTitle>Job Status Distribution</CardTitle>
            <CardDescription>Current status of all job postings</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={jobStatusData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="status" type="category" width={60} />
                <Tooltip />
                <Bar dataKey="count" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      
      <Card>
        <CardHeader>
          <CardTitle>System Health Metrics</CardTitle>
          <CardDescription>Key performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">99.9%</div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">1.2s</div>
              <div className="text-sm text-gray-600">Avg Response Time</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">67%</div>
              <div className="text-sm text-gray-600">Match Success Rate</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">4.8/5</div>
              <div className="text-sm text-gray-600">User Satisfaction</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemAnalytics;