import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Settings, Users, Building, Database, Activity } from "lucide-react";

export default function MasterAdmin() {
  const [systemStats] = useState({
    totalUsers: 156,
    activeDevelopers: 12,
    totalProjects: 34,
    systemUptime: "99.8%",
    monthlyRevenue: 45600000,
    activeLeads: 1247
  });

  const [recentActivities] = useState([
    { id: 1, action: "New developer approved", user: "Sunshine Builders", time: "2 hours ago" },
    { id: 2, action: "System backup completed", user: "System", time: "4 hours ago" },
    { id: 3, action: "User role updated", user: "John Executive", time: "6 hours ago" },
    { id: 4, action: "Database migration completed", user: "System", time: "1 day ago" }
  ]);

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Shield className="w-8 h-8 text-red-600 mr-3" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Master Administration</h1>
          <p className="text-gray-600">System-wide administration and oversight</p>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-blue-600">{systemStats.totalUsers}</p>
                <p className="text-xs text-gray-600">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <Building className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-purple-600">{systemStats.activeDevelopers}</p>
                <p className="text-xs text-gray-600">Developers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <Building className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-green-600">{systemStats.totalProjects}</p>
                <p className="text-xs text-gray-600">Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                <Activity className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-yellow-600">{systemStats.systemUptime}</p>
                <p className="text-xs text-gray-600">Uptime</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                <Database className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-indigo-600">₹{(systemStats.monthlyRevenue / 10000000).toFixed(1)}Cr</p>
                <p className="text-xs text-gray-600">Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg mr-3">
                <Users className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-red-600">{systemStats.activeLeads}</p>
                <p className="text-xs text-gray-600">Active Leads</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Master Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Master Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start bg-red-600 hover:bg-red-700">
              <Shield className="w-4 h-4 mr-2" />
              System Configuration
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Database className="w-4 h-4 mr-2" />
              Database Management
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Global User Permissions
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Building className="w-4 h-4 mr-2" />
              Developer Oversight
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Activity className="w-4 h-4 mr-2" />
              System Monitoring
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Recent System Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.user}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>System Health Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Database className="w-8 h-8 text-green-600" />
              </div>
              <p className="font-medium text-gray-900">Database</p>
              <Badge className="bg-green-100 text-green-800">Healthy</Badge>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Activity className="w-8 h-8 text-green-600" />
              </div>
              <p className="font-medium text-gray-900">API Services</p>
              <Badge className="bg-green-100 text-green-800">Online</Badge>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Settings className="w-8 h-8 text-yellow-600" />
              </div>
              <p className="font-medium text-gray-900">Background Jobs</p>
              <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <p className="font-medium text-gray-900">Security</p>
              <Badge className="bg-green-100 text-green-800">Secure</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}