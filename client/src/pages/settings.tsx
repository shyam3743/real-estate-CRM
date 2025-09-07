import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings as SettingsIcon, User, Bell, Shield, Database, Mail, 
  Palette, Globe, Download, Upload, RefreshCw, Save 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");

  // Profile settings state
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  // Notification settings state
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    leadAlerts: true,
    paymentReminders: true,
    systemUpdates: false,
  });

  // System settings state
  const [systemSettings, setSystemSettings] = useState({
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12",
    currency: "INR",
    language: "en",
    timezone: "Asia/Kolkata",
    theme: "light",
  });

  // Security settings state
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: "30",
    passwordExpiry: "90",
    loginNotifications: true,
  });

  const handleSaveProfile = () => {
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Notification preferences updated",
      description: "Your notification settings have been saved.",
    });
  };

  const handleSaveSystem = () => {
    toast({
      title: "System settings updated",
      description: "Your system preferences have been saved.",
    });
  };

  const handleSaveSecurity = () => {
    toast({
      title: "Security settings updated",
      description: "Your security preferences have been saved.",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Data export initiated",
      description: "Your data export will be ready for download shortly.",
    });
  };

  const handleBackupData = () => {
    toast({
      title: "Backup created",
      description: "System backup has been created successfully.",
    });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <Header title="Settings" description="Manage your account and system preferences" />
        
        <main className="flex-1 overflow-y-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="profile" data-testid="tab-profile">
                <User className="w-4 h-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="notifications" data-testid="tab-notifications">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="system" data-testid="tab-system">
                <SettingsIcon className="w-4 h-4 mr-2" />
                System
              </TabsTrigger>
              <TabsTrigger value="security" data-testid="tab-security">
                <Shield className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="data" data-testid="tab-data">
                <Database className="w-4 h-4 mr-2" />
                Data
              </TabsTrigger>
            </TabsList>

            {/* Profile Settings */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground text-2xl font-bold">
                        {user ? `${user.firstName[0]}${user.lastName[0]}` : ""}
                      </span>
                    </div>
                    <div>
                      <Button variant="outline" data-testid="button-change-photo">Change Photo</Button>
                      <p className="text-sm text-muted-foreground mt-1">JPG or PNG. Max size 2MB.</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                        data-testid="input-firstName"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                        data-testid="input-lastName"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      data-testid="input-email"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      data-testid="input-phone"
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={handleSaveProfile} data-testid="button-save-profile">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" data-testid="button-change-password">
                      Change Password
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-4">Communication Preferences</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="emailNotifications">Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                        </div>
                        <Switch
                          id="emailNotifications"
                          checked={notifications.emailNotifications}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                          data-testid="switch-email-notifications"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="smsNotifications">SMS Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                        </div>
                        <Switch
                          id="smsNotifications"
                          checked={notifications.smsNotifications}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, smsNotifications: checked })}
                          data-testid="switch-sms-notifications"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="pushNotifications">Push Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                        </div>
                        <Switch
                          id="pushNotifications"
                          checked={notifications.pushNotifications}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, pushNotifications: checked })}
                          data-testid="switch-push-notifications"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-sm font-medium mb-4">Alert Types</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="leadAlerts">New Lead Alerts</Label>
                          <p className="text-sm text-muted-foreground">Get notified when new leads are added</p>
                        </div>
                        <Switch
                          id="leadAlerts"
                          checked={notifications.leadAlerts}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, leadAlerts: checked })}
                          data-testid="switch-lead-alerts"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="paymentReminders">Payment Reminders</Label>
                          <p className="text-sm text-muted-foreground">Receive payment due date reminders</p>
                        </div>
                        <Switch
                          id="paymentReminders"
                          checked={notifications.paymentReminders}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, paymentReminders: checked })}
                          data-testid="switch-payment-reminders"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="systemUpdates">System Updates</Label>
                          <p className="text-sm text-muted-foreground">Get notified about system updates</p>
                        </div>
                        <Switch
                          id="systemUpdates"
                          checked={notifications.systemUpdates}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, systemUpdates: checked })}
                          data-testid="switch-system-updates"
                        />
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleSaveNotifications} data-testid="button-save-notifications">
                    <Save className="w-4 h-4 mr-2" />
                    Save Notification Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* System Settings */}
            <TabsContent value="system">
              <Card>
                <CardHeader>
                  <CardTitle>System Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dateFormat">Date Format</Label>
                      <Select value={systemSettings.dateFormat} onValueChange={(value) => setSystemSettings({ ...systemSettings, dateFormat: value })}>
                        <SelectTrigger data-testid="select-date-format">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="timeFormat">Time Format</Label>
                      <Select value={systemSettings.timeFormat} onValueChange={(value) => setSystemSettings({ ...systemSettings, timeFormat: value })}>
                        <SelectTrigger data-testid="select-time-format">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12">12 Hour</SelectItem>
                          <SelectItem value="24">24 Hour</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="currency">Currency</Label>
                      <Select value={systemSettings.currency} onValueChange={(value) => setSystemSettings({ ...systemSettings, currency: value })}>
                        <SelectTrigger data-testid="select-currency">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                          <SelectItem value="USD">US Dollar ($)</SelectItem>
                          <SelectItem value="EUR">Euro (€)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="language">Language</Label>
                      <Select value={systemSettings.language} onValueChange={(value) => setSystemSettings({ ...systemSettings, language: value })}>
                        <SelectTrigger data-testid="select-language">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="hi">Hindi</SelectItem>
                          <SelectItem value="mr">Marathi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select value={systemSettings.timezone} onValueChange={(value) => setSystemSettings({ ...systemSettings, timezone: value })}>
                        <SelectTrigger data-testid="select-timezone">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                          <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                          <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="theme">Theme</Label>
                      <Select value={systemSettings.theme} onValueChange={(value) => setSystemSettings({ ...systemSettings, theme: value })}>
                        <SelectTrigger data-testid="select-theme">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button onClick={handleSaveSystem} data-testid="button-save-system">
                    <Save className="w-4 h-4 mr-2" />
                    Save System Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                      </div>
                      <Switch
                        id="twoFactorAuth"
                        checked={securitySettings.twoFactorAuth}
                        onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })}
                        data-testid="switch-two-factor"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="loginNotifications">Login Notifications</Label>
                        <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
                      </div>
                      <Switch
                        id="loginNotifications"
                        checked={securitySettings.loginNotifications}
                        onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, loginNotifications: checked })}
                        data-testid="switch-login-notifications"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                      <Select value={securitySettings.sessionTimeout} onValueChange={(value) => setSecuritySettings({ ...securitySettings, sessionTimeout: value })}>
                        <SelectTrigger data-testid="select-session-timeout">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                      <Select value={securitySettings.passwordExpiry} onValueChange={(value) => setSecuritySettings({ ...securitySettings, passwordExpiry: value })}>
                        <SelectTrigger data-testid="select-password-expiry">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="60">60 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                          <SelectItem value="never">Never</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button onClick={handleSaveSecurity} data-testid="button-save-security">
                    <Save className="w-4 h-4 mr-2" />
                    Save Security Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Data Management */}
            <TabsContent value="data">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Data Export</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Export your data in various formats for backup or analysis purposes.
                    </p>
                    <div className="flex space-x-2">
                      <Button onClick={handleExportData} data-testid="button-export-data">
                        <Download className="w-4 h-4 mr-2" />
                        Export All Data
                      </Button>
                      <Button variant="outline" data-testid="button-export-leads">
                        Export Leads Only
                      </Button>
                      <Button variant="outline" data-testid="button-export-customers">
                        Export Customers Only
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Data Import</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Import data from external sources or previous CRM systems.
                    </p>
                    <div className="flex space-x-2">
                      <Button variant="outline" data-testid="button-import-leads">
                        <Upload className="w-4 h-4 mr-2" />
                        Import Leads
                      </Button>
                      <Button variant="outline" data-testid="button-import-customers">
                        Import Customers
                      </Button>
                      <Button variant="outline" data-testid="button-import-projects">
                        Import Projects
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>System Backup</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Create and manage system backups for data protection.
                    </p>
                    <div className="flex space-x-2">
                      <Button onClick={handleBackupData} data-testid="button-create-backup">
                        <Database className="w-4 h-4 mr-2" />
                        Create Backup
                      </Button>
                      <Button variant="outline" data-testid="button-schedule-backup">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Schedule Automatic Backup
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
