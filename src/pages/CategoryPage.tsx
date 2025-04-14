
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Movie } from "@/contexts/MovieContext";
import MovieCard from "@/components/movie/MovieCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [category, setCategory] = useState<{ id: number; name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCategory(parseInt(id));
      fetchMoviesByCategory(parseInt(id));
    }
  }, [id]);

  const fetchCategory = async (categoryId: number) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', categoryId)
        .single();
        
      if (error) throw error;
      setCategory(data);
    } catch (err) {
      console.error("Error fetching category:", err);
    }
  };

  const fetchMoviesByCategory = async (categoryId: number) => {
    setLoading(true);
    
    try {
      // Get movie IDs that have this category
      const { data: movieCategories, error: categoriesError } = await supabase
        .from('movie_categories')
        .select('movie_id')
        .eq('category_id', categoryId);
        
      if (categoriesError) throw categoriesError;
      
      if (!movieCategories || movieCategories.length === 0) {
        setMovies([]);
        setLoading(false);
        return;
      }
      
      const movieIds = movieCategories.map(mc => mc.movie_id);
      
      // Fetch movies with those IDs
      const { data: moviesData, error: moviesError } = await supabase
        .from('movies')
        .select('*, movie_categories!inner(category_id, categories:categories(id, name))')
        .in('id', movieIds);
        
      if (moviesError) throw moviesError;
      
      // Process the data to flatten the structure
      const processedMovies = moviesData.map(movie => {
        const categories = movie.movie_categories
          ? movie.movie_categories.map((mc: any) => mc.categories)
          : [];
          
        return {
          ...movie,
          categories
        };
      });
      
      setMovies(processedMovies);
    } catch (err) {
      console.error("Error fetching movies by category:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CategorySkeleton />;
  }

  return (
    <div className="container px-4 py-6 mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{category?.name || 'Category'}</h1>
        <p className="text-muted-foreground">
          {movies.length} {movies.length === 1 ? 'movie' : 'movies'} found
        </p>
      </div>

      {movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No movies in this category</h2>
          <p className="text-muted-foreground">
            Check back later for new additions.
          </p>
        </div>
      )}
    </div>
  );
}

function CategorySkeleton() {
  return (
    <div className="container px-4 py-6 mx-auto max-w-7xl">
      <div className="mb-8">
        <Skeleton className="h-10 w-48 mb-2" />
        <Skeleton className="h-4 w-32" />
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
