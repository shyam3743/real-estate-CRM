import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Building, User, Calendar } from "lucide-react";

export default function DeveloperApprovals() {
  const [approvals] = useState([
    {
      id: 1,
      developerName: "Sunshine Builders",
      contactPerson: "Rajesh Kumar",
      email: "rajesh@sunshinebuilders.com",
      phone: "+91 9876543210",
      registrationDate: "2024-01-20",
      documentsSubmitted: 8,
      requiredDocuments: 10,
      status: "Pending Review",
      businessType: "Real Estate Developer",
      experience: "15 years"
    },
    {
      id: 2,
      developerName: "Metro Properties",
      contactPerson: "Priya Sharma",
      email: "priya@metroproperties.com",
      phone: "+91 9876543211",
      registrationDate: "2024-01-18",
      documentsSubmitted: 10,
      requiredDocuments: 10,
      status: "Under Review",
      businessType: "Real Estate Developer",
      experience: "12 years"
    },
    {
      id: 3,
      developerName: "Green City Developers",
      contactPerson: "Amit Patel",
      email: "amit@greencity.com",
      phone: "+91 9876543212",
      registrationDate: "2024-01-15",
      documentsSubmitted: 6,
      requiredDocuments: 10,
      status: "Documents Required",
      businessType: "Real Estate Developer",
      experience: "8 years"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending Review': return 'bg-yellow-100 text-yellow-800';
      case 'Under Review': return 'bg-blue-100 text-blue-800';
      case 'Documents Required': return 'bg-red-100 text-red-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending Review': return <Clock className="w-4 h-4" />;
      case 'Under Review': return <Clock className="w-4 h-4" />;
      case 'Documents Required': return <XCircle className="w-4 h-4" />;
      case 'Approved': return <CheckCircle className="w-4 h-4" />;
      case 'Rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const pendingCount = approvals.filter(a => a.status === 'Pending Review').length;
  const reviewCount = approvals.filter(a => a.status === 'Under Review').length;
  const docsRequiredCount = approvals.filter(a => a.status === 'Documents Required').length;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Developer Approvals</h1>
          <p className="text-gray-600">Review and approve developer registration requests</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg mr-4">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
                <p className="text-sm text-gray-600">Pending Review</p>
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
                <p className="text-2xl font-bold text-blue-600">{reviewCount}</p>
                <p className="text-sm text-gray-600">Under Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg mr-4">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{docsRequiredCount}</p>
                <p className="text-sm text-gray-600">Docs Required</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{approvals.length}</p>
                <p className="text-sm text-gray-600">Total Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Approval Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {approvals.map((approval) => (
          <Card key={approval.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <Building className="w-5 h-5 mr-2 text-blue-600" />
                  {approval.developerName}
                </CardTitle>
                <Badge className={getStatusColor(approval.status)}>
                  <span className="flex items-center">
                    {getStatusIcon(approval.status)}
                    <span className="ml-1">{approval.status}</span>
                  </span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Contact Person</p>
                  <p className="font-medium text-gray-900">{approval.contactPerson}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">{approval.email}</p>
                  <p className="text-sm text-gray-600">{approval.phone}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="font-medium text-gray-900">{approval.experience}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Registered</p>
                    <p className="font-medium text-gray-900">
                      {new Date(approval.registrationDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-500">Documents</p>
                    <p className="text-sm font-medium">
                      {approval.documentsSubmitted}/{approval.requiredDocuments}
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all" 
                      style={{ width: `${(approval.documentsSubmitted / approval.requiredDocuments) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex space-x-2 pt-3">
                  <Button variant="outline" size="sm" className="flex-1">
                    Review Details
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Approve
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                  >
                    <XCircle className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}