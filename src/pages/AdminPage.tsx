import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Film, 
  Users, 
  MessageSquare, 
  BarChart4, 
  Plus,
  Edit,
  Trash2
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Movie, useMovies } from "@/contexts/MovieContext";

export default function AdminPage() {
  const { user } = useAuth();
  const { movies } = useMovies();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && user.role !== "admin") {
      toast.error("You don't have permission to access the admin panel");
      navigate("/");
    }
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [user, navigate]);
  
  const handleAddMovie = () => {
    toast.info("This would open the movie creation form");
  };

  const handleEditMovie = (movie: Movie) => {
    toast.info(`Editing movie: ${movie.title}`);
  };

  const handleDeleteMovie = (movie: Movie) => {
    toast.info(`Deleting movie: ${movie.title}`);
  };

  if (!user || user.role !== "admin") {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container px-4 py-6 mx-auto max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Movies</CardTitle>
            <Film className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : movies.length}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registered Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : "245"}</div>
            <p className="text-xs text-muted-foreground">+18 from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : "12"}</div>
            <p className="text-xs text-muted-foreground">+3 from last hour</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <BarChart4 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : "1,284"}</div>
            <p className="text-xs text-muted-foreground">+42 from yesterday</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Movies Management</h2>
        <Button onClick={handleAddMovie}>
          <Plus className="mr-2 h-4 w-4" /> Add Movie
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Categories</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(5).fill(0).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">Loading...</TableCell>
                    <TableCell>...</TableCell>
                    <TableCell>...</TableCell>
                    <TableCell>...</TableCell>
                    <TableCell>...</TableCell>
                    <TableCell className="text-right">...</TableCell>
                  </TableRow>
                ))
              ) : (
                movies.map((movie) => (
                  <TableRow key={movie.id}>
                    <TableCell className="font-medium">{movie.title}</TableCell>
                    <TableCell>{movie.year}</TableCell>
                    <TableCell>{Math.floor(movie.duration / 60)}h {movie.duration % 60}m</TableCell>
                    <TableCell>{movie.rating.toFixed(1)}</TableCell>
                    <TableCell>
                      {movie.categories && movie.categories.map((category) => (
                        <span 
                          key={category.id}
                          className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold mr-1 mb-1"
                        >
                          {category.name}
                        </span>
                      ))}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditMovie(movie)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteMovie(movie)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
