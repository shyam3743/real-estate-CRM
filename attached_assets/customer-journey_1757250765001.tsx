import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Route, MapPin, Calendar, Users, ArrowRight, Phone, Mail } from "lucide-react";

export default function CustomerJourney() {
  const [customers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "+91 9876543210",
      project: "Green Valley Residency",
      currentStage: "Site Visit Completed",
      stageProgress: 70,
      nextAction: "Send Payment Schedule",
      lastActivity: "2024-01-25",
      assignedTo: "Sales Executive"
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+91 9876543211", 
      project: "Skyline Towers",
      currentStage: "Booking Confirmed",
      stageProgress: 85,
      nextAction: "Documentation Review",
      lastActivity: "2024-01-22",
      assignedTo: "Sales Admin"
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      phone: "+91 9876543212",
      project: "Ocean View Apartments",
      currentStage: "Initial Inquiry",
      stageProgress: 25,
      nextAction: "Schedule Site Visit",
      lastActivity: "2024-01-20",
      assignedTo: "Sales Executive"
    }
  ]);

  const journeyStages = [
    { name: "Lead Generation", progress: 10, color: "bg-blue-500" },
    { name: "Initial Contact", progress: 25, color: "bg-indigo-500" },
    { name: "Site Visit", progress: 50, color: "bg-purple-500" },
    { name: "Negotiation", progress: 70, color: "bg-pink-500" },
    { name: "Booking", progress: 85, color: "bg-red-500" },
    { name: "Documentation", progress: 95, color: "bg-orange-500" },
    { name: "Handover", progress: 100, color: "bg-green-500" }
  ];

  const getStageColor = (progress: number) => {
    if (progress >= 90) return "bg-green-100 text-green-800";
    if (progress >= 70) return "bg-blue-100 text-blue-800";
    if (progress >= 50) return "bg-purple-100 text-purple-800";
    if (progress >= 25) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Journey</h1>
          <p className="text-gray-600">Track customer progress through the sales pipeline</p>
        </div>
      </div>

      {/* Journey Stages Overview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Route className="w-5 h-5 mr-2" />
            Sales Journey Stages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {journeyStages.map((stage, index) => (
              <div key={index} className="text-center">
                <div className={`w-12 h-12 rounded-full ${stage.color} flex items-center justify-center text-white font-bold mx-auto mb-2`}>
                  {stage.progress}%
                </div>
                <p className="text-sm font-medium text-gray-900">{stage.name}</p>
                <p className="text-xs text-gray-500">Stage {index + 1}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customer Journey Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {customers.map((customer) => (
          <Card key={customer.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{customer.name}</CardTitle>
                <Badge className={getStageColor(customer.stageProgress)}>
                  {customer.stageProgress}% Complete
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{customer.project}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Contact Info */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    {customer.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {customer.phone}
                  </div>
                </div>

                {/* Current Stage */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Current Stage</p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-900">{customer.currentStage}</span>
                    <span className="text-sm font-medium text-blue-600">{customer.stageProgress}%</span>
                  </div>
                  <Progress value={customer.stageProgress} className="h-2" />
                </div>

                {/* Next Action */}
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-900">Next Action</p>
                      <p className="text-sm text-blue-700">{customer.nextAction}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-blue-600" />
                  </div>
                </div>

                {/* Activity Info */}
                <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Last Activity: {new Date(customer.lastActivity).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="w-4 h-4 mr-1" />
                  Assigned to: {customer.assignedTo}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-3">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button variant="default" size="sm" className="flex-1">
                    Update Stage
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