import { useState, useEffect } from "react";
import { useMovies, Movie } from "@/contexts/MovieContext";
import MovieCard from "@/components/movie/MovieCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export default function WatchlistPage() {
  const { watchlist } = useMovies();
  const [watchlistMovies, setWatchlistMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchWatchlistMovies();
  }, [watchlist, user]);

  const fetchWatchlistMovies = async () => {
    setLoading(true);

    try {
      if (watchlist.length === 0) {
        setWatchlistMovies([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('movies')
        .select('*, movie_categories!inner(category_id, categories:categories(id, name))')
        .in('id', watchlist);

      if (error) throw error;

      if (data) {
        const processedMovies = data.map(movie => {
          const categories = movie.movie_categories
            ? movie.movie_categories.map((mc: any) => mc.categories)
            : [];
            
          return {
            ...movie,
            categories
          };
        });
        
        setWatchlistMovies(processedMovies);
      }
    } catch (err) {
      console.error("Error fetching watchlist movies:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <WatchlistSkeleton />;
  }

  return (
    <div className="container px-4 py-6 mx-auto max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Watchlist</h1>
        <div className="text-sm text-muted-foreground">
          {watchlistMovies.length} {watchlistMovies.length === 1 ? "movie" : "movies"}
        </div>
      </div>

      {watchlistMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {watchlistMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Film className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Your watchlist is empty</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Start adding movies to your watchlist by clicking the heart icon on any movie card.
          </p>
          <Button onClick={() => navigate("/")}>Browse Movies</Button>
        </div>
      )}
    </div>
  );
}

function WatchlistSkeleton() {
  return (
    <div className="container px-4 py-6 mx-auto max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-5 w-20" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {Array(12)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="aspect-[2/3] w-full rounded-md" />
          ))}
      </div>
    </div>
  );
}
