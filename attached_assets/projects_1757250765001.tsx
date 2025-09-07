import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Building, MapPin, Users, Calendar } from "lucide-react";

export default function Projects() {
  const [projects] = useState([
    {
      id: 1,
      name: "Green Valley Residency",
      location: "Sector 45, Gurgaon",
      status: "Active",
      totalUnits: 120,
      soldUnits: 85,
      launchDate: "2023-06-15",
      developer: "ABC Builders"
    },
    {
      id: 2,
      name: "Skyline Towers",
      location: "Downtown Mumbai",
      status: "Pre-Launch", 
      totalUnits: 200,
      soldUnits: 0,
      launchDate: "2024-01-20",
      developer: "XYZ Properties"
    },
    {
      id: 3,
      name: "Ocean View Apartments",
      location: "Marine Drive, Chennai",
      status: "Completed",
      totalUnits: 80,
      soldUnits: 80,
      launchDate: "2022-03-10",
      developer: "Coastal Developers"
    }
  ]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Project Management</h1>
          <p className="text-gray-600">Manage real estate development projects</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <Building className="w-5 h-5 mr-2 text-blue-600" />
                  {project.name}
                </CardTitle>
                <Badge 
                  variant={project.status === 'Active' ? 'default' : 
                          project.status === 'Completed' ? 'secondary' : 'outline'}
                >
                  {project.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {project.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  {project.soldUnits}/{project.totalUnits} Units Sold
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  Launch: {new Date(project.launchDate).toLocaleDateString()}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all" 
                    style={{ width: `${(project.soldUnits / project.totalUnits) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center pt-3">
                  <span className="text-sm text-gray-500">
                    {Math.round((project.soldUnits / project.totalUnits) * 100)}% Sold
                  </span>
                  <Button variant="outline" size="sm">
                    View Details
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