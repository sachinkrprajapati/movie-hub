
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface Movie {
  id: number;
  title: string;
  description: string;
  poster_url: string;
  video_url: string;
  year: number;
  duration: number;
  rating: number;
  created_at?: string;
  updated_at?: string;
  categories?: { id: number; name: string }[];
}

interface MovieContextType {
  movies: Movie[];
  featuredMovies: Movie[];
  newReleases: Movie[];
  getMovieById: (id: number) => Promise<Movie | null>;
  getMoviesByCategory: (categoryId: number) => Promise<Movie[]>;
  searchMovies: (query: string) => Promise<Movie[]>;
  toggleWatchlist: (movieId: number) => Promise<void>;
  watchlist: number[];
  loading: boolean;
  error: string | null;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider = ({ children }: { children: ReactNode }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [watchlist, setWatchlist] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all movies on initial load
  useEffect(() => {
    fetchMovies();
    fetchUserWatchlist();
  }, []);

  // Fetch all movies from Supabase
  const fetchMovies = async () => {
    try {
      setLoading(true);
      
      // Fetch all movies
      const { data: movieData, error: movieError } = await supabase
        .from('movies')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (movieError) {
        throw movieError;
      }
      
      // Fetch movie categories for all movies
      const { data: categoryData, error: categoryError } = await supabase
        .from('movie_categories')
        .select(`
          movie_id,
          category_id,
          categories:category_id(id, name)
        `);
        
      if (categoryError) {
        throw categoryError;
      }
      
      // Group categories by movie_id
      const categoriesByMovie: Record<number, { id: number; name: string }[]> = {};
      categoryData.forEach(item => {
        if (!categoriesByMovie[item.movie_id]) {
          categoriesByMovie[item.movie_id] = [];
        }
        if (item.categories) {
          categoriesByMovie[item.movie_id].push(item.categories);
        }
      });
      
      // Add categories to movies
      const moviesWithCategories = movieData.map(movie => ({
        ...movie,
        categories: categoriesByMovie[movie.id] || []
      }));
      
      setMovies(moviesWithCategories);
    } catch (err: any) {
      console.error("Error fetching movies:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's watchlist
  const fetchUserWatchlist = async () => {
    const { data: session } = await supabase.auth.getSession();
    
    if (!session.session) {
      // User not logged in, use localStorage for temporary storage
      const savedWatchlist = localStorage.getItem("moviemate_watchlist");
      if (savedWatchlist) {
        try {
          setWatchlist(JSON.parse(savedWatchlist));
        } catch (err) {
          console.error("Error parsing watchlist:", err);
        }
      }
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('watchlists')
        .select('movie_id')
        .eq('user_id', session.session.user.id);
        
      if (error) {
        throw error;
      }
      
      if (data) {
        const movieIds = data.map(item => item.movie_id);
        setWatchlist(movieIds);
        
        // Sync with localStorage
        localStorage.setItem("moviemate_watchlist", JSON.stringify(movieIds));
      }
    } catch (err: any) {
      console.error("Error fetching watchlist:", err);
    }
  };

  // Get movie by ID
  const getMovieById = async (id: number): Promise<Movie | null> => {
    try {
      // First check if the movie is already in our state
      const cachedMovie = movies.find(movie => movie.id === id);
      if (cachedMovie) return cachedMovie;
      
      // If not, fetch from Supabase
      const { data: movie, error: movieError } = await supabase
        .from('movies')
        .select('*')
        .eq('id', id)
        .single();
        
      if (movieError) throw movieError;
      if (!movie) return null;
      
      // Fetch categories for this movie
      const { data: categoryData, error: categoryError } = await supabase
        .from('movie_categories')
        .select(`
          category_id,
          categories:category_id(id, name)
        `)
        .eq('movie_id', id);
        
      if (categoryError) throw categoryError;
      
      const movieWithCategories = {
        ...movie,
        categories: categoryData.map(item => item.categories)
      };
      
      return movieWithCategories;
    } catch (err) {
      console.error(`Error fetching movie ${id}:`, err);
      return null;
    }
  };

  // Get movies by category
  const getMoviesByCategory = async (categoryId: number): Promise<Movie[]> => {
    try {
      const { data: movieIds, error: movieIdsError } = await supabase
        .from('movie_categories')
        .select('movie_id')
        .eq('category_id', categoryId);
        
      if (movieIdsError) throw movieIdsError;
      
      if (!movieIds.length) return [];
      
      const ids = movieIds.map(item => item.movie_id);
      
      const { data: movies, error: moviesError } = await supabase
        .from('movies')
        .select('*')
        .in('id', ids);
        
      if (moviesError) throw moviesError;
      
      return movies;
    } catch (err) {
      console.error(`Error fetching movies for category ${categoryId}:`, err);
      return [];
    }
  };

  // Search movies by title or description
  const searchMovies = async (query: string): Promise<Movie[]> => {
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`);
        
      if (error) throw error;
      
      return data || [];
    } catch (err) {
      console.error(`Error searching movies with query "${query}":`, err);
      return [];
    }
  };

  // Toggle movie in user's watchlist
  const toggleWatchlist = async (movieId: number) => {
    const { data: session } = await supabase.auth.getSession();
    
    if (!session.session) {
      // User not logged in, use localStorage
      setWatchlist(prevWatchlist => {
        const newWatchlist = prevWatchlist.includes(movieId)
          ? prevWatchlist.filter(id => id !== movieId)
          : [...prevWatchlist, movieId];
        
        localStorage.setItem("moviemate_watchlist", JSON.stringify(newWatchlist));
        
        toast.success(
          prevWatchlist.includes(movieId) 
            ? "Removed from watchlist" 
            : "Added to watchlist"
        );
        
        return newWatchlist;
      });
      return;
    }
    
    try {
      if (watchlist.includes(movieId)) {
        // Remove from watchlist
        const { error } = await supabase
          .from('watchlists')
          .delete()
          .eq('user_id', session.session.user.id)
          .eq('movie_id', movieId);
          
        if (error) throw error;
        
        setWatchlist(prevWatchlist => prevWatchlist.filter(id => id !== movieId));
        toast.success("Removed from watchlist");
      } else {
        // Add to watchlist
        const { error } = await supabase
          .from('watchlists')
          .insert({
            user_id: session.session.user.id,
            movie_id: movieId
          });
          
        if (error) throw error;
        
        setWatchlist(prevWatchlist => [...prevWatchlist, movieId]);
        toast.success("Added to watchlist");
      }
    } catch (err: any) {
      console.error("Error toggling watchlist:", err);
      toast.error("Error updating watchlist");
    }
  };

  // Get 3 random movies for featured section
  const featuredMovies = movies
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  // Get newest movies (sorted by created_at)
  const newReleases = [...movies]
    .sort((a, b) => 
      new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
    )
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
