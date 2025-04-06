
import { AuthForm } from "@/components/auth/AuthForm";
import { Film } from "lucide-react";
import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-cover bg-center"
      style={{ 
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url("https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1920&auto=format&fit=crop")'
      }}
    >
      <div className="mb-8 text-center">
        <Link to="/" className="inline-flex items-center gap-2">
          <Film className="h-8 w-8 text-primary" />
          <span className="font-bold text-2xl">MovieMate</span>
        </Link>
      </div>
      
      <AuthForm formType="login" />
      
      <div className="mt-8 text-sm text-center text-muted-foreground">
        <p>
          Demo credits: <br />
          User: user@example.com / password123 <br />
          Admin: admin@example.com / admin123
        </p>
      </div>
    </div>
  );
}
