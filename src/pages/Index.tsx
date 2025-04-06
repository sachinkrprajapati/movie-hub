
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to homepage
    navigate("/");
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-xl text-muted-foreground">Redirecting to Movie Mate...</p>
    </div>
  );
};

export default Index;
