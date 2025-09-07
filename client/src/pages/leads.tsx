import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
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
import { Plus, Search, Filter, Phone, Mail, User, Eye } from "lucide-react";
import { Lead, InsertLead } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";

export default function Leads() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newLead, setNewLead] = useState<Partial<InsertLead>>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    source: "website",
    budget: "",
    requirements: "",
    status: "new",
  });

  const { data: leads = [], isLoading } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
  });

  const { data: projects = [] } = useQuery({
    queryKey: ["/api/projects"],
  });

  const createLeadMutation = useMutation({
    mutationFn: async (leadData: InsertLead) => {
      const response = await apiRequest("POST", "/api/leads", leadData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      setIsAddLeadOpen(false);
      setNewLead({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        source: "website",
        budget: "",
        requirements: "",
        status: "new",
      });
      toast({
        title: "Lead added successfully",
        description: "The new lead has been added to your pipeline.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error adding lead",
        description: error.message || "Failed to add lead",
        variant: "destructive",
      });
    },
  });

  const updateLeadMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertLead> }) => {
      const response = await apiRequest("PATCH", `/api/leads/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      toast({
        title: "Lead updated successfully",
        description: "The lead information has been updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating lead",
        description: error.message || "Failed to update lead",
        variant: "destructive",
      });
    },
  });

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = 
      lead.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery) ||
      (lead.email && lead.email.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    const matchesSource = sourceFilter === "all" || lead.source === sourceFilter;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-800";
      case "contacted": return "bg-yellow-100 text-yellow-800";
      case "site_visit": return "bg-purple-100 text-purple-800";
      case "negotiation": return "bg-orange-100 text-orange-800";
      case "booking": return "bg-green-100 text-green-800";
      case "sold": return "bg-emerald-100 text-emerald-800";
      case "lost": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
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

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newLead.firstName || !newLead.lastName || !newLead.phone) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const leadData: InsertLead = {
      firstName: newLead.firstName!,
      lastName: newLead.lastName!,
      email: newLead.email || null,
      phone: newLead.phone!,
      source: newLead.source as any,
      status: newLead.status as any,
      budget: newLead.budget ? parseFloat(newLead.budget as string) : null,
      requirements: newLead.requirements || null,
      assignedTo: null,
      projectInterest: null,
      unitInterest: null,
      notes: null,
      lastContactedAt: null,
    };

    createLeadMutation.mutate(leadData);
  };

  const handleStatusChange = (leadId: string, newStatus: string) => {
    updateLeadMutation.mutate({
      id: leadId,
      data: { status: newStatus as any }
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading leads...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <Header title="Lead Management" description="Manage and track all your leads" />
        
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600" data-testid="stat-total-leads">
                      {leads.length}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Leads</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <User className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600" data-testid="stat-new-leads">
                      {leads.filter(l => l.status === 'new').length}
                    </p>
                    <p className="text-sm text-muted-foreground">New Leads</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                    <User className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-600" data-testid="stat-hot-leads">
                      {leads.filter(l => l.status === 'negotiation' || l.status === 'site_visit').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Hot Leads</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-emerald-100 rounded-lg mr-3">
                    <User className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-emerald-600" data-testid="stat-converted-leads">
                      {leads.filter(l => l.status === 'sold').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Converted</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Add Button */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search leads..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      data-testid="input-search-leads"
                    />
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48" data-testid="select-status-filter">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="site_visit">Site Visit</SelectItem>
                      <SelectItem value="negotiation">Negotiation</SelectItem>
                      <SelectItem value="booking">Booking</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                      <SelectItem value="lost">Lost</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sourceFilter} onValueChange={setSourceFilter}>
                    <SelectTrigger className="w-48" data-testid="select-source-filter">
                      <SelectValue placeholder="Filter by source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sources</SelectItem>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="social_media">Social Media</SelectItem>
                      <SelectItem value="walk_in">Walk-in</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="advertisement">Advertisement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Dialog open={isAddLeadOpen} onOpenChange={setIsAddLeadOpen}>
                  <DialogTrigger asChild>
                    <Button data-testid="button-add-lead">
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Lead
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Lead</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddLead} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            value={newLead.firstName || ""}
                            onChange={(e) => setNewLead({ ...newLead, firstName: e.target.value })}
                            required
                            data-testid="input-lead-firstName"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            value={newLead.lastName || ""}
                            onChange={(e) => setNewLead({ ...newLead, lastName: e.target.value })}
                            required
                            data-testid="input-lead-lastName"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="phone">Phone *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={newLead.phone || ""}
                          onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                          required
                          data-testid="input-lead-phone"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newLead.email || ""}
                          onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                          data-testid="input-lead-email"
                        />
                      </div>

                      <div>
                        <Label htmlFor="source">Source</Label>
                        <Select value={newLead.source} onValueChange={(value) => setNewLead({ ...newLead, source: value as any })}>
                          <SelectTrigger data-testid="select-lead-source">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="website">Website</SelectItem>
                            <SelectItem value="referral">Referral</SelectItem>
                            <SelectItem value="social_media">Social Media</SelectItem>
                            <SelectItem value="walk_in">Walk-in</SelectItem>
                            <SelectItem value="phone">Phone</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="advertisement">Advertisement</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="budget">Budget</Label>
                        <Input
                          id="budget"
                          type="number"
                          placeholder="Enter budget amount"
                          value={newLead.budget || ""}
                          onChange={(e) => setNewLead({ ...newLead, budget: e.target.value })}
                          data-testid="input-lead-budget"
                        />
                      </div>

                      <div>
                        <Label htmlFor="requirements">Requirements</Label>
                        <Textarea
                          id="requirements"
                          placeholder="Lead requirements and preferences"
                          value={newLead.requirements || ""}
                          onChange={(e) => setNewLead({ ...newLead, requirements: e.target.value })}
                          data-testid="textarea-lead-requirements"
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsAddLeadOpen(false)}
                          className="flex-1"
                          data-testid="button-cancel-add-lead"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1"
                          disabled={createLeadMutation.isPending}
                          data-testid="button-save-lead"
                        >
                          {createLeadMutation.isPending ? "Adding..." : "Add Lead"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Leads Table */}
          <Card>
            <CardHeader>
              <CardTitle>
                Leads ({filteredLeads.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted border-b">
                    <tr>
                      <th className="text-left p-4 font-medium text-foreground">Lead</th>
                      <th className="text-left p-4 font-medium text-foreground">Contact</th>
                      <th className="text-left p-4 font-medium text-foreground">Source</th>
                      <th className="text-left p-4 font-medium text-foreground">Status</th>
                      <th className="text-left p-4 font-medium text-foreground">Budget</th>
                      <th className="text-left p-4 font-medium text-foreground">Created</th>
                      <th className="text-left p-4 font-medium text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="border-b hover:bg-muted/50" data-testid={`lead-row-${lead.id}`}>
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-foreground">
                              {lead.firstName} {lead.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {lead.requirements ? lead.requirements.substring(0, 50) + "..." : "No requirements specified"}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Phone className="w-3 h-3 mr-1 text-muted-foreground" />
                              {lead.phone}
                            </div>
                            {lead.email && (
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Mail className="w-3 h-3 mr-1" />
                                {lead.email}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline">{formatStatus(lead.source)}</Badge>
                        </td>
                        <td className="p-4">
                          <Select
                            value={lead.status || "new"}
                            onValueChange={(value) => handleStatusChange(lead.id, value)}
                            data-testid={`select-lead-status-${lead.id}`}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="contacted">Contacted</SelectItem>
                              <SelectItem value="site_visit">Site Visit</SelectItem>
                              <SelectItem value="negotiation">Negotiation</SelectItem>
                              <SelectItem value="booking">Booking</SelectItem>
                              <SelectItem value="sold">Sold</SelectItem>
                              <SelectItem value="lost">Lost</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {formatCurrency(lead.budget)}
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {new Date(lead.createdAt!).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedLead(lead)}
                              data-testid={`button-view-lead-${lead.id}`}
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              data-testid={`button-call-lead-${lead.id}`}
                            >
                              <Phone className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              data-testid={`button-email-lead-${lead.id}`}
                            >
                              <Mail className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {filteredLeads.length === 0 && (
                  <div className="text-center py-8" data-testid="no-leads-message">
                    <p className="text-muted-foreground">No leads found matching your criteria.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
