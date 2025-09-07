import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { Search, Bell, ChevronDown } from "lucide-react";

interface HeaderProps {
  title: string;
  description?: string;
  showLiveBadge?: boolean;
}

export function Header({ title, description, showLiveBadge = false }: HeaderProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="bg-card border-b border-border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground" data-testid="header-title">
              {title}
            </h1>
            {description && (
              <p className="text-muted-foreground" data-testid="header-description">
                {description}
              </p>
            )}
          </div>
          {showLiveBadge && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Live Data
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search leads, customers..."
              className="pl-10 pr-4 py-2 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-global-search"
            />
          </div>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="relative"
            data-testid="button-notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 bg-destructive text-destructive-foreground text-xs rounded-full h-2 w-2"></span>
          </Button>

          {/* User Menu */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-medium">
                {user ? `${user.firstName[0]}${user.lastName[0]}` : ""}
              </span>
            </div>
            <span className="text-sm font-medium text-foreground">
              {user ? `${user.firstName} ${user.lastName}` : ""}
            </span>
            <Button variant="ghost" size="sm" data-testid="button-user-menu">
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
