
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useMovies, Movie } from "@/contexts/MovieContext";
import MovieCard from "@/components/movie/MovieCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchValue, setSearchValue] = useState(query);
  const { searchMovies } = useMovies();
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSearchValue(query);
    
    // Simulate loading delay
    setLoading(true);
    const timer = setTimeout(() => {
      const searchResults = query 
        ? searchMovies(query)
        : [];
      setResults(searchResults);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [query, searchMovies]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      setSearchParams({ q: searchValue.trim() });
    } else {
      setSearchParams({});
    }
  };

  const clearSearch = () => {
    setSearchValue("");
    setSearchParams({});
  };

  return (
    <div className="container px-4 py-6 mx-auto max-w-7xl">
      <div className="max-w-2xl mx-auto mb-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Search Movies</h1>
        
        <form onSubmit={handleSearch} className="relative mb-6">
          <Input
            type="search"
            placeholder="Search by title or description..."
            className="h-12 pl-12 pr-12 text-lg"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            autoFocus
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          {searchValue && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-12 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button
            type="submit"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-10"
          >
            Search
          </Button>
        </form>
      </div>

      {loading ? (
        <SearchResultsSkeleton />
      ) : (
        <div>
          {query ? (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold">
                  {results.length} {results.length === 1 ? 'result' : 'results'} for "{query}"
                </h2>
              </div>

              {results.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                  {results.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">No movies found</h3>
                  <p className="text-muted-foreground mb-4">
                    We couldn't find any movies matching your search.
                  </p>
                  <Button onClick={clearSearch}>Clear Search</Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">Search for movies</h2>
              <p className="text-muted-foreground">
                Enter a movie title or description in the search box above.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SearchResultsSkeleton() {
  return (
    <div>
      <div className="mb-6">
        <Skeleton className="h-8 w-64" />
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
