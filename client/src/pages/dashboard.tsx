import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { MetricsCard } from "@/components/metrics-card";
import { PipelineStage } from "@/components/pipeline-stage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users, DollarSign, TrendingUp, Building, UserPlus, Calendar, 
  Phone, Mail, MessageSquare, Check, Clock, Award
} from "lucide-react";
import { Lead } from "@shared/schema";

interface DashboardMetrics {
  totalLeads: number;
  monthlyRevenue: string;
  conversionRate: number;
  activeProjects: number;
  leadsByStatus: { status: string; count: number }[];
  leadsBySource: { source: string; count: number }[];
  topPerformers: { userId: string; userName: string; sales: string; deals: number }[];
}

export default function Dashboard() {
  const { data: metrics, isLoading: metricsLoading } = useQuery<DashboardMetrics>({
    queryKey: ["/api/dashboard/metrics"],
  });

  const { data: leads = [], isLoading: leadsLoading } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
  });

  const { data: communications = [] } = useQuery({
    queryKey: ["/api/communications/recent"],
  });

  if (metricsLoading || leadsLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Group leads by status for pipeline
  const leadsByStatus = leads.reduce((acc, lead) => {
    const status = lead.status || "new";
    if (!acc[status]) acc[status] = [];
    acc[status].push(lead);
    return acc;
  }, {} as Record<string, Lead[]>);

  const pipelineStages = [
    { title: "New", status: "new", badgeVariant: "default" as const },
    { title: "Contacted", status: "contacted", badgeVariant: "secondary" as const },
    { title: "Site Visit", status: "site_visit", badgeVariant: "outline" as const },
    { title: "Negotiation", status: "negotiation", badgeVariant: "secondary" as const },
    { title: "Booking", status: "booking", badgeVariant: "default" as const },
    { title: "Sold", status: "sold", badgeVariant: "default" as const },
  ];

  const mockActivities = [
    { id: 1, type: "site_visit", message: "Site visit completed for Rajesh Kumar", project: "Green Valley Residency", time: "2 hours ago" },
    { id: 2, type: "lead", message: "New lead added by John Smith", details: "Priya Sharma", time: "4 hours ago" },
    { id: 3, type: "payment", message: "Payment received from Anjali Mehta", amount: "₹25L booking amount", time: "6 hours ago" },
    { id: 4, type: "follow_up", message: "Follow-up call scheduled with Amit Patel", details: "Tomorrow 2:00 PM", time: "8 hours ago" },
    { id: 5, type: "contract", message: "Contract signed by Vikram Gupta", project: "Skyline Towers Unit B-205", time: "Yesterday" },
  ];

  const mockSchedule = [
    { id: 1, time: "10:00 AM", title: "Site Visit - Vikram Gupta", location: "Skyline Towers, Downtown Mumbai", duration: "1 hour" },
    { id: 2, time: "02:00 PM", title: "Follow-up Call - Amit Patel", details: "Negotiation discussion for Ocean View", duration: "30 minutes" },
    { id: 3, time: "04:30 PM", title: "Contract Meeting - Ravi Krishnan", details: "Final documentation for Ocean View purchase", duration: "2 hours" },
  ];

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(1)}Cr`;
    } else if (num >= 100000) {
      return `₹${(num / 100000).toFixed(1)}L`;
    } else {
      return `₹${num.toLocaleString()}`;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <Header 
          title="Sales Dashboard" 
          description="Real-time insights and performance metrics"
          showLiveBadge 
        />
        
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricsCard
              title="Total Leads"
              value={metrics?.totalLeads || 0}
              change="+12.5% from last month"
              changeType="positive"
              icon={Users}
              iconColor="text-blue-600"
              iconBgColor="bg-blue-100"
            />
            <MetricsCard
              title="Monthly Revenue"
              value={formatCurrency(metrics?.monthlyRevenue || 0)}
              change="+8.3% from last month"
              changeType="positive"
              icon={DollarSign}
              iconColor="text-green-600"
              iconBgColor="bg-green-100"
            />
            <MetricsCard
              title="Conversion Rate"
              value={`${metrics?.conversionRate || 0}%`}
              change="+2.1% from last month"
              changeType="positive"
              icon={TrendingUp}
              iconColor="text-purple-600"
              iconBgColor="bg-purple-100"
            />
            <MetricsCard
              title="Active Projects"
              value={metrics?.activeProjects || 0}
              subtitle="3 new this month"
              icon={Building}
              iconColor="text-orange-600"
              iconBgColor="bg-orange-100"
            />
          </div>

          {/* Sales Pipeline */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Sales Pipeline</CardTitle>
                <div className="flex space-x-2">
                  <Button data-testid="button-add-lead">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Lead
                  </Button>
                  <Button variant="outline" data-testid="button-filter-pipeline">
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                {pipelineStages.map((stage) => (
                  <PipelineStage
                    key={stage.status}
                    title={stage.title}
                    count={leadsByStatus[stage.status]?.length || 0}
                    leads={leadsByStatus[stage.status]?.slice(0, 3) || []}
                    badgeVariant={stage.badgeVariant}
                    onLeadClick={(lead) => console.log("Lead clicked:", lead)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities & Communication Center */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === "site_visit" ? "bg-green-500" :
                        activity.type === "lead" ? "bg-blue-500" :
                        activity.type === "payment" ? "bg-purple-500" :
                        activity.type === "follow_up" ? "bg-orange-500" : "bg-red-500"
                      }`}></div>
                      <div>
                        <p className="text-sm text-foreground">
                          <strong>{activity.message}</strong>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.project || activity.details || activity.amount} • {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="w-full mt-4" data-testid="button-view-all-activities">
                  View All Activities
                </Button>
              </CardContent>
            </Card>

            {/* Communication Center */}
            <Card>
              <CardHeader>
                <CardTitle>Communication Center</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Quick Action Buttons */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <Button className="flex items-center justify-center space-x-2 bg-green-100 text-green-800 hover:bg-green-200" data-testid="button-quick-call">
                    <Phone className="w-4 h-4" />
                    <span>Quick Call</span>
                  </Button>
                  <Button className="flex items-center justify-center space-x-2 bg-blue-100 text-blue-800 hover:bg-blue-200" data-testid="button-send-email">
                    <Mail className="w-4 h-4" />
                    <span>Send Email</span>
                  </Button>
                </div>

                {/* Recent Communications */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">Recent Communications</h4>
                  <div className="flex items-center space-x-3 p-3 bg-background rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Phone className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Call with Rajesh Kumar</p>
                      <p className="text-xs text-muted-foreground">Duration: 12 min • 2 hours ago</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Completed</Badge>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-background rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Email to Priya Sharma</p>
                      <p className="text-xs text-muted-foreground">Project brochure sent • 4 hours ago</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Sent</Badge>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-background rounded-lg">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">SMS to Amit Patel</p>
                      <p className="text-xs text-muted-foreground">Site visit reminder • 6 hours ago</p>
                    </div>
                    <Badge className="bg-orange-100 text-orange-800">Delivered</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Today's Schedule & Top Performers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Today's Schedule</CardTitle>
                  <Button variant="ghost" size="sm" data-testid="button-view-calendar">
                    <Calendar className="w-4 h-4 mr-2" />
                    View Calendar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockSchedule.map((appointment) => (
                    <div key={appointment.id} className="flex items-center space-x-4 p-3 bg-background rounded-lg">
                      <div className="text-center">
                        <p className="text-lg font-bold text-primary">{appointment.time.split(' ')[0]}</p>
                        <p className="text-xs text-muted-foreground">{appointment.time.split(' ')[1]}</p>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{appointment.title}</p>
                        <p className="text-sm text-muted-foreground">{appointment.location || appointment.details}</p>
                        <p className="text-xs text-muted-foreground">Duration: {appointment.duration}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" data-testid={`button-complete-${appointment.id}`}>
                          <Check className="w-4 h-4 text-green-600" />
                        </Button>
                        <Button variant="ghost" size="sm" data-testid={`button-reschedule-${appointment.id}`}>
                          <Clock className="w-4 h-4 text-blue-600" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Performers */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performers (This Month)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(metrics?.topPerformers || []).slice(0, 4).map((performer, index) => (
                    <div key={performer.userId} className="flex items-center space-x-4">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-sm ${
                        index === 0 ? "bg-gradient-to-br from-yellow-400 to-yellow-600" :
                        index === 1 ? "bg-gradient-to-br from-gray-400 to-gray-600" :
                        index === 2 ? "bg-gradient-to-br from-orange-400 to-orange-600" :
                        "bg-gradient-to-br from-blue-400 to-blue-600"
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{performer.userName}</p>
                        <p className="text-sm text-muted-foreground">Sales Executive</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{formatCurrency(performer.sales)}</p>
                        <p className="text-xs text-muted-foreground">{performer.deals} deals</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="w-full mt-4" data-testid="button-view-all-performance">
                  <Award className="w-4 h-4 mr-2" />
                  View All Performance
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Properties Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full flex items-center space-x-3" data-testid="button-quick-add-lead">
                    <UserPlus className="w-5 h-5" />
                    <span>Add New Lead</span>
                  </Button>
                  <Button variant="outline" className="w-full flex items-center space-x-3" data-testid="button-quick-schedule-visit">
                    <Calendar className="w-5 h-5" />
                    <span>Schedule Site Visit</span>
                  </Button>
                  <Button variant="outline" className="w-full flex items-center space-x-3" data-testid="button-quick-record-payment">
                    <DollarSign className="w-5 h-5" />
                    <span>Record Payment</span>
                  </Button>
                  <Button variant="outline" className="w-full flex items-center space-x-3" data-testid="button-quick-generate-report">
                    <TrendingUp className="w-5 h-5" />
                    <span>Generate Report</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Properties Overview */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Properties Overview</CardTitle>
                    <Button variant="ghost" size="sm" data-testid="button-view-all-properties">
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-background rounded-lg p-4 border border-border">
                      <div className="w-full h-32 bg-muted rounded-lg mb-3 flex items-center justify-center">
                        <Building className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">Green Valley Residency</h4>
                        <p className="text-sm text-muted-foreground mb-2">Sector 45, Gurgaon</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">120 Total Units</span>
                          <span className="font-medium text-green-600">85 Sold</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 mt-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: "71%" }}></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">71% Occupancy</p>
                      </div>
                    </div>
                    <div className="bg-background rounded-lg p-4 border border-border">
                      <div className="w-full h-32 bg-muted rounded-lg mb-3 flex items-center justify-center">
                        <Building className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">Skyline Towers</h4>
                        <p className="text-sm text-muted-foreground mb-2">Downtown, Mumbai</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">200 Total Units</span>
                          <span className="font-medium text-blue-600">45 Pre-Sold</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 mt-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "23%" }}></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">23% Pre-Launch Sales</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
