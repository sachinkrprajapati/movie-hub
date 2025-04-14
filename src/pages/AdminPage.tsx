
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
  Trash2,
  UserCog,
  Lock
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
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminDetailsForm } from "@/components/admin/AdminDetailsForm";
import { PasswordUpdateForm } from "@/components/admin/PasswordUpdateForm";

export interface AdminDetails {
  id: string;
  department: string | null;
  access_level: string | null;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

export default function AdminPage() {
  const { user, profile } = useAuth();
  const { movies } = useMovies();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [adminDetails, setAdminDetails] = useState<AdminDetails | null>(null);
  const [activeTab, setActiveTab] = useState("movies");

  useEffect(() => {
    if (user && profile?.role !== "admin") {
      toast.error("You don't have permission to access the admin panel");
      navigate("/");
    }
    
    const fetchAdminDetails = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from("admin_details")
            .select("*")
            .eq("id", user.id)
            .maybeSingle();

          if (error) {
            console.error("Error fetching admin details:", error);
          } else if (data) {
            setAdminDetails(data as AdminDetails);
          } else {
            // Create admin details record if it doesn't exist
            const { error: insertError } = await supabase
              .from("admin_details")
              .insert({
                id: user.id,
                department: "General",
                access_level: "Standard",
                last_login: new Date().toISOString()
              });

            if (insertError) {
              console.error("Error creating admin details:", insertError);
            } else {
              // Fetch the newly created record
              const { data: newData } = await supabase
                .from("admin_details")
                .select("*")
                .eq("id", user.id)
                .maybeSingle();
                
              if (newData) {
                setAdminDetails(newData as AdminDetails);
              }
            }
          }
        } catch (err) {
          console.error("Error in admin details setup:", err);
        }
      }
    };

    fetchAdminDetails();
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [user, navigate, profile]);
  
  const handleAddMovie = () => {
    toast.info("This would open the movie creation form");
  };

  const handleEditMovie = (movie: Movie) => {
    toast.info(`Editing movie: ${movie.title}`);
  };

  const handleDeleteMovie = (movie: Movie) => {
    toast.info(`Deleting movie: ${movie.title}`);
  };

  const updateAdminDetails = async (updatedDetails: Partial<AdminDetails>) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from("admin_details")
        .update({
          ...updatedDetails,
          updated_at: new Date().toISOString()
        })
        .eq("id", user.id);

      if (error) {
        toast.error("Failed to update admin details");
        console.error("Error updating admin details:", error);
      } else {
        toast.success("Admin details updated successfully");
        
        // Refresh admin details
        const { data } = await supabase
          .from("admin_details")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();
          
        if (data) {
          setAdminDetails(data as AdminDetails);
        }
      }
    } catch (err) {
      console.error("Error in updating admin details:", err);
      toast.error("An error occurred while updating admin details");
    }
  };

  if (!user || profile?.role !== "admin") {
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
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="movies">
            <Film className="mr-2 h-4 w-4" />
            Movies
          </TabsTrigger>
          <TabsTrigger value="admin">
            <UserCog className="mr-2 h-4 w-4" />
            Admin Settings
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="movies">
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
        </TabsContent>
        
        <TabsContent value="admin">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Admin Account Details</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Manage your admin profile and access settings.
            </p>
            
            {adminDetails && (
              <AdminDetailsForm 
                adminDetails={adminDetails}
                onSubmit={updateAdminDetails}
              />
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="security">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Security Settings</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Manage your account security and password settings.
            </p>
            
            <PasswordUpdateForm userId={user.id} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
