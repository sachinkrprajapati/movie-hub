
import { useState, useEffect } from "react";
import { useMovies } from "@/contexts/MovieContext";
import FeaturedMovies from "@/components/movie/FeaturedMovies";
import MovieList from "@/components/movie/MovieList";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

export default function HomePage() {
  const { movies, newReleases, loading: moviesLoading } = useMovies();
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryMovies, setCategoryMovies] = useState<{ id: number; name: string; movies: any[] }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch categories from Supabase
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .limit(4);
          
        if (error) throw error;
        setCategories(data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    
    fetchCategories();
  }, []);

  useEffect(() => {
    // When both movies and categories are loaded, create category lists
    if (!moviesLoading && categories.length > 0 && movies.length > 0) {
      const lists = categories.map(category => {
        // Filter movies that have this category
        const categoryMovies = movies.filter(movie => 
          movie.categories && movie.categories.some(cat => cat.id === category.id)
        ).slice(0, 8);
        
        return {
          ...category,
          movies: categoryMovies
        };
      });
      
      setCategoryMovies(lists);
      setLoading(false);
    } else if (!moviesLoading && movies.length === 0) {
      // If no movies are loading but we have none, we're done loading
      setLoading(false);
    }
  }, [moviesLoading, categories, movies]);

  if (loading || moviesLoading) {
    return <HomePageSkeleton />;
  }

  return (
    <div className="container px-4 py-6 mx-auto max-w-7xl">
      <FeaturedMovies />
      
      <MovieList
        title="New Releases"
        movies={newReleases}
        seeAllLink="/movies/new"
      />

      {categoryMovies.map((category) => (
        <MovieList
          key={category.id}
          title={category.name}
          movies={category.movies}
          seeAllLink={`/category/${category.id}`}
        />
      ))}
    </div>
  );
}

function HomePageSkeleton() {
  return (
    <div className="container px-4 py-6 mx-auto max-w-7xl">
      <div className="relative aspect-video md:aspect-[21/9] overflow-hidden rounded-lg my-6">
        <Skeleton className="h-full w-full" />
      </div>

      <div className="my-8">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex-none w-[160px] md:w-[200px]">
                <Skeleton className="aspect-[2/3] w-full rounded-md" />
              </div>
            ))}
        </div>
      </div>

      <div className="my-8">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex-none w-[160px] md:w-[200px]">
                <Skeleton className="aspect-[2/3] w-full rounded-md" />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
