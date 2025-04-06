
import { useState, useEffect } from "react";
import { useMovies } from "@/contexts/MovieContext";
import FeaturedMovies from "@/components/movie/FeaturedMovies";
import MovieList from "@/components/movie/MovieList";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const { movies, newReleases, loading } = useMovies();
  const [categoryLists, setCategoryLists] = useState<{ id: number; name: string; movies: any[] }[]>([]);

  useEffect(() => {
    // Create category lists
    const categories = [
      { id: 1, name: "Action" },
      { id: 3, name: "Drama" },
      { id: 6, name: "Sci-Fi" },
    ];

    const lists = categories.map((category) => ({
      ...category,
      movies: movies.filter((movie) => movie.categoryIds.includes(category.id)).slice(0, 8),
    }));

    setCategoryLists(lists);
  }, [movies]);

  if (loading) {
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

      {categoryLists.map((category) => (
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
