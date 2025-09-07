import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BarChart, TrendingUp, Download, Calendar, DollarSign, Users, Building, PieChart, FileText } from "lucide-react";

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState("sales");
  const [dateRange, setDateRange] = useState("last-30-days");

  const { data: metrics } = useQuery({
    queryKey: ["/api/dashboard/metrics"],
  });

  const { data: leads = [] } = useQuery({
    queryKey: ["/api/leads"],
  });

  const reportTypes = [
    { value: "sales", label: "Sales Report", icon: DollarSign },
    { value: "leads", label: "Lead Analysis", icon: Users },
    { value: "inventory", label: "Inventory Report", icon: Building },
    { value: "performance", label: "Team Performance", icon: TrendingUp },
    { value: "revenue", label: "Revenue Analysis", icon: PieChart }
  ];

  // Mock sales data based on metrics
  const salesData = {
    totalSales: 45600000,
    unitsSOld: 68,
    avgDealSize: 670588,
    conversionRate: metrics?.conversionRate || 24.5,
    topProjects: [
      { name: "Green Valley Residency", sales: 18500000, units: 25 },
      { name: "Skyline Towers", sales: 15200000, units: 22 },
      { name: "Ocean View Apartments", sales: 11900000, units: 21 }
    ],
    monthlySales: [
      { month: "Oct", amount: 12500000 },
      { month: "Nov", amount: 15800000 },
      { month: "Dec", amount: 17300000 }
    ]
  };

  const leadData = {
    totalLeads: metrics?.totalLeads || 1247,
    qualifiedLeads: Math.floor((metrics?.totalLeads || 1247) * 0.365),
    convertedLeads: Math.floor((metrics?.totalLeads || 1247) * 0.089),
    leadSources: metrics?.leadsBySource?.map(source => ({
      source: source.source.charAt(0).toUpperCase() + source.source.slice(1).replace('_', ' '),
      count: source.count,
      percentage: Math.round((source.count / (metrics?.totalLeads || 1)) * 100)
    })) || [
      { source: "Website", count: 387, percentage: 31 },
      { source: "Referrals", count: 324, percentage: 26 },
      { source: "Social Media", count: 289, percentage: 23 },
      { source: "Walk-ins", count: 247, percentage: 20 }
    ]
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else {
      return `₹${amount.toLocaleString()}`;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <Header title="Reports & Analytics" description="Comprehensive business insights and performance metrics" />
        
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header Controls */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-40" data-testid="select-date-range">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                  <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                  <SelectItem value="last-90-days">Last 90 Days</SelectItem>
                  <SelectItem value="last-year">Last Year</SelectItem>
                </SelectContent>
              </Select>
              <Button className="bg-green-600 hover:bg-green-700" data-testid="button-export-report">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Report Type Selector */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Report Types</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {reportTypes.map((report) => {
                  const Icon = report.icon;
                  return (
                    <div
                      key={report.value}
                      onClick={() => setSelectedReport(report.value)}
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedReport === report.value
                          ? 'bg-blue-100 text-blue-700'
                          : 'hover:bg-gray-100'
                      }`}
                      data-testid={`report-type-${report.value}`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      <span className="font-medium">{report.label}</span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Report Content */}
            <div className="lg:col-span-3">
              {selectedReport === "sales" && (
                <div className="space-y-6">
                  {/* Sales KPIs */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center">
                          <div className="p-2 bg-green-100 rounded-lg mr-4">
                            <DollarSign className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-green-600" data-testid="sales-total-amount">
                              {formatCurrency(salesData.totalSales)}
                            </p>
                            <p className="text-sm text-muted-foreground">Total Sales</p>
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
                            <p className="text-2xl font-bold text-blue-600" data-testid="sales-units-sold">
                              {salesData.unitsSOld}
                            </p>
                            <p className="text-sm text-muted-foreground">Units Sold</p>
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
                            <p className="text-2xl font-bold text-purple-600" data-testid="sales-avg-deal">
                              {formatCurrency(salesData.avgDealSize)}
                            </p>
                            <p className="text-sm text-muted-foreground">Avg Deal Size</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center">
                          <div className="p-2 bg-yellow-100 rounded-lg mr-4">
                            <BarChart className="w-6 h-6 text-yellow-600" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-yellow-600" data-testid="sales-conversion-rate">
                              {salesData.conversionRate}%
                            </p>
                            <p className="text-sm text-muted-foreground">Conversion Rate</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Top Performing Projects */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Performing Projects</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-muted">
                            <tr>
                              <th className="text-left p-3 font-medium text-foreground">Project Name</th>
                              <th className="text-left p-3 font-medium text-foreground">Sales Revenue</th>
                              <th className="text-left p-3 font-medium text-foreground">Units Sold</th>
                              <th className="text-left p-3 font-medium text-foreground">Avg Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {salesData.topProjects.map((project, index) => (
                              <tr key={index} className="border-b hover:bg-muted/50" data-testid={`project-row-${index}`}>
                                <td className="p-3 font-medium text-foreground">{project.name}</td>
                                <td className="p-3 text-muted-foreground">{formatCurrency(project.sales)}</td>
                                <td className="p-3 text-muted-foreground">{project.units}</td>
                                <td className="p-3 text-muted-foreground">{formatCurrency(project.sales / project.units)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {selectedReport === "leads" && (
                <div className="space-y-6">
                  {/* Lead KPIs */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center">
                          <div className="p-2 bg-blue-100 rounded-lg mr-4">
                            <Users className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-blue-600" data-testid="leads-total">
                              {leadData.totalLeads}
                            </p>
                            <p className="text-sm text-muted-foreground">Total Leads</p>
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
                            <p className="text-2xl font-bold text-green-600" data-testid="leads-qualified">
                              {leadData.qualifiedLeads}
                            </p>
                            <p className="text-sm text-muted-foreground">Qualified Leads</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center">
                          <div className="p-2 bg-purple-100 rounded-lg mr-4">
                            <BarChart className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-purple-600" data-testid="leads-converted">
                              {leadData.convertedLeads}
                            </p>
                            <p className="text-sm text-muted-foreground">Converted</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Lead Sources */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Lead Sources Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {leadData.leadSources.map((source, index) => (
                          <div key={index} className="flex items-center justify-between" data-testid={`lead-source-${index}`}>
                            <div className="flex items-center space-x-3">
                              <div className="w-4 h-4 bg-blue-600 rounded"></div>
                              <span className="font-medium">{source.source}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="w-32 bg-muted rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${source.percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-muted-foreground w-12">{source.count}</span>
                              <span className="text-sm font-medium w-12">{source.percentage}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {selectedReport !== "sales" && selectedReport !== "leads" && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      {reportTypes.find(r => r.value === selectedReport)?.label} Report
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      This report is currently being prepared. Check back later for detailed insights.
                    </p>
                    <Button variant="outline" data-testid="button-request-report">
                      Request Report
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
