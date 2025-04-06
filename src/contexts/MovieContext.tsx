
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

export interface Movie {
  id: number;
  title: string;
  description: string;
  posterUrl: string;
  videoUrl: string;
  year: number;
  duration: number;
  categoryIds: number[];
  rating: number;
}

interface MovieContextType {
  movies: Movie[];
  featuredMovies: Movie[];
  newReleases: Movie[];
  getMovieById: (id: number) => Movie | undefined;
  getMoviesByCategory: (categoryId: number) => Movie[];
  searchMovies: (query: string) => Movie[];
  toggleWatchlist: (movieId: number) => void;
  watchlist: number[];
  loading: boolean;
  error: string | null;
}

// Mock data
const MOCK_MOVIES: Movie[] = [
  {
    id: 1,
    title: "Inception",
    description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
    videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    year: 2010,
    duration: 148,
    categoryIds: [1, 6],
    rating: 8.8
  },
  {
    id: 2,
    title: "The Shawshank Redemption",
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg",
    videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    year: 1994,
    duration: 142,
    categoryIds: [3],
    rating: 9.3
  },
  {
    id: 3,
    title: "The Dark Knight",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
    videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    year: 2008,
    duration: 152,
    categoryIds: [1, 3, 7],
    rating: 9.0
  },
  {
    id: 4,
    title: "Pulp Fiction",
    description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
    videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    year: 1994,
    duration: 154,
    categoryIds: [3, 7],
    rating: 8.9
  },
  {
    id: 5,
    title: "Forrest Gump",
    description: "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75, whose only desire is to be reunited with his childhood sweetheart.",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg",
    videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    year: 1994,
    duration: 142,
    categoryIds: [3, 5],
    rating: 8.8
  },
  {
    id: 6,
    title: "The Matrix",
    description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
    videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    year: 1999,
    duration: 136,
    categoryIds: [1, 6],
    rating: 8.7
  },
  {
    id: 7,
    title: "Goodfellas",
    description: "The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito in the Italian-American crime syndicate.",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BY2NkZjEzMDgtN2RjYy00YzM1LWI4ZmQtMjIwYjFjNmI3ZGEwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
    videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    year: 1990,
    duration: 146,
    categoryIds: [3, 7],
    rating: 8.7
  },
  {
    id: 8,
    title: "Fight Club",
    description: "An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMmEzNTkxYjQtZTc0MC00YTVjLTg5ZTEtZWMwOWVlYzY0NWIwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
    videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    year: 1999,
    duration: 139,
    categoryIds: [3],
    rating: 8.8
  }
];

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider = ({ children }: { children: ReactNode }) => {
  const [movies, setMovies] = useState<Movie[]>(MOCK_MOVIES);
  const [watchlist, setWatchlist] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load watchlist from localStorage
    const savedWatchlist = localStorage.getItem("moviemate_watchlist");
    if (savedWatchlist) {
      try {
        setWatchlist(JSON.parse(savedWatchlist));
      } catch (err) {
        console.error("Error parsing watchlist:", err);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Save watchlist to localStorage when it changes
    localStorage.setItem("moviemate_watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  const getMovieById = (id: number) => {
    return movies.find((movie) => movie.id === id);
  };

  const getMoviesByCategory = (categoryId: number) => {
    return movies.filter((movie) => movie.categoryIds.includes(categoryId));
  };

  const searchMovies = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return movies.filter(
      (movie) =>
        movie.title.toLowerCase().includes(lowercaseQuery) ||
        movie.description.toLowerCase().includes(lowercaseQuery)
    );
  };

  const toggleWatchlist = (movieId: number) => {
    setWatchlist((prevWatchlist) => {
      if (prevWatchlist.includes(movieId)) {
        toast.success("Removed from watchlist");
        return prevWatchlist.filter((id) => id !== movieId);
      } else {
        toast.success("Added to watchlist");
        return [...prevWatchlist, movieId];
      }
    });
  };

  // Get 3 random movies for featured section
  const featuredMovies = movies
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  // Get newest movies (in a real app would be sorted by release date)
  const newReleases = [...movies]
    .sort((a, b) => b.year - a.year)
    .slice(0, 4);

  return (
    <MovieContext.Provider
      value={{
        movies,
        featuredMovies,
        newReleases,
        getMovieById,
        getMoviesByCategory,
        searchMovies,
        toggleWatchlist,
        watchlist,
        loading,
        error,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error("useMovies must be used within a MovieProvider");
  }
  return context;
};
