
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

type AuthFormProps = {
  formType: "login" | "register";
};

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export function AuthForm({ formType }: AuthFormProps) {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const onLoginSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      navigate("/");
    } catch (error) {
      // Error is already handled in the context
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      await register(data.name, data.email, data.password);
      navigate("/");
    } catch (error) {
      // Error is already handled in the context
    } finally {
      setIsLoading(false);
    }
  };

  // Demo credentials function
  const loginWithDemoCredentials = async () => {
    setIsLoading(true);
    try {
      if (formType === "login") {
        await login("user@example.com", "password123");
        navigate("/");
      } else {
        toast.info("Please use the login page to access demo accounts");
      }
    } catch (error) {
      // Error is already handled in the context
    } finally {
      setIsLoading(false);
    }
  };

  // Demo admin credentials function
  const loginWithAdminCredentials = async () => {
    setIsLoading(true);
    try {
      if (formType === "login") {
        await login("admin@example.com", "admin123");
        navigate("/admin");
      } else {
        toast.info("Please use the login page to access admin account");
      }
    } catch (error) {
      // Error is already handled in the context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl glass-card">
      <CardHeader>
        <CardTitle>
          {formType === "login" ? "Login to Movie Mate" : "Create an Account"}
        </CardTitle>
        <CardDescription>
          {formType === "login"
            ? "Enter your credentials to access your account"
            : "Fill in your details to create a new account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {formType === "login" ? (
          <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...loginForm.register("email")}
                placeholder="your@email.com"
              />
              {loginForm.formState.errors.email && (
                <p className="text-sm text-red-500">
                  {loginForm.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...loginForm.register("password")}
                  placeholder="••••••••"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-7 w-7"
                  onClick={toggleShowPassword}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {loginForm.formState.errors.password && (
                <p className="text-sm text-red-500">
                  {loginForm.formState.errors.password.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        ) : (
          <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                {...registerForm.register("name")}
                placeholder="John Doe"
              />
              {registerForm.formState.errors.name && (
                <p className="text-sm text-red-500">
                  {registerForm.formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...registerForm.register("email")}
                placeholder="your@email.com"
              />
              {registerForm.formState.errors.email && (
                <p className="text-sm text-red-500">
                  {registerForm.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...registerForm.register("password")}
                  placeholder="••••••••"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-7 w-7"
                  onClick={toggleShowPassword}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {registerForm.formState.errors.password && (
                <p className="text-sm text-red-500">
                  {registerForm.formState.errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                {...registerForm.register("confirmPassword")}
                placeholder="••••••••"
              />
              {registerForm.formState.errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {registerForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-card px-2 text-muted-foreground">
              OR
            </span>
          </div>
        </div>
        
        <div className="grid gap-2 w-full">
          <Button
            type="button"
            variant="outline"
            onClick={loginWithDemoCredentials}
            disabled={isLoading}
          >
            Login with Demo User
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={loginWithAdminCredentials}
            disabled={isLoading}
          >
            Login with Admin Account
          </Button>
        </div>
        
        <div className="text-center text-sm">
          {formType === "login" ? (
            <p>
              Don't have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => navigate("/register")}
              >
                Sign up
              </Button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => navigate("/login")}
              >
                Log in
              </Button>
            </p>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
