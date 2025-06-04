"use client";
import React from "react"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserManagement from "@/components/admin/UserManagement";
import JobManagement from "@/components/admin/JobManagement";   
import SystemAnalytics from "@/components/admin/SystemAnalytics"; 
import { Users, Briefcase, BarChart3, Settings } from "lucide-react";

const AdminDashboard = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow pt-20 pb-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Admin Dashboard</h1> 
            <p className="text-gray-600 dark:text-gray-400 mt-2">Manage users, jobs, and system operations</p> 
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89</div>
                <p className="text-xs text-muted-foreground">+5% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Applications</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,345</div>
                <p className="text-xs text-muted-foreground">+23% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">67%</div>
                <p className="text-xs text-muted-foreground">+2% from last month</p>
              </CardContent>
            </Card>
          </div>

          
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="jobs">Job Management</TabsTrigger>
              <TabsTrigger value="analytics">System Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="mt-6">
              <UserManagement />
            </TabsContent>

            <TabsContent value="jobs" className="mt-6">
              <JobManagement />
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <SystemAnalytics />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;