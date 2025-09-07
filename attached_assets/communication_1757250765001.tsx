import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Send, Phone, Mail, Calendar, Plus, Search } from "lucide-react";

export default function Communication() {
  const [communications] = useState([
    {
      id: 1,
      customerName: "John Doe",
      type: "Call",
      subject: "Follow-up on unit inquiry",
      content: "Discussed pricing options for 2BHK unit. Customer interested in seeing the property.",
      status: "Completed",
      priority: "Medium",
      date: "2024-01-20",
      assignedTo: "Sales Executive"
    },
    {
      id: 2,
      customerName: "Jane Smith",
      type: "Email",
      subject: "Payment schedule clarification",
      content: "Customer requested detailed payment schedule for Skyline Towers project.",
      status: "In Progress",
      priority: "High",
      date: "2024-01-22",
      assignedTo: "Sales Admin"
    },
    {
      id: 3,
      customerName: "Bob Johnson",
      type: "Meeting",
      subject: "Site visit appointment",
      content: "Scheduled site visit for Ocean View Apartments. Customer confirmed availability.",
      status: "Scheduled",
      priority: "High",
      date: "2024-01-25",
      assignedTo: "Project Manager"
    },
    {
      id: 4,
      customerName: "Alice Wilson",
      type: "SMS",
      subject: "Payment reminder",
      content: "Automated reminder sent for upcoming EMI payment due date.",
      status: "Sent",
      priority: "Low",
      date: "2024-01-18",
      assignedTo: "System"
    }
  ]);

  const [newCommunication, setNewCommunication] = useState({
    customer: '',
    type: '',
    subject: '',
    content: '',
    priority: 'Medium'
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'Sent': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Call': return <Phone className="w-4 h-4" />;
      case 'Email': return <Mail className="w-4 h-4" />;
      case 'Meeting': return <Calendar className="w-4 h-4" />;
      case 'SMS': return <MessageSquare className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Communication Center</h1>
          <p className="text-gray-600">Track and manage customer communications</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          New Communication
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Communication Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Quick Communication</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Customer</label>
              <Input placeholder="Enter customer name" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Type</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="call">Phone Call</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Subject</label>
              <Input placeholder="Communication subject" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Priority</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Content</label>
              <Textarea 
                placeholder="Enter communication details..." 
                className="h-24"
              />
            </div>
            <Button className="w-full">
              <Send className="w-4 h-4 mr-2" />
              Send Communication
            </Button>
          </CardContent>
        </Card>

        {/* Communications List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search and Filter */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input placeholder="Search communications..." className="pl-10" />
                </div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="call">Phone Call</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Communications List */}
          <div className="space-y-4">
            {communications.map((comm) => (
              <Card key={comm.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {getTypeIcon(comm.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{comm.subject}</h3>
                        <p className="text-sm text-gray-600">{comm.customerName}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityColor(comm.priority)}>
                        {comm.priority}
                      </Badge>
                      <Badge className={getStatusColor(comm.status)}>
                        {comm.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-3">{comm.content}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Assigned to: {comm.assignedTo}</span>
                    <span>{new Date(comm.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="outline" size="sm">View Details</Button>
                    <Button variant="outline" size="sm">Mark Complete</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}