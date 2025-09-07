import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Building, Home, MapPin, Eye } from "lucide-react";
import { Unit, Project } from "@shared/schema";

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const { data: projects = [], isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  // Fetch units from API
  const { data: units = [], isLoading: unitsLoading, error: unitsError } = useQuery<Unit[]>({
    queryKey: ["/api/units"],
    enabled: true, // Enable the query by default
  });

  const filteredUnits = units.filter((unit) => {
    const matchesSearch = unit.unitNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || unit.status === statusFilter;
    const matchesProject = projectFilter === "all" || unit.projectId === projectFilter;
    const matchesType = typeFilter === "all" || unit.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesProject && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-green-100 text-green-800";
      case "reserved": return "bg-yellow-100 text-yellow-800";
      case "sold": return "bg-blue-100 text-blue-800";
      case "blocked": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: string | number | null) => {
    if (!amount) return "Not specified";
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(1)}Cr`;
    } else if (num >= 100000) {
      return `₹${(num / 100000).toFixed(1)}L`;
    } else {
      return `₹${num.toLocaleString()}`;
    }
  };

  if (projectsLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading inventory...</p>
          </div>
        </div>
      </div>
    );
  }

  const totalUnits = projects.reduce((sum, p) => sum + p.totalUnits, 0);
  const soldUnits = projects.reduce((sum, p) => sum + (p.soldUnits || 0), 0);
  const availableUnits = projects.reduce((sum, p) => sum + p.availableUnits, 0);
  const reservedUnits = 0; // This would come from actual unit data

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <Header title="Inventory Management" description="Manage all units across your projects" />
        
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <Building className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600" data-testid="stat-total-units">
                      {totalUnits}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Units</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <Home className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600" data-testid="stat-available-units">
                      {availableUnits}
                    </p>
                    <p className="text-sm text-muted-foreground">Available</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                    <Home className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-600" data-testid="stat-reserved-units">
                      {reservedUnits}
                    </p>
                    <p className="text-sm text-muted-foreground">Reserved</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg mr-3">
                    <Home className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600" data-testid="stat-sold-units">
                      {soldUnits}
                    </p>
                    <p className="text-sm text-muted-foreground">Sold</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by unit number..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    data-testid="input-search-units"
                  />
                </div>
                
                <Select value={projectFilter} onValueChange={setProjectFilter}>
                  <SelectTrigger className="w-48" data-testid="select-project-filter">
                    <SelectValue placeholder="Filter by project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48" data-testid="select-status-filter">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-48" data-testid="select-type-filter">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="1BHK">1 BHK</SelectItem>
                    <SelectItem value="2BHK">2 BHK</SelectItem>
                    <SelectItem value="3BHK">3 BHK</SelectItem>
                    <SelectItem value="4BHK">4 BHK</SelectItem>
                    <SelectItem value="Penthouse">Penthouse</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" data-testid="button-export-inventory">
                  <Filter className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Project Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const occupancyPercentage = project.totalUnits > 0 ? 
                Math.round(((project.soldUnits || 0) / project.totalUnits) * 100) : 0;
              
              return (
                <Card key={project.id} className="hover:shadow-lg transition-shadow" data-testid={`project-inventory-${project.id}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          {project.location}
                        </div>
                      </div>
                      <Badge variant={project.isActive ? "default" : "secondary"}>
                        {project.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">{project.totalUnits}</p>
                        <p className="text-xs text-muted-foreground">Total</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">{project.availableUnits}</p>
                        <p className="text-xs text-muted-foreground">Available</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-purple-600">{project.soldUnits}</p>
                        <p className="text-xs text-muted-foreground">Sold</p>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Sales Progress</span>
                        <span className="font-medium">{occupancyPercentage}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all" 
                          style={{ width: `${occupancyPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      data-testid={`button-view-units-${project.id}`}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Units
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Loading State */}
          {unitsLoading && (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading units...</p>
              </CardContent>
            </Card>
          )}

          {/* Error State */}
          {unitsError && (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-red-600 mb-2">Error loading units</p>
                <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
              </CardContent>
            </Card>
          )}

          {/* Units Data Display */}
          {!unitsLoading && !unitsError && (
            <>
              {/* Show actual units if available */}
              {filteredUnits.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Unit Inventory ({filteredUnits.length} units)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredUnits.map((unit) => (
                        <div key={unit.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{unit.unitNumber}</h4>
                            <Badge variant={unit.status === 'available' ? 'default' : 
                                          unit.status === 'sold' ? 'destructive' : 
                                          unit.status === 'reserved' ? 'secondary' : 'outline'}>
                              {unit.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{unit.type}</p>
                          <p className="text-sm text-muted-foreground mb-2">Floor {unit.floor}</p>
                          <p className="text-sm text-muted-foreground mb-2">{unit.area} sq ft</p>
                          <p className="font-medium text-primary">₹{parseFloat(unit.price).toLocaleString()}</p>
                          <Button size="sm" variant="outline" className="mt-2 w-full">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                /* Empty State for Units */
                <Card>
                  <CardContent className="p-12 text-center" data-testid="no-units-message">
                    <Home className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No Units Found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery || statusFilter !== 'all' || projectFilter !== 'all' || typeFilter !== 'all' 
                        ? 'No units match your current filters. Try adjusting your search criteria.'
                        : 'No units have been added to the system yet. Units will appear here once they are created.'}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-medium text-foreground mb-2">Unit Details</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Unit number and floor</li>
                    <li>• Type (1BHK, 2BHK, etc.)</li>
                    <li>• Area and pricing</li>
                    <li>• Current status</li>
                  </ul>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-medium text-foreground mb-2">Status Tracking</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Available units</li>
                    <li>• Reserved bookings</li>
                    <li>• Sold properties</li>
                    <li>• Blocked units</li>
                  </ul>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-medium text-foreground mb-2">Management</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Update unit status</li>
                    <li>• Modify pricing</li>
                    <li>• Assign to customers</li>
                    <li>• Generate reports</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
