import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Building, MapPin, Eye, Edit } from "lucide-react";
import { Project, InsertProject } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";

export default function Projects() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    location: "",
    totalUnits: "",
    availableUnits: "",
    startingPrice: "",
    endingPrice: "",
    imageUrl: "",
  });

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const createProjectMutation = useMutation({
    mutationFn: async (projectData: InsertProject) => {
      const response = await apiRequest("POST", "/api/projects", projectData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setIsAddProjectOpen(false);
      setNewProject({
        name: "",
        description: "",
        location: "",
        totalUnits: "",
        availableUnits: "",
        startingPrice: "",
        endingPrice: "",
        imageUrl: "",
      });
      toast({
        title: "Project added successfully",
        description: "The new project has been added to your portfolio.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error adding project",
        description: error.message || "Failed to add project",
        variant: "destructive",
      });
    },
  });

  const filteredProjects = projects.filter((project) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      project.name.toLowerCase().includes(searchLower) ||
      project.location.toLowerCase().includes(searchLower) ||
      (project.description && project.description.toLowerCase().includes(searchLower))
    );
  });

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

  const getOccupancyPercentage = (project: Project) => {
    return project.totalUnits > 0 ? Math.round(((project.soldUnits || 0) / project.totalUnits) * 100) : 0;
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProject.name || !newProject.location || !newProject.totalUnits) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const projectData: InsertProject = {
      name: newProject.name!,
      description: newProject.description || null,
      location: newProject.location!,
      totalUnits: parseInt(newProject.totalUnits!) || 0,
      availableUnits: parseInt(newProject.availableUnits!) || parseInt(newProject.totalUnits!) || 0,
      soldUnits: 0,
      startingPrice: newProject.startingPrice ? parseFloat(newProject.startingPrice) : null,
      endingPrice: newProject.endingPrice ? parseFloat(newProject.endingPrice) : null,
      imageUrl: newProject.imageUrl || null,
      isActive: true,
    };

    createProjectMutation.mutate(projectData);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading projects...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <Header title="Project Management" description="Manage your real estate projects and developments" />
        
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
                    <p className="text-2xl font-bold text-blue-600" data-testid="stat-total-projects">
                      {projects.length}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Projects</p>
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
                    <p className="text-2xl font-bold text-green-600" data-testid="stat-active-projects">
                      {projects.filter(p => p.isActive).length}
                    </p>
                    <p className="text-sm text-muted-foreground">Active Projects</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg mr-3">
                    <Building className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600" data-testid="stat-total-units">
                      {projects.reduce((sum, p) => sum + p.totalUnits, 0)}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Units</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg mr-3">
                    <Building className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-600" data-testid="stat-sold-units">
                      {projects.reduce((sum, p) => sum + p.soldUnits, 0)}
                    </p>
                    <p className="text-sm text-muted-foreground">Units Sold</p>
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
                    placeholder="Search projects..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    data-testid="input-search-projects"
                  />
                </div>

                <Dialog open={isAddProjectOpen} onOpenChange={setIsAddProjectOpen}>
                  <DialogTrigger asChild>
                    <Button data-testid="button-add-project">
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Project
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Add New Project</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddProject} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Project Name *</Label>
                        <Input
                          id="name"
                          value={newProject.name || ""}
                          onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                          required
                          data-testid="input-project-name"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="location">Location *</Label>
                        <Input
                          id="location"
                          value={newProject.location || ""}
                          onChange={(e) => setNewProject({ ...newProject, location: e.target.value })}
                          required
                          data-testid="input-project-location"
                        />
                      </div>

                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Project description"
                          value={newProject.description || ""}
                          onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                          data-testid="textarea-project-description"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="totalUnits">Total Units *</Label>
                          <Input
                            id="totalUnits"
                            type="number"
                            value={newProject.totalUnits?.toString() || ""}
                            onChange={(e) => setNewProject({ ...newProject, totalUnits: e.target.value })}
                            required
                            data-testid="input-project-totalUnits"
                          />
                        </div>
                        <div>
                          <Label htmlFor="availableUnits">Available Units</Label>
                          <Input
                            id="availableUnits"
                            type="number"
                            value={newProject.availableUnits?.toString() || ""}
                            onChange={(e) => setNewProject({ ...newProject, availableUnits: e.target.value })}
                            data-testid="input-project-availableUnits"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="startingPrice">Starting Price</Label>
                          <Input
                            id="startingPrice"
                            type="number"
                            value={newProject.startingPrice?.toString() || ""}
                            onChange={(e) => setNewProject({ ...newProject, startingPrice: e.target.value })}
                            data-testid="input-project-startingPrice"
                          />
                        </div>
                        <div>
                          <Label htmlFor="endingPrice">Ending Price</Label>
                          <Input
                            id="endingPrice"
                            type="number"
                            value={newProject.endingPrice?.toString() || ""}
                            onChange={(e) => setNewProject({ ...newProject, endingPrice: e.target.value })}
                            data-testid="input-project-endingPrice"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="imageUrl">Image URL</Label>
                        <Input
                          id="imageUrl"
                          type="url"
                          value={newProject.imageUrl || ""}
                          onChange={(e) => setNewProject({ ...newProject, imageUrl: e.target.value })}
                          data-testid="input-project-imageUrl"
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsAddProjectOpen(false)}
                          className="flex-1"
                          data-testid="button-cancel-add-project"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1"
                          disabled={createProjectMutation.isPending}
                          data-testid="button-save-project"
                        >
                          {createProjectMutation.isPending ? "Adding..." : "Add Project"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const occupancyPercentage = getOccupancyPercentage(project);
              
              return (
                <Card key={project.id} className="hover:shadow-lg transition-shadow" data-testid={`project-card-${project.id}`}>
                  <CardContent className="p-0">
                    <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                      {project.imageUrl ? (
                        <img 
                          src={project.imageUrl} 
                          alt={project.name}
                          className="w-full h-full object-cover rounded-t-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).nextElementSibling!.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={project.imageUrl ? 'hidden' : ''}>
                        <Building className="w-12 h-12 text-muted-foreground" />
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg text-foreground">{project.name}</h3>
                        <Badge variant={project.isActive ? "default" : "secondary"}>
                          {project.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground mb-3">
                        <MapPin className="w-4 h-4 mr-1" />
                        {project.location}
                      </div>
                      
                      {project.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Total Units</span>
                          <span className="font-medium">{project.totalUnits}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Units Sold</span>
                          <span className="font-medium text-green-600">{project.soldUnits}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Available</span>
                          <span className="font-medium text-blue-600">{project.availableUnits}</span>
                        </div>
                        
                        {project.startingPrice && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Price Range</span>
                            <span className="font-medium">
                              {formatCurrency(project.startingPrice)} - {formatCurrency(project.endingPrice)}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Occupancy</span>
                          <span className="font-medium">{occupancyPercentage}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all" 
                            style={{ width: `${occupancyPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => setSelectedProject(project)}
                          data-testid={`button-view-project-${project.id}`}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          data-testid={`button-edit-project-${project.id}`}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {filteredProjects.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center" data-testid="no-projects-message">
                <Building className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No projects found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? "No projects match your search criteria." : "Get started by adding your first project."}
                </p>
                <Button onClick={() => setIsAddProjectOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Project
                </Button>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
