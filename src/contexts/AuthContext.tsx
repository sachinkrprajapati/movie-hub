
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data for demo purposes
const MOCK_USERS = [
  {
    id: 1,
    name: "John Doe",
    email: "user@example.com",
    password: "password123",
    role: "user" as const,
  },
  {
    id: 2,
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin" as const,
  },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for saved user in local storage
    const storedUser = localStorage.getItem("moviemate_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Error parsing stored user:", err);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      // In a real app, this would be an API call
      const foundUser = MOCK_USERS.find(
        (u) => u.email === email && u.password === password
      );

      if (!foundUser) {
        throw new Error("Invalid email or password");
      }

      // Remove password from user object
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem("moviemate_user", JSON.stringify(userWithoutPassword));
      toast.success("Login successful");
    } catch (err) {
      setError((err as Error).message);
      toast.error((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      // In a real app, this would be an API call
      const userExists = MOCK_USERS.some((u) => u.email === email);
      if (userExists) {
        throw new Error("Email already in use");
      }

      // In a real app, this would add the user to the database
      const newUser = {
        id: MOCK_USERS.length + 1,
        name,
        email,
        role: "user" as const,
      };

      setUser(newUser);
      localStorage.setItem("moviemate_user", JSON.stringify(newUser));
      toast.success("Registration successful");
    } catch (err) {
      setError((err as Error).message);
      toast.error((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("moviemate_user");
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
