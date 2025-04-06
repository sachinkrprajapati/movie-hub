
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Movie } from "@/contexts/MovieContext";
import MovieCard from "./MovieCard";
import { Button } from "@/components/ui/button";

interface MovieListProps {
  title: string;
  movies: Movie[];
  seeAllLink?: string;
}

export default function MovieList({ title, movies, seeAllLink }: MovieListProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollAmount = 300;

  const handleScroll = (direction: "left" | "right") => {
    const container = document.getElementById(`movie-list-${title}`);
    if (!container) return;

    const newPosition =
      direction === "left"
        ? Math.max(scrollPosition - scrollAmount, 0)
        : scrollPosition + scrollAmount;

    container.scrollTo({
      left: newPosition,
      behavior: "smooth",
    });

    setScrollPosition(newPosition);
  };

  return (
    <div className="my-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        {seeAllLink && (
          <a
            href={seeAllLink}
            className="text-sm text-primary hover:underline"
          >
            See All
          </a>
        )}
      </div>
      <div className="relative">
        <div
          id={`movie-list-${title}`}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="flex-none w-[160px] md:w-[200px] snap-start"
            >
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90 rounded-full h-10 w-10 flex items-center justify-center shadow-lg hidden md:flex"
          onClick={() => handleScroll("left")}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90 rounded-full h-10 w-10 flex items-center justify-center shadow-lg hidden md:flex"
          onClick={() => handleScroll("right")}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
