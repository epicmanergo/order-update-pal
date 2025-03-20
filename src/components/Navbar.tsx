
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, Settings, PackageCheck } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-4 smooth-transition",
        scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-primary font-semibold text-xl"
          >
            <PackageCheck className="h-6 w-6" />
            <span>OrderTrack</span>
          </Link>
          
          <nav className="hidden md:flex space-x-1">
            <Link
              to="/"
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-1 transition-all",
                isActive("/")
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary"
              )}
            >
              <Home className="h-4 w-4" />
              <span>Track Order</span>
            </Link>
            <Link
              to="/admin"
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-1 transition-all",
                isActive("/admin")
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary"
              )}
            >
              <Settings className="h-4 w-4" />
              <span>Admin</span>
            </Link>
          </nav>
          
          <div className="md:hidden flex items-center">
            <Link
              to={isActive("/") ? "/admin" : "/"}
              className="p-2 rounded-full bg-secondary text-foreground"
            >
              {isActive("/") ? <Settings className="h-5 w-5" /> : <Home className="h-5 w-5" />}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
