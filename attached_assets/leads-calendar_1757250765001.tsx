import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User, Phone, Video, Plus } from "lucide-react";

export default function LeadsCalendarPage() {
  const [selectedDate] = useState(new Date());
  const [appointments] = useState([
    {
      id: 1,
      title: "Site Visit - Green Valley Residency",
      client: "John Doe",
      time: "10:00 AM",
      duration: "1 hour",
      type: "Site Visit",
      location: "Green Valley Residency, Sector 45",
      assignedTo: "Sales Executive",
      status: "Confirmed",
      priority: "High"
    },
    {
      id: 2,
      title: "Follow-up Call - Skyline Towers",
      client: "Jane Smith",
      time: "2:00 PM",
      duration: "30 minutes",
      type: "Phone Call",
      location: "Remote",
      assignedTo: "Sales Admin",
      status: "Confirmed",
      priority: "Medium"
    },
    {
      id: 3,
      title: "Virtual Property Tour",
      client: "Bob Johnson",
      time: "4:00 PM",
      duration: "45 minutes",
      type: "Video Call",
      location: "Virtual",
      assignedTo: "Project Manager",
      status: "Pending",
      priority: "Low"
    },
    {
      id: 4,
      title: "Contract Discussion",
      client: "Alice Wilson",
      time: "6:00 PM",
      duration: "1.5 hours",
      type: "Meeting",
      location: "Office Conference Room",
      assignedTo: "Sales Director",
      status: "Confirmed",
      priority: "High"
    }
  ]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Site Visit': return <MapPin className="w-4 h-4" />;
      case 'Phone Call': return <Phone className="w-4 h-4" />;
      case 'Video Call': return <Video className="w-4 h-4" />;
      case 'Meeting': return <User className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
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

  const totalAppointments = appointments.length;
  const confirmedAppointments = appointments.filter(a => a.status === 'Confirmed').length;
  const pendingAppointments = appointments.filter(a => a.status === 'Pending').length;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads Calendar</h1>
          <p className="text-gray-600">
            Schedule and manage customer appointments - {selectedDate.toLocaleDateString()}
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Schedule Appointment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-4">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{totalAppointments}</p>
                <p className="text-sm text-gray-600">Today's Appointments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-4">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{confirmedAppointments}</p>
                <p className="text-sm text-gray-600">Confirmed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg mr-4">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">{pendingAppointments}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-4">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">85%</p>
                <p className="text-sm text-gray-600">Show Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-start p-4 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-lg mr-4 mt-1">
                      {getTypeIcon(appointment.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{appointment.title}</h3>
                          <p className="text-sm text-gray-600">{appointment.client}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getPriorityColor(appointment.priority)}>
                            {appointment.priority}
                          </Badge>
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {appointment.time} ({appointment.duration})
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {appointment.location}
                        </div>
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {appointment.assignedTo}
                        </div>
                        <div>
                          Type: {appointment.type}
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Reschedule
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calendar View */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Calendar widget would be rendered here</p>
                <Button variant="outline" size="sm">
                  View Full Calendar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Schedule Site Visit
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Phone className="w-4 h-4 mr-2" />
                Schedule Follow-up Call
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Video className="w-4 h-4 mr-2" />
                Schedule Video Tour
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <User className="w-4 h-4 mr-2" />
                Schedule Meeting
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}