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
import { Plus, Search, Handshake, Phone, Mail, User, Eye, DollarSign, TrendingUp, Users, Building } from "lucide-react";
import { ChannelPartner, InsertChannelPartner } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";

export default function ChannelPartners() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddPartnerOpen, setIsAddPartnerOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<ChannelPartner | null>(null);
  const [newPartner, setNewPartner] = useState({
    name: "",
    companyName: "",
    email: "",
    phone: "",
    address: "",
    commissionRate: "",
  });

  const { data: partners = [], isLoading } = useQuery<ChannelPartner[]>({
    queryKey: ["/api/channel-partners"],
  });

  const createPartnerMutation = useMutation({
    mutationFn: async (partnerData: InsertChannelPartner) => {
      const response = await apiRequest("POST", "/api/channel-partners", partnerData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/channel-partners"] });
      setIsAddPartnerOpen(false);
      setNewPartner({
        name: "",
        companyName: "",
        email: "",
        phone: "",
        address: "",
        commissionRate: "",
      });
      toast({
        title: "Channel partner added successfully",
        description: "The new channel partner has been registered.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error adding channel partner",
        description: error.message || "Failed to add channel partner",
        variant: "destructive",
      });
    },
  });

  const filteredPartners = partners.filter((partner) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      partner.name.toLowerCase().includes(searchLower) ||
      (partner.companyName && partner.companyName.toLowerCase().includes(searchLower)) ||
      partner.email.toLowerCase().includes(searchLower) ||
      partner.phone.includes(searchQuery);
    
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && partner.isActive) ||
      (statusFilter === "inactive" && !partner.isActive);
    
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: string | number | null) => {
    if (!amount) return "₹0";
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(1)}Cr`;
    } else if (num >= 100000) {
      return `₹${(num / 100000).toFixed(1)}L`;
    } else {
      return `₹${num.toLocaleString()}`;
    }
  };

  const handleAddPartner = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPartner.name || !newPartner.email || !newPartner.phone) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const partnerData: InsertChannelPartner = {
      name: newPartner.name!,
      companyName: newPartner.companyName || null,
      email: newPartner.email!,
      phone: newPartner.phone!,
      address: newPartner.address || null,
      commissionRate: newPartner.commissionRate ? newPartner.commissionRate.toString() : "0",
      totalLeads: 0,
      totalSales: "0",
      totalCommission: "0",
      isActive: true,
    };

    createPartnerMutation.mutate(partnerData);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading channel partners...</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalPartners = partners.length;
  const activePartners = partners.filter(p => p.isActive).length;
  const totalSales = partners.reduce((sum, p) => sum + parseFloat(p.totalSales?.toString() || "0"), 0);
  const totalCommission = partners.reduce((sum, p) => sum + parseFloat(p.totalCommission?.toString() || "0"), 0);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <Header title="Channel Partners" description="Manage your real estate channel partners and track performance" />
        
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <Handshake className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600" data-testid="stat-total-partners">
                      {totalPartners}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Partners</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600" data-testid="stat-active-partners">
                      {activePartners}
                    </p>
                    <p className="text-sm text-muted-foreground">Active Partners</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg mr-3">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600" data-testid="stat-total-sales">
                      {formatCurrency(totalSales)}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Sales</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg mr-3">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-600" data-testid="stat-total-commission">
                      {formatCurrency(totalCommission)}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Commission</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Add Button */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search partners..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      data-testid="input-search-partners"
                    />
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48" data-testid="select-status-filter">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Partners</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Dialog open={isAddPartnerOpen} onOpenChange={setIsAddPartnerOpen}>
                  <DialogTrigger asChild>
                    <Button data-testid="button-add-partner">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Channel Partner
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add Channel Partner</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddPartner} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Partner Name *</Label>
                        <Input
                          id="name"
                          value={newPartner.name || ""}
                          onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                          required
                          data-testid="input-partner-name"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                          id="companyName"
                          value={newPartner.companyName || ""}
                          onChange={(e) => setNewPartner({ ...newPartner, companyName: e.target.value })}
                          data-testid="input-partner-companyName"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newPartner.email || ""}
                          onChange={(e) => setNewPartner({ ...newPartner, email: e.target.value })}
                          required
                          data-testid="input-partner-email"
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={newPartner.phone || ""}
                          onChange={(e) => setNewPartner({ ...newPartner, phone: e.target.value })}
                          required
                          data-testid="input-partner-phone"
                        />
                      </div>

                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                          id="address"
                          placeholder="Partner address"
                          value={newPartner.address || ""}
                          onChange={(e) => setNewPartner({ ...newPartner, address: e.target.value })}
                          data-testid="textarea-partner-address"
                        />
                      </div>

                      <div>
                        <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                        <Input
                          id="commissionRate"
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          value={newPartner.commissionRate?.toString() || ""}
                          onChange={(e) => setNewPartner({ ...newPartner, commissionRate: e.target.value })}
                          data-testid="input-partner-commissionRate"
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsAddPartnerOpen(false)}
                          className="flex-1"
                          data-testid="button-cancel-add-partner"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1"
                          disabled={createPartnerMutation.isPending}
                          data-testid="button-save-partner"
                        >
                          {createPartnerMutation.isPending ? "Adding..." : "Add Partner"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Partners Table */}
          <Card>
            <CardHeader>
              <CardTitle>
                Channel Partners ({filteredPartners.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted border-b">
                    <tr>
                      <th className="text-left p-4 font-medium text-foreground">Partner</th>
                      <th className="text-left p-4 font-medium text-foreground">Contact</th>
                      <th className="text-left p-4 font-medium text-foreground">Performance</th>
                      <th className="text-left p-4 font-medium text-foreground">Commission</th>
                      <th className="text-left p-4 font-medium text-foreground">Status</th>
                      <th className="text-left p-4 font-medium text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPartners.map((partner) => (
                      <tr key={partner.id} className="border-b hover:bg-muted/50" data-testid={`partner-row-${partner.id}`}>
                        <td className="p-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-blue-600 font-medium text-sm">
                                {partner.name[0]}{partner.companyName ? partner.companyName[0] : partner.name[1] || ""}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{partner.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {partner.companyName || "Individual Partner"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Phone className="w-3 h-3 mr-1 text-muted-foreground" />
                              {partner.phone}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Mail className="w-3 h-3 mr-1" />
                              {partner.email}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="text-sm">
                              <span className="font-medium">{partner.totalLeads || 0}</span> leads
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {formatCurrency(partner.totalSales)} sales
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="text-sm font-medium">
                              {partner.commissionRate}%
                            </div>
                            <div className="text-sm text-green-600">
                              {formatCurrency(partner.totalCommission)} earned
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant={partner.isActive ? "default" : "secondary"}>
                            {partner.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedPartner(partner)}
                              data-testid={`button-view-partner-${partner.id}`}
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              data-testid={`button-call-partner-${partner.id}`}
                            >
                              <Phone className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              data-testid={`button-email-partner-${partner.id}`}
                            >
                              <Mail className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {filteredPartners.length === 0 && (
                  <div className="text-center py-8" data-testid="no-partners-message">
                    <Handshake className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No Channel Partners Found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery || statusFilter !== "all" 
                        ? "No partners match your current filters." 
                        : "Start building your partner network by adding your first channel partner."}
                    </p>
                    <Button onClick={() => setIsAddPartnerOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Partner
                    </Button>
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
