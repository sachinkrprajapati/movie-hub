
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Home, Film, Heart, Clock, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface Category {
  id: number;
  name: string;
}

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const isMobile = useIsMobile();
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "Action" },
    { id: 2, name: "Comedy" },
    { id: 3, name: "Drama" },
    { id: 4, name: "Horror" },
    { id: 5, name: "Romance" },
    { id: 6, name: "Sci-Fi" },
    { id: 7, name: "Thriller" },
    { id: 8, name: "Animation" }
  ]);

  // Close sidebar on route change on mobile
  useEffect(() => {
    if (isMobile && open) {
      const handleRouteChange = () => onClose();
      window.addEventListener("popstate", handleRouteChange);
      return () => window.removeEventListener("popstate", handleRouteChange);
    }
  }, [isMobile, open, onClose]);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && open && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 md:sticky md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 md:hidden">
          <span className="font-semibold">Menu</span>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex flex-col gap-2 p-4 md:pt-0">
          <NavLink
            to="/search"
            className="flex md:hidden items-center gap-2 rounded-md bg-sidebar-accent px-3 py-2 text-sm font-medium text-sidebar-accent-foreground transition-colors hover:bg-sidebar-accent/80"
          >
            <Search className="h-4 w-4" />
            <span>Search</span>
          </NavLink>
        </div>

        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className="flex flex-col gap-2 p-4 pt-0">
            <div className="py-2">
              <h2 className="mb-2 px-2 text-xs font-semibold text-sidebar-foreground/60">
                Browse
              </h2>
              <nav className="flex flex-col gap-1">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )
                  }
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </NavLink>
                <NavLink
                  to="/movies"
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )
                  }
                >
                  <Film className="h-4 w-4" />
                  <span>Movies</span>
                </NavLink>
                <NavLink
                  to="/watchlist"
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )
                  }
                >
                  <Heart className="h-4 w-4" />
                  <span>Watchlist</span>
                </NavLink>
                <NavLink
                  to="/recent"
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )
                  }
                >
                  <Clock className="h-4 w-4" />
                  <span>Recently Added</span>
                </NavLink>
              </nav>
            </div>

            <div className="py-2">
              <h2 className="mb-2 px-2 text-xs font-semibold text-sidebar-foreground/60">
                Categories
              </h2>
              <nav className="flex flex-col gap-1">
                {categories.map((category) => (
                  <NavLink
                    key={category.id}
                    to={`/category/${category.id}`}
                    className={({ isActive }) =>
                      cn(
                        "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )
                    }
                  >
                    {category.name}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        </ScrollArea>
      </aside>
    </>
  );
}
