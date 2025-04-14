
import { useState } from "react";
import { Link } from "react-router-dom";
import { Play, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useMovies, Movie } from "@/contexts/MovieContext";

interface MovieCardProps {
  movie: Movie;
  className?: string;
}

export default function MovieCard({ movie, className }: MovieCardProps) {
  const { toggleWatchlist, watchlist } = useMovies();
  const [isHovered, setIsHovered] = useState(false);
  const isInWatchlist = watchlist.includes(movie.id);

  const handleToggleWatchlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    await toggleWatchlist(movie.id);
  };

  return (
    <div
      className={cn("movie-card group", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-md">
        <img
          src={movie.poster_url}
          alt={movie.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="movie-card-overlay flex flex-col justify-end p-4">
          <h3 className="text-lg font-bold text-white line-clamp-1">{movie.title}</h3>
          <div className="flex items-center gap-2 text-xs text-white/80 mt-1">
            <span>{movie.year}</span>
            <span>•</span>
            <span>{Math.floor(movie.duration / 60)}h {movie.duration % 60}m</span>
            <span>•</span>
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-3 h-3 text-yellow-400 mr-1"
              >
                <path
                  fillRule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                  clipRule="evenodd"
                />
              </svg>
              {movie.rating.toFixed(1)}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Button asChild size="sm" className="flex-1">
              <Link to={`/movie/${movie.id}`}>
                <Play className="h-4 w-4 mr-1" /> Play
              </Link>
            </Button>
            <Button
              size="icon"
              variant={isInWatchlist ? "default" : "secondary"}
              className="h-8 w-8"
              onClick={handleToggleWatchlist}
            >
              <Heart
                className={cn("h-4 w-4", isInWatchlist && "fill-current")}
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
