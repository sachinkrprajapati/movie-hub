
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Info, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMovies, Movie } from "@/contexts/MovieContext";
import { cn } from "@/lib/utils";

export default function FeaturedMovies() {
  const { featuredMovies, toggleWatchlist, watchlist } = useMovies();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  const currentMovie = featuredMovies[currentIndex];
  const isInWatchlist = currentMovie ? watchlist.includes(currentMovie.id) : false;

  useEffect(() => {
    if (!isPaused) {
      const timer = setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredMovies.length);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, featuredMovies.length, isPaused]);

  if (!currentMovie) return null;

  return (
    <div 
      className="relative aspect-video md:aspect-[21/9] overflow-hidden rounded-lg my-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div 
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
        style={{ backgroundImage: `url(${currentMovie.posterUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      
      <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12">
        <div className="max-w-lg">
          <h1 className="text-3xl md:text-5xl font-bold mb-3">{currentMovie.title}</h1>
          <div className="flex items-center gap-2 text-sm text-white/80 mb-4">
            <span>{currentMovie.year}</span>
            <span className="text-white/50">•</span>
            <span>{Math.floor(currentMovie.duration / 60)}h {currentMovie.duration % 60}m</span>
            <span className="text-white/50">•</span>
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
              {currentMovie.rating.toFixed(1)}
            </span>
          </div>
          <p className="text-white/80 mb-6 line-clamp-2 md:line-clamp-3">
            {currentMovie.description}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button 
              className="gap-2" 
              onClick={() => navigate(`/movie/${currentMovie.id}`)}
            >
              <Play className="h-4 w-4" /> Watch Now
            </Button>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => navigate(`/movie/${currentMovie.id}/details`)}
            >
              <Info className="h-4 w-4" /> More Info
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={cn(isInWatchlist && "text-white bg-primary border-primary hover:bg-primary/90 hover:text-white")}
              onClick={() => toggleWatchlist(currentMovie.id)}
            >
              <Heart className={cn("h-4 w-4", isInWatchlist && "fill-current")} />
            </Button>
          </div>
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {featuredMovies.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              index === currentIndex
                ? "bg-white w-6"
                : "bg-white/50 hover:bg-white/80"
            )}
            onClick={() => {
              setCurrentIndex(index);
              setIsPaused(true);
            }}
          />
        ))}
      </div>
    </div>
  );
}
