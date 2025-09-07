import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Building,
  Users,
  UserCheck,
  Package,
  CreditCard,
  MessageSquare,
  Handshake,
  BarChart3,
  Settings,
  Shield,
  LayoutDashboard,
  LogOut,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Leads", href: "/leads", icon: Users, badge: "247" },
  { name: "Customers", href: "/customers", icon: UserCheck },
  { name: "Projects", href: "/projects", icon: Building },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Payments", href: "/payments", icon: CreditCard },
  { name: "Communications", href: "/communications", icon: MessageSquare },
  { name: "Channel Partners", href: "/channel-partners", icon: Handshake },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "User Management", href: "/user-management", icon: Shield },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const getRoleName = (role: string) => {
    switch (role) {
      case "master": return "Master Owner";
      case "developer_hq": return "Developer HQ";
      case "sales_admin": return "Sales Admin";
      case "sales_executive": return "Sales Executive";
      default: return role;
    }
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
            <Building className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">RealEstate Pro</h1>
            <p className="text-xs text-muted-foreground">CRM Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          
          return (
            <Link key={item.name} href={item.href}>
              <a
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
                data-testid={`nav-link-${item.href}`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
                {item.badge && (
                  <span className="ml-auto bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </a>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4">
        <div className="bg-gradient-to-r from-primary to-blue-600 rounded-lg p-3 text-center">
          <p className="text-primary-foreground font-medium text-sm">
            {user ? getRoleName(user.role) : ""}
          </p>
          <p className="text-primary-foreground/80 text-xs">
            {user ? `${user.firstName} ${user.lastName}` : ""}
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 w-full text-primary-foreground hover:bg-white/20"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {logoutMutation.isPending ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>
    </div>
  );
}
