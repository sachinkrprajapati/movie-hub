
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Play, Heart, Clock, MessageCircle, Share2, ArrowLeft, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useMovies, Movie } from "@/contexts/MovieContext";
import MovieList from "@/components/movie/MovieList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getMovieById, toggleWatchlist, watchlist, movies } = useMovies();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("movie");
  const navigate = useNavigate();
  
  const movieId = parseInt(id || "0");
  const isInWatchlist = movie ? watchlist.includes(movie.id) : false;
  
  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      
      try {
        const movieData = await getMovieById(movieId);
        
        if (!movieData) {
          navigate("/not-found");
          return;
        }
        
        setMovie(movieData);
        
        // Find similar movies (ones that share categories)
        if (movieData.categories && movieData.categories.length > 0) {
          // Get category IDs from the current movie
          const categoryIds = movieData.categories.map(cat => cat.id);
          
          // Filter movies that share at least one category with the current movie
          const related = movies.filter(m => 
            m.id !== movieData.id && 
            m.categories && 
            m.categories.some(cat => categoryIds.includes(cat.id))
          ).slice(0, 6);
          
          setSimilarMovies(related);
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
        toast.error("Failed to load movie details");
      } finally {
        setLoading(false);
      }
    };
    
    if (movieId) {
      fetchMovieDetails();
    }
  }, [movieId, getMovieById, navigate, movies]);

  const handleToggleWatchlist = async () => {
    if (movie) {
      await toggleWatchlist(movie.id);
    }
  };

  if (loading) {
    return <MovieDetailSkeleton />;
  }

  if (!movie) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container px-4 py-6 mx-auto max-w-7xl">
      <Button 
        variant="ghost" 
        size="sm" 
        className="mb-4" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="col-span-1 lg:col-span-2">
          <div className="relative aspect-[2/3] overflow-hidden rounded-lg shadow-xl">
            <img
              src={movie.poster_url}
              alt={movie.title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        
        <div className="col-span-1 lg:col-span-3">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{movie.title}</h1>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-6">
            <span>{movie.year}</span>
            <span className="text-muted-foreground/50">•</span>
            <span className="flex items-center">
              <Clock className="mr-1 h-4 w-4" />
              {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
            </span>
            <span className="text-muted-foreground/50">•</span>
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 text-yellow-400 mr-1"
              >
                <path
                  fillRule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                  clipRule="evenodd"
                />
              </svg>
              {movie.rating.toFixed(1)}
            </span>
            <div className="flex flex-wrap gap-2 mt-1">
              {movie.categories && movie.categories.map((category) => (
                <span 
                  key={category.id}
                  className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  {category.name}
                </span>
              ))}
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="movie">Movie</TabsTrigger>
              <TabsTrigger value="watch-together">Watch Together</TabsTrigger>
            </TabsList>
            <TabsContent value="movie" className="pt-4">
              <p className="text-muted-foreground mb-6">
                {movie.description}
              </p>
              
              <div className="flex flex-wrap gap-3">
                <Button 
                  size="lg"
                  className="gap-2" 
                  onClick={() => setActiveTab("watch-together")}
                >
                  <Play className="h-4 w-4" /> Watch Now
                </Button>
                <Button
                  variant={isInWatchlist ? "default" : "outline"}
                  className={cn(
                    "gap-2",
                    isInWatchlist && "bg-primary text-primary-foreground"
                  )}
                  onClick={handleToggleWatchlist}
                >
                  <Heart className={cn("h-4 w-4", isInWatchlist && "fill-current")} />
                  {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="watch-together" className="pt-4">
              <div className="flex flex-col gap-4">
                <div className="aspect-video overflow-hidden rounded-lg bg-black relative">
                  <video 
                    className="w-full h-full object-contain" 
                    controls 
                    poster={movie.poster_url}
                    src={movie.video_url}
                    autoPlay
                  >
                    Your browser does not support the video tag.
                  </video>
                  
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <Button size="sm" variant="default" className="gap-1 bg-black/80 hover:bg-black/90">
                      <Users className="h-4 w-4" /> Invite Friends
                    </Button>
                    <Button size="sm" variant="default" className="gap-1 bg-black/80 hover:bg-black/90">
                      <MessageCircle className="h-4 w-4" /> Chat
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2 flex items-center">
                    <Users className="h-4 w-4 mr-2" /> Watch Together
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Invite your friends to watch this movie together in real-time!
                    Share the link or invite them directly to sync playback and chat.
                  </p>
                  <div className="mt-4 flex gap-2 flex-wrap">
                    <Button size="sm" variant="outline">Create a Room</Button>
                    <Button size="sm" variant="outline">Copy Link</Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {similarMovies.length > 0 && (
        <div className="mt-12">
          <MovieList title="You might also like" movies={similarMovies} />
        </div>
      )}
    </div>
  );
}

function MovieDetailSkeleton() {
  return (
    <div className="container px-4 py-6 mx-auto max-w-7xl">
      <Button variant="ghost" size="sm" className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="col-span-1 lg:col-span-2">
          <Skeleton className="aspect-[2/3] w-full rounded-lg" />
        </div>
        
        <div className="col-span-1 lg:col-span-3">
          <Skeleton className="h-10 w-2/3 mb-3" />
          
          <div className="flex items-center gap-2 mb-6">
            <Skeleton className="h-5 w-10" />
            <Skeleton className="h-5 w-10" />
            <Skeleton className="h-5 w-10" />
          </div>
          
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-6" />
          
          <div className="flex gap-3">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}
