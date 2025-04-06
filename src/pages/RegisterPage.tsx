
import { AuthForm } from "@/components/auth/AuthForm";
import { Film } from "lucide-react";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-cover bg-center"
      style={{ 
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url("https://images.unsplash.com/photo-1595769816263-9b910be24d5f?q=80&w=1920&auto=format&fit=crop")'
      }}
    >
      <div className="mb-8 text-center">
        <Link to="/" className="inline-flex items-center gap-2">
          <Film className="h-8 w-8 text-primary" />
          <span className="font-bold text-2xl">MovieMate</span>
        </Link>
      </div>
      
      <AuthForm formType="register" />
    </div>
  );
}
