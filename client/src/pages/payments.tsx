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
import { Plus, Search, CreditCard, DollarSign, Calendar, Eye, Receipt } from "lucide-react";
import { Payment, Booking } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Payments() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);

  // Mock data for payments - in a real app, this would come from the API
  const mockPayments: Payment[] = [];
  const mockBookings: Booking[] = [];

  const filteredPayments = mockPayments.filter((payment) => {
    const matchesSearch = payment.receiptNumber?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    const matchesMethod = methodFilter === "all" || payment.paymentMethod === methodFilter;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "failed": return "bg-red-100 text-red-800";
      case "cancelled": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

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

  // Calculate stats from mock data
  const totalPayments = mockPayments.length;
  const completedPayments = mockPayments.filter(p => p.status === 'completed').length;
  const pendingPayments = mockPayments.filter(p => p.status === 'pending').length;
  const totalAmount = mockPayments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <Header title="Payment Management" description="Track and manage all customer payments" />
        
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600" data-testid="stat-total-payments">
                      {totalPayments}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Payments</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600" data-testid="stat-total-amount">
                      {formatCurrency(totalAmount)}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Collected</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <CreditCard className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600" data-testid="stat-completed-payments">
                      {completedPayments}
                    </p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                    <Calendar className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-600" data-testid="stat-pending-payments">
                      {pendingPayments}
                    </p>
                    <p className="text-sm text-muted-foreground">Pending</p>
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
                      placeholder="Search by receipt number..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      data-testid="input-search-payments"
                    />
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48" data-testid="select-status-filter">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={methodFilter} onValueChange={setMethodFilter}>
                    <SelectTrigger className="w-48" data-testid="select-method-filter">
                      <SelectValue placeholder="Filter by method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Methods</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="online">Online Payment</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button data-testid="button-record-payment">
                  <Plus className="w-4 h-4 mr-2" />
                  Record Payment
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Payment Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">Token Payment</p>
                      <p className="text-sm text-muted-foreground">Rajesh Kumar • Today</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">₹5.0L</p>
                      <Badge className="bg-green-100 text-green-800">Completed</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">EMI Payment</p>
                      <p className="text-sm text-muted-foreground">Priya Sharma • Yesterday</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">₹2.5L</p>
                      <Badge className="bg-blue-100 text-blue-800">Completed</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">Booking Amount</p>
                      <p className="text-sm text-muted-foreground">Amit Patel • 2 days ago</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-yellow-600">₹25L</p>
                      <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-600 rounded"></div>
                      <span className="font-medium">Bank Transfer</span>
                    </div>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-600 rounded"></div>
                      <span className="font-medium">Cheque</span>
                    </div>
                    <span className="text-sm font-medium">30%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-600 rounded"></div>
                      <span className="font-medium">Online</span>
                    </div>
                    <span className="text-sm font-medium">15%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-orange-600 rounded"></div>
                      <span className="font-medium">Cash</span>
                    </div>
                    <span className="text-sm font-medium">10%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Monthly Collection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">This Month</span>
                    <span className="font-bold text-green-600">₹4.2Cr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Month</span>
                    <span className="font-medium">₹3.8Cr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Growth</span>
                    <span className="font-medium text-green-600">+10.5%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mt-4">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: "68%" }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground">68% of target achieved</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Empty State for Payments Table */}
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent className="p-12 text-center" data-testid="no-payments-message">
              <CreditCard className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Payment Transactions</h3>
              <p className="text-muted-foreground mb-4">
                All payment transactions and receipts will be displayed here with detailed tracking information.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-medium text-foreground mb-2">Transaction Details</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Payment amount and date</li>
                    <li>• Customer information</li>
                    <li>• Booking reference</li>
                    <li>• Receipt generation</li>
                  </ul>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-medium text-foreground mb-2">Payment Methods</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Cash payments</li>
                    <li>• Cheque deposits</li>
                    <li>• Bank transfers</li>
                    <li>• Online payments</li>
                  </ul>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-medium text-foreground mb-2">Status Tracking</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Payment verification</li>
                    <li>• Collection tracking</li>
                    <li>• Due date monitoring</li>
                    <li>• Receipt management</li>
                  </ul>
                </div>
              </div>
              <Button className="mt-6" data-testid="button-add-first-payment">
                <Plus className="w-4 h-4 mr-2" />
                Record First Payment
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
