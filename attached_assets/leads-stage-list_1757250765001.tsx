import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Search, Filter, Phone, Mail, Calendar, User } from "lucide-react";
import { useRoute } from "wouter";

export default function LeadsStageList() {
  const [, params] = useRoute("/leads/stage/:stage");
  const stage = params?.stage || "new";
  
  const [leads] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "+91 9876543210",
      project: "Green Valley Residency",
      source: "Website",
      value: 850000,
      assignedTo: "Sales Executive",
      lastActivity: "2024-01-25",
      stage: "new",
      priority: "High"
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+91 9876543211",
      project: "Skyline Towers",
      source: "Referral",
      value: 1200000,
      assignedTo: "Sales Admin",
      lastActivity: "2024-01-22",
      stage: "contacted",
      priority: "Medium"
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      phone: "+91 9876543212",
      project: "Ocean View Apartments",
      source: "Social Media",
      value: 920000,
      assignedTo: "Sales Executive",
      lastActivity: "2024-01-20",
      stage: "qualified",
      priority: "Low"
    }
  ]);

  const getStageTitle = (stage: string) => {
    switch (stage) {
      case 'new': return 'New Leads';
      case 'contacted': return 'Contacted Leads';
      case 'qualified': return 'Qualified Leads';
      case 'proposal': return 'Proposal Sent';
      case 'negotiation': return 'In Negotiation';
      case 'closed': return 'Closed Deals';
      default: return 'Leads';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredLeads = leads.filter(lead => lead.stage === stage);

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" className="mr-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Pipeline
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{getStageTitle(stage)}</h1>
          <p className="text-gray-600">{filteredLeads.length} leads in this stage</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input placeholder="Search leads..." className="pl-10" />
            </div>
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
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Assigned to" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                <SelectItem value="sales-executive">Sales Executive</SelectItem>
                <SelectItem value="sales-admin">Sales Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Leads Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredLeads.map((lead) => (
          <Card key={lead.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{lead.name}</CardTitle>
                <Badge className={getPriorityColor(lead.priority)}>
                  {lead.priority}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{lead.project}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Contact Info */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    {lead.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {lead.phone}
                  </div>
                </div>

                {/* Lead Details */}
                <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                  <div>
                    <p className="text-sm text-gray-500">Value</p>
                    <p className="font-semibold text-green-600">
                      ₹{(lead.value / 100000).toFixed(1)}L
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Source</p>
                    <p className="font-semibold text-gray-900">{lead.source}</p>
                  </div>
                </div>

                {/* Assignment & Activity */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-2" />
                    Assigned to: {lead.assignedTo}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Last activity: {new Date(lead.lastActivity).toLocaleDateString()}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-3">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Phone className="w-3 h-3 mr-1" />
                    Call
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Mail className="w-3 h-3 mr-1" />
                    Email
                  </Button>
                  <Button variant="default" size="sm" className="flex-1">
                    Move Stage
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLeads.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No leads in {getStageTitle(stage).toLowerCase()}
            </h3>
            <p className="text-gray-600 mb-4">
              There are currently no leads in this stage. New leads will appear here as they progress through the pipeline.
            </p>
            <Button variant="outline">
              View All Leads
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}