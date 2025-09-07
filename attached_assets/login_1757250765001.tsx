import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Shield, User, Lock, UserCircle, UserPlus, Mail, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, developerRegisterSchema, type LoginInput, type DeveloperRegisterInput } from "../../../shared/schema";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  // Login form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  // Registration form
  const {
    register: registerForm,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
    setValue: setRegisterValue,
    watch: watchRegister,
    reset: resetRegister
  } = useForm<DeveloperRegisterInput>({
    resolver: zodResolver(developerRegisterSchema),
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginInput) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Login successful! Redirecting...",
      });
      // Redirect to dashboard
      window.location.href = "/";
    },
    onError: (error: Error) => {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: DeveloperRegisterInput) => {
      const response = await fetch("/api/auth/register-developer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Registration Submitted",
        description: "Your developer account has been submitted for approval. You will be notified once approved.",
      });
      resetRegister();
    },
    onError: (error: Error) => {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      await loginMutation.mutateAsync(data);
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = async (data: DeveloperRegisterInput) => {
    setIsRegisterLoading(true);
    try {
      await registerMutation.mutateAsync(data);
    } finally {
      setIsRegisterLoading(false);
    }
  };

  const role = watch("role");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Building className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            RealEstate CRM
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Sales Management System
          </p>
        </div>

        {/* Login/Registration Card */}
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
              <Shield className="w-6 h-6 text-blue-600" />
              RealEstate CRM
            </CardTitle>
            <p className="text-gray-600">
              Access your account or register as a developer
            </p>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Login
                </TabsTrigger>
                <TabsTrigger value="register" className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Register
                </TabsTrigger>
              </TabsList>
              
              {/* Demo Credentials */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-semibold text-blue-900 mb-2">Demo Credentials:</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-blue-800">
                  <div>
                    <span className="font-medium">Master:</span> admin / admin123
                  </div>
                  <div>
                    <span className="font-medium">Developer:</span> sales / sales123
                  </div>
                  <div>
                    <span className="font-medium">Sales Admin:</span> exec / exec123
                  </div>
                  <div>
                    <span className="font-medium">Sales Exec:</span> master / master123
                  </div>
                </div>
              </div>

              {/* Login Tab */}
              <TabsContent value="login" className="mt-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-2">
                <Label htmlFor="role" className="flex items-center gap-2">
                  <UserCircle className="w-4 h-4" />
                  Select Your Role
                </Label>
                <Select
                  onValueChange={(value) => setValue("role", value as any)}
                  required
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Choose your access level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="master">
                      Master Owner (App Owner)
                    </SelectItem>
                    <SelectItem value="developer_hq">
                      Real Estate Developer
                    </SelectItem>
                    <SelectItem value="sales_admin">
                      Sales Admin
                    </SelectItem>
                    <SelectItem value="sales_executive">
                      Sales Executive
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-red-500 text-sm">{errors.role.message}</p>
                )}
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  className="h-12"
                  {...register("username")}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm">{errors.username.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="h-12"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password.message}</p>
                )}
              </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg"
                    disabled={isLoading || !role}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Signing In...
                      </div>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-2" />
                        Sign In
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Registration Tab */}
              <TabsContent value="register" className="mt-6">
                <div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm text-amber-800">
                    <strong>Developer Registration:</strong> Only for Real Estate Developers. 
                    Your account will be reviewed and approved by the Master Owner.
                  </p>
                </div>
                
                <form onSubmit={handleRegisterSubmit(onRegisterSubmit)} className="space-y-4">
                  {/* Developer Name */}
                  <div className="space-y-2">
                    <Label htmlFor="developerName" className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      Developer Company Name
                    </Label>
                    <Input
                      id="developerName"
                      type="text"
                      placeholder="Enter your company name"
                      className="h-11"
                      {...registerForm("developerName")}
                    />
                    {registerErrors.developerName && (
                      <p className="text-red-500 text-sm">{registerErrors.developerName.message}</p>
                    )}
                  </div>

                  {/* Contact Person */}
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Contact Person Name
                    </Label>
                    <Input
                      id="contactPerson"
                      type="text"
                      placeholder="Enter contact person name"
                      className="h-11"
                      {...registerForm("contactPerson")}
                    />
                    {registerErrors.contactPerson && (
                      <p className="text-red-500 text-sm">{registerErrors.contactPerson.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="contact@yourcompany.com"
                      className="h-11"
                      {...registerForm("email")}
                    />
                    {registerErrors.email && (
                      <p className="text-red-500 text-sm">{registerErrors.email.message}</p>
                    )}
                  </div>

                  {/* Mobile */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Mobile Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1234567890"
                      className="h-11"
                      {...registerForm("phone")}
                    />
                    {registerErrors.phone && (
                      <p className="text-red-500 text-sm">{registerErrors.phone.message}</p>
                    )}
                  </div>

                  {/* Password Setup */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Choose a secure password"
                      className="h-11"
                      {...registerForm("password")}
                    />
                    {registerErrors.password && (
                      <p className="text-red-500 text-sm">{registerErrors.password.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-lg mt-6"
                    disabled={isRegisterLoading}
                  >
                    {isRegisterLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </div>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Register Developer Account
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => window.location.href = "/"}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}