import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, Search, Phone, Mail, MessageSquare, Calendar, Video, 
  Clock, CheckCircle, Users, Filter 
} from "lucide-react";
import { Communication, Lead } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Communications() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddCommunicationOpen, setIsAddCommunicationOpen] = useState(false);

  const { data: communications = [], isLoading } = useQuery<Communication[]>({
    queryKey: ["/api/communications/recent", { limit: 100 }],
  });

  const { data: leads = [] } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
  });

  const filteredCommunications = communications.filter((comm) => {
    const matchesSearch = comm.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         comm.content?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || comm.type === typeFilter;
    const matchesStatus = statusFilter === "all" || comm.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "call": return <Phone className="w-4 h-4" />;
      case "email": return <Mail className="w-4 h-4" />;
      case "sms": return <MessageSquare className="w-4 h-4" />;
      case "meeting": return <Users className="w-4 h-4" />;
      case "site_visit": return <Calendar className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "call": return "bg-green-100 text-green-800";
      case "email": return "bg-blue-100 text-blue-800";
      case "sms": return "bg-purple-100 text-purple-800";
      case "meeting": return "bg-orange-100 text-orange-800";
      case "site_visit": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "scheduled": return "bg-blue-100 text-blue-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDuration = (duration: number | null) => {
    if (!duration) return "N/A";
    if (duration < 60) return `${duration}m`;
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h ${minutes}m`;
  };

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading communications...</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalCommunications = communications.length;
  const callsCount = communications.filter(c => c.type === 'call').length;
  const emailsCount = communications.filter(c => c.type === 'email').length;
  const meetingsCount = communications.filter(c => c.type === 'meeting' || c.type === 'site_visit').length;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <Header title="Communication Center" description="Manage all customer communications and interactions" />
        
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600" data-testid="stat-total-communications">
                      {totalCommunications}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Communications</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600" data-testid="stat-calls">
                      {callsCount}
                    </p>
                    <p className="text-sm text-muted-foreground">Phone Calls</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg mr-3">
                    <Mail className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600" data-testid="stat-emails">
                      {emailsCount}
                    </p>
                    <p className="text-sm text-muted-foreground">Emails</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg mr-3">
                    <Users className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-600" data-testid="stat-meetings">
                      {meetingsCount}
                    </p>
                    <p className="text-sm text-muted-foreground">Meetings</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button className="h-16 flex-col gap-2 bg-green-600 hover:bg-green-700" data-testid="button-quick-call">
              <Phone className="w-6 h-6" />
              <span>Quick Call</span>
            </Button>
            <Button className="h-16 flex-col gap-2 bg-blue-600 hover:bg-blue-700" data-testid="button-compose-email">
              <Mail className="w-6 h-6" />
              <span>Compose Email</span>
            </Button>
            <Button className="h-16 flex-col gap-2 bg-purple-600 hover:bg-purple-700" data-testid="button-send-sms">
              <MessageSquare className="w-6 h-6" />
              <span>Send SMS</span>
            </Button>
            <Button className="h-16 flex-col gap-2 bg-orange-600 hover:bg-orange-700" data-testid="button-schedule-meeting">
              <Calendar className="w-6 h-6" />
              <span>Schedule Meeting</span>
            </Button>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search communications..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    data-testid="input-search-communications"
                  />
                </div>
                
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-48" data-testid="select-type-filter">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="call">Phone Calls</SelectItem>
                    <SelectItem value="email">Emails</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="meeting">Meetings</SelectItem>
                    <SelectItem value="site_visit">Site Visits</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48" data-testid="select-status-filter">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" data-testid="button-add-communication">
                  <Plus className="w-4 h-4 mr-2" />
                  Log Communication
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Communications Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Communication History ({filteredCommunications.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredCommunications.length > 0 ? (
                <div className="space-y-4">
                  {filteredCommunications.map((comm) => (
                    <div key={comm.id} className="flex items-start space-x-4 p-4 bg-background rounded-lg border" data-testid={`communication-${comm.id}`}>
                      <div className={`p-2 rounded-lg ${getTypeColor(comm.type)}`}>
                        {getTypeIcon(comm.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-foreground truncate">
                            {comm.subject || `${comm.type.charAt(0).toUpperCase() + comm.type.slice(1)} Communication`}
                          </h4>
                          <Badge className={getStatusColor(comm.status || "completed")}>
                            {comm.status || "completed"}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">
                          {comm.content || "No additional details provided"}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {comm.completedAt ? new Date(comm.completedAt).toLocaleString() : 
                             comm.scheduledAt ? new Date(comm.scheduledAt).toLocaleString() :
                             new Date(comm.createdAt!).toLocaleString()}
                          </span>
                          {comm.duration && (
                            <span>Duration: {formatDuration(comm.duration)}</span>
                          )}
                          <span>Lead ID: {comm.leadId.substring(0, 8)}...</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" data-testid={`button-view-communication-${comm.id}`}>
                          <CheckCircle className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8" data-testid="no-communications-message">
                  <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No Communications Found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery || typeFilter !== "all" || statusFilter !== "all" 
                      ? "No communications match your current filters." 
                      : "Start communicating with your leads and customers to see the history here."}
                  </p>
                  <Button data-testid="button-start-communication">
                    <Plus className="w-4 h-4 mr-2" />
                    Log First Communication
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Communication Templates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" data-testid="template-follow-up">
                    <Mail className="w-4 h-4 mr-2" />
                    Follow-up Email Template
                  </Button>
                  <Button variant="outline" className="w-full justify-start" data-testid="template-site-visit">
                    <Calendar className="w-4 h-4 mr-2" />
                    Site Visit Confirmation
                  </Button>
                  <Button variant="outline" className="w-full justify-start" data-testid="template-payment-reminder">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Payment Reminder SMS
                  </Button>
                  <Button variant="outline" className="w-full justify-start" data-testid="template-welcome">
                    <Phone className="w-4 h-4 mr-2" />
                    Welcome Call Script
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Communication Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-600 rounded"></div>
                      <span className="font-medium">Calls</span>
                    </div>
                    <span className="text-sm font-medium">{callsCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-600 rounded"></div>
                      <span className="font-medium">Emails</span>
                    </div>
                    <span className="text-sm font-medium">{emailsCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-600 rounded"></div>
                      <span className="font-medium">SMS</span>
                    </div>
                    <span className="text-sm font-medium">
                      {communications.filter(c => c.type === 'sms').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-orange-600 rounded"></div>
                      <span className="font-medium">Meetings</span>
                    </div>
                    <span className="text-sm font-medium">{meetingsCount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
