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
import { Plus, Search, Phone, Mail, User, Eye, Building, Calendar } from "lucide-react";
import { Customer, InsertCustomer } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";

export default function Customers() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [newCustomer, setNewCustomer] = useState<Partial<InsertCustomer>>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    panNumber: "",
    aadharNumber: "",
  });

  const { data: customers = [], isLoading } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  const { data: users = [] } = useQuery({
    queryKey: ["/api/users"],
  });

  const createCustomerMutation = useMutation({
    mutationFn: async (customerData: InsertCustomer) => {
      const response = await apiRequest("POST", "/api/customers", customerData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      setIsAddCustomerOpen(false);
      setNewCustomer({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        panNumber: "",
        aadharNumber: "",
      });
      toast({
        title: "Customer added successfully",
        description: "The new customer has been added to your system.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error adding customer",
        description: error.message || "Failed to add customer",
        variant: "destructive",
      });
    },
  });

  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      customer.firstName.toLowerCase().includes(searchLower) ||
      customer.lastName.toLowerCase().includes(searchLower) ||
      customer.phone.includes(searchQuery) ||
      (customer.email && customer.email.toLowerCase().includes(searchLower))
    );
  });

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCustomer.firstName || !newCustomer.lastName || !newCustomer.phone) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const customerData: InsertCustomer = {
      leadId: null,
      firstName: newCustomer.firstName!,
      lastName: newCustomer.lastName!,
      email: newCustomer.email || undefined,
      phone: newCustomer.phone!,
      address: newCustomer.address || null,
      panNumber: newCustomer.panNumber || null,
      aadharNumber: newCustomer.aadharNumber || null,
      assignedTo: null,
    };

    createCustomerMutation.mutate(customerData);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading customers...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <Header title="Customer Management" description="Manage all your customers and their information" />
        
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
                    <p className="text-2xl font-bold text-blue-600" data-testid="stat-total-customers">
                      {customers.length}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Customers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <Building className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600" data-testid="stat-active-customers">
                      {customers.filter(c => c.assignedTo).length}
                    </p>
                    <p className="text-sm text-muted-foreground">Active Customers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg mr-3">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600" data-testid="stat-new-customers">
                      {customers.filter(c => {
                        const createdDate = new Date(c.createdAt!);
                        const thirtyDaysAgo = new Date();
                        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                        return createdDate > thirtyDaysAgo;
                      }).length}
                    </p>
                    <p className="text-sm text-muted-foreground">New (30 days)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg mr-3">
                    <User className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-600" data-testid="stat-verified-customers">
                      {customers.filter(c => c.panNumber && c.aadharNumber).length}
                    </p>
                    <p className="text-sm text-muted-foreground">Verified</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Add Button */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search customers..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    data-testid="input-search-customers"
                  />
                </div>

                <Dialog open={isAddCustomerOpen} onOpenChange={setIsAddCustomerOpen}>
                  <DialogTrigger asChild>
                    <Button data-testid="button-add-customer">
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Customer
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Customer</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddCustomer} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            value={newCustomer.firstName || ""}
                            onChange={(e) => setNewCustomer({ ...newCustomer, firstName: e.target.value })}
                            required
                            data-testid="input-customer-firstName"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            value={newCustomer.lastName || ""}
                            onChange={(e) => setNewCustomer({ ...newCustomer, lastName: e.target.value })}
                            required
                            data-testid="input-customer-lastName"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="phone">Phone *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={newCustomer.phone || ""}
                          onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                          required
                          data-testid="input-customer-phone"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newCustomer.email || ""}
                          onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                          data-testid="input-customer-email"
                        />
                      </div>

                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                          id="address"
                          placeholder="Customer address"
                          value={newCustomer.address || ""}
                          onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                          data-testid="textarea-customer-address"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="panNumber">PAN Number</Label>
                          <Input
                            id="panNumber"
                            value={newCustomer.panNumber || ""}
                            onChange={(e) => setNewCustomer({ ...newCustomer, panNumber: e.target.value })}
                            data-testid="input-customer-panNumber"
                          />
                        </div>
                        <div>
                          <Label htmlFor="aadharNumber">Aadhar Number</Label>
                          <Input
                            id="aadharNumber"
                            value={newCustomer.aadharNumber || ""}
                            onChange={(e) => setNewCustomer({ ...newCustomer, aadharNumber: e.target.value })}
                            data-testid="input-customer-aadharNumber"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsAddCustomerOpen(false)}
                          className="flex-1"
                          data-testid="button-cancel-add-customer"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1"
                          disabled={createCustomerMutation.isPending}
                          data-testid="button-save-customer"
                        >
                          {createCustomerMutation.isPending ? "Adding..." : "Add Customer"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Customers Table */}
          <Card>
            <CardHeader>
              <CardTitle>
                Customers ({filteredCustomers.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted border-b">
                    <tr>
                      <th className="text-left p-4 font-medium text-foreground">Customer</th>
                      <th className="text-left p-4 font-medium text-foreground">Contact</th>
                      <th className="text-left p-4 font-medium text-foreground">Address</th>
                      <th className="text-left p-4 font-medium text-foreground">Verification</th>
                      <th className="text-left p-4 font-medium text-foreground">Created</th>
                      <th className="text-left p-4 font-medium text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer) => (
                      <tr key={customer.id} className="border-b hover:bg-muted/50" data-testid={`customer-row-${customer.id}`}>
                        <td className="p-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-blue-600 font-medium text-sm">
                                {customer.firstName[0]}{customer.lastName[0]}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-foreground">
                                {customer.firstName} {customer.lastName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Customer ID: {customer.id.substring(0, 8)}...
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Phone className="w-3 h-3 mr-1 text-muted-foreground" />
                              {customer.phone}
                            </div>
                            {customer.email && (
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Mail className="w-3 h-3 mr-1" />
                                {customer.email}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-muted-foreground">
                            {customer.address || "Not provided"}
                          </p>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            {customer.panNumber && (
                              <Badge variant="outline" className="bg-green-100 text-green-800">
                                PAN Verified
                              </Badge>
                            )}
                            {customer.aadharNumber && (
                              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                                Aadhar Verified
                              </Badge>
                            )}
                            {!customer.panNumber && !customer.aadharNumber && (
                              <Badge variant="outline" className="bg-gray-100 text-gray-800">
                                Pending
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {new Date(customer.createdAt!).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedCustomer(customer)}
                              data-testid={`button-view-customer-${customer.id}`}
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              data-testid={`button-call-customer-${customer.id}`}
                            >
                              <Phone className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              data-testid={`button-email-customer-${customer.id}`}
                            >
                              <Mail className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {filteredCustomers.length === 0 && (
                  <div className="text-center py-8" data-testid="no-customers-message">
                    <p className="text-muted-foreground">No customers found matching your criteria.</p>
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
