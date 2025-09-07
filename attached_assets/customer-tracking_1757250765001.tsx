import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, Phone, Mail, Calendar, MapPin, TrendingUp } from "lucide-react";

export default function CustomerTracking() {
  const [customers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "+91 9876543210",
      project: "Green Valley Residency",
      unitNumber: "A-101",
      status: "Active",
      totalInteractions: 12,
      lastInteraction: "2024-01-25",
      source: "Website",
      assignedTo: "Sales Executive",
      value: 850000
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+91 9876543211",
      project: "Skyline Towers",
      unitNumber: "B-205",
      status: "Booked",
      totalInteractions: 18,
      lastInteraction: "2024-01-22",
      source: "Referral",
      assignedTo: "Sales Admin",
      value: 1200000
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      phone: "+91 9876543212",
      project: "Ocean View Apartments",
      unitNumber: "C-301",
      status: "Prospect",
      totalInteractions: 5,
      lastInteraction: "2024-01-20",
      source: "Social Media",
      assignedTo: "Sales Executive",
      value: 920000
    },
    {
      id: 4,
      name: "Alice Wilson",
      email: "alice@example.com",
      phone: "+91 9876543213",
      project: "Green Valley Residency",
      unitNumber: "A-405",
      status: "Converted",
      totalInteractions: 25,
      lastInteraction: "2024-01-18",
      source: "Walk-in",
      assignedTo: "Project Manager",
      value: 1150000
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-blue-100 text-blue-800';
      case 'Booked': return 'bg-purple-100 text-purple-800';
      case 'Converted': return 'bg-green-100 text-green-800';
      case 'Prospect': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'Active' || c.status === 'Booked').length;
  const convertedCustomers = customers.filter(c => c.status === 'Converted').length;
  const totalValue = customers.reduce((sum, customer) => sum + customer.value, 0);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Tracking</h1>
          <p className="text-gray-600">Monitor customer interactions and engagement</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-4">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{totalCustomers}</p>
                <p className="text-sm text-gray-600">Total Customers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg mr-4">
                <Eye className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">{activeCustomers}</p>
                <p className="text-sm text-gray-600">Active Prospects</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{convertedCustomers}</p>
                <p className="text-sm text-gray-600">Converted</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">₹{(totalValue / 10000000).toFixed(1)}Cr</p>
                <p className="text-sm text-gray-600">Pipeline Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input placeholder="Search customers..." className="pl-10" />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="booked">Booked</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="prospect">Prospect</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Filter by project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                <SelectItem value="green-valley">Green Valley Residency</SelectItem>
                <SelectItem value="skyline">Skyline Towers</SelectItem>
                <SelectItem value="ocean-view">Ocean View Apartments</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Lead source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
                <SelectItem value="social">Social Media</SelectItem>
                <SelectItem value="walkin">Walk-in</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-900">Customer</th>
                  <th className="text-left p-4 font-medium text-gray-900">Contact</th>
                  <th className="text-left p-4 font-medium text-gray-900">Project/Unit</th>
                  <th className="text-left p-4 font-medium text-gray-900">Status</th>
                  <th className="text-left p-4 font-medium text-gray-900">Interactions</th>
                  <th className="text-left p-4 font-medium text-gray-900">Value</th>
                  <th className="text-left p-4 font-medium text-gray-900">Source</th>
                  <th className="text-left p-4 font-medium text-gray-900">Assigned To</th>
                  <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-gray-900">{customer.name}</p>
                        <p className="text-sm text-gray-500">{customer.email}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-3 h-3 mr-1" />
                          {customer.phone}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="w-3 h-3 mr-1" />
                          {customer.email}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{customer.project}</p>
                        <p className="text-xs text-gray-500">{customer.unitNumber}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={getStatusColor(customer.status)}>
                        {customer.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-gray-900">{customer.totalInteractions}</p>
                        <p className="text-xs text-gray-500">Total contacts</p>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-gray-900">
                      ₹{(customer.value / 100000).toFixed(1)}L
                    </td>
                    <td className="p-4 text-gray-600">{customer.source}</td>
                    <td className="p-4 text-gray-600">{customer.assignedTo}</td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Phone className="w-3 h-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mail className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}