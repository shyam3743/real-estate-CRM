import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Handshake, Users, TrendingUp, Phone, Mail, Plus, Search } from "lucide-react";

export default function ChannelPartners() {
  const [partners] = useState([
    {
      id: 1,
      name: "Real Estate Solutions",
      contactPerson: "Rahul Sharma",
      phone: "+91 9876543210",
      email: "rahul@resolutions.com",
      commission: 2.5,
      dealsCompleted: 15,
      totalRevenue: 12500000,
      status: "Active",
      joinedDate: "2023-06-15"
    },
    {
      id: 2,
      name: "Property Advisors Ltd", 
      contactPerson: "Priya Gupta",
      phone: "+91 9876543211",
      email: "priya@propertyadvisors.com",
      commission: 3.0,
      dealsCompleted: 22,
      totalRevenue: 18700000,
      status: "Active",
      joinedDate: "2023-03-20"
    },
    {
      id: 3,
      name: "Dream Home Consultants",
      contactPerson: "Amit Kumar",
      phone: "+91 9876543212",
      email: "amit@dreamhome.com",
      commission: 2.0,
      dealsCompleted: 8,
      totalRevenue: 6200000,
      status: "Inactive",
      joinedDate: "2023-08-10"
    },
    {
      id: 4,
      name: "Elite Realty Partners",
      contactPerson: "Sunita Patel",
      phone: "+91 9876543213",
      email: "sunita@eliterealty.com",
      commission: 3.5,
      dealsCompleted: 31,
      totalRevenue: 28400000,
      status: "Active",
      joinedDate: "2023-01-05"
    }
  ]);

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const totalPartners = partners.length;
  const activePartners = partners.filter(p => p.status === 'Active').length;
  const totalDeals = partners.reduce((sum, partner) => sum + partner.dealsCompleted, 0);
  const totalRevenue = partners.reduce((sum, partner) => sum + partner.totalRevenue, 0);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Channel Partners</h1>
          <p className="text-gray-600">Manage and track channel partner performance</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Partner
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-4">
                <Handshake className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{totalPartners}</p>
                <p className="text-sm text-gray-600">Total Partners</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{activePartners}</p>
                <p className="text-sm text-gray-600">Active Partners</p>
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
                <p className="text-2xl font-bold text-purple-600">{totalDeals}</p>
                <p className="text-sm text-gray-600">Total Deals</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg mr-4">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">₹{(totalRevenue / 10000000).toFixed(1)}Cr</p>
                <p className="text-sm text-gray-600">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input placeholder="Search partners..." className="pl-10" />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Partner Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Commission Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ranges</SelectItem>
                <SelectItem value="low">0-2%</SelectItem>
                <SelectItem value="medium">2-3%</SelectItem>
                <SelectItem value="high">3%+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map((partner) => (
          <Card key={partner.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{partner.name}</CardTitle>
                <Badge className={getStatusColor(partner.status)}>
                  {partner.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{partner.contactPerson}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  {partner.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  {partner.email}
                </div>
                <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                  <div>
                    <p className="text-sm text-gray-500">Commission</p>
                    <p className="text-lg font-semibold text-blue-600">{partner.commission}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Deals</p>
                    <p className="text-lg font-semibold text-green-600">{partner.dealsCompleted}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Revenue Generated</p>
                  <p className="text-lg font-semibold text-purple-600">
                    ₹{(partner.totalRevenue / 100000).toFixed(1)}L
                  </p>
                </div>
                <div className="flex justify-between items-center pt-3">
                  <span className="text-xs text-gray-500">
                    Joined: {new Date(partner.joinedDate).toLocaleDateString()}
                  </span>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}