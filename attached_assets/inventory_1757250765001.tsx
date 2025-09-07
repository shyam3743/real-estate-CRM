import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Search, Filter, Home, Building } from "lucide-react";

export default function Inventory() {
  const [units] = useState([
    {
      id: 1,
      unitNumber: "A-101",
      project: "Green Valley Residency",
      tower: "Tower A",
      floor: 1,
      type: "2BHK",
      area: 1200,
      price: 8500000,
      status: "Available"
    },
    {
      id: 2,
      unitNumber: "B-205",
      project: "Skyline Towers", 
      tower: "Tower B",
      floor: 2,
      type: "3BHK",
      area: 1800,
      price: 12000000,
      status: "Blocked"
    },
    {
      id: 3,
      unitNumber: "C-301",
      project: "Ocean View Apartments",
      tower: "Tower C", 
      floor: 3,
      type: "2BHK",
      area: 1350,
      price: 9200000,
      status: "Sold"
    },
    {
      id: 4,
      unitNumber: "A-405",
      project: "Green Valley Residency",
      tower: "Tower A",
      floor: 4,
      type: "3BHK",
      area: 1650,
      price: 11500000,
      status: "Booked"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'Blocked': return 'bg-yellow-100 text-yellow-800';
      case 'Sold': return 'bg-blue-100 text-blue-800';
      case 'Booked': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Track and manage property units across all projects</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Package className="w-4 h-4 mr-2" />
          Add Unit
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-4">
                <Home className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">125</p>
                <p className="text-sm text-gray-600">Available Units</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-4">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">89</p>
                <p className="text-sm text-gray-600">Sold Units</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-4">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">23</p>
                <p className="text-sm text-gray-600">Booked Units</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg mr-4">
                <Filter className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">12</p>
                <p className="text-sm text-gray-600">Blocked Units</p>
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
              <Input placeholder="Search units..." className="pl-10" />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                <SelectItem value="green-valley">Green Valley Residency</SelectItem>
                <SelectItem value="skyline">Skyline Towers</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Unit Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="1bhk">1BHK</SelectItem>
                <SelectItem value="2bhk">2BHK</SelectItem>
                <SelectItem value="3bhk">3BHK</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="booked">Booked</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Units Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-900">Unit Number</th>
                  <th className="text-left p-4 font-medium text-gray-900">Project</th>
                  <th className="text-left p-4 font-medium text-gray-900">Tower/Floor</th>
                  <th className="text-left p-4 font-medium text-gray-900">Type</th>
                  <th className="text-left p-4 font-medium text-gray-900">Area (sq ft)</th>
                  <th className="text-left p-4 font-medium text-gray-900">Price</th>
                  <th className="text-left p-4 font-medium text-gray-900">Status</th>
                  <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {units.map((unit) => (
                  <tr key={unit.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900">{unit.unitNumber}</td>
                    <td className="p-4 text-gray-600">{unit.project}</td>
                    <td className="p-4 text-gray-600">{unit.tower} - Floor {unit.floor}</td>
                    <td className="p-4 text-gray-600">{unit.type}</td>
                    <td className="p-4 text-gray-600">{unit.area.toLocaleString()}</td>
                    <td className="p-4 text-gray-600">₹{(unit.price / 100000).toFixed(1)}L</td>
                    <td className="p-4">
                      <Badge className={getStatusColor(unit.status)}>
                        {unit.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">View</Button>
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