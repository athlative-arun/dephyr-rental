
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, User, LogOut, Bike, Calendar, Star } from "lucide-react";

const Navbar: React.FC = () => {
  const { isLoggedIn, currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-[#192655] shadow-sm">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/images/bikes/dephyr_logo.jpg" alt="Bangalore Wheels Logo" className="w-50 h-16 rounded-xl" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-7">
            <Link to="/" className="text-white hover:text-orange-500 font-medium">
              Home
            </Link>
            <Link to="/bikes" className="text-white hover:text-orange-500 font-medium">
              vehicles
            </Link>
            <Link to="/shops" className="text-white hover:text-orange-500 font-medium">
              Shops
            </Link>
            <Link to="/about" className="text-white hover:text-orange-500 font-medium">
              About Us
            </Link>
            <Link to="/contact" className="text-white hover:text-orange-500 font-medium">
              Contact
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 bg-orange-500 text-white rounded-full">
                    {currentUser?.profileImage ? (
                      <img
                        src={currentUser.profileImage}
                        alt={currentUser.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{currentUser?.name}</p>
                      <p className="text-sm text-muted-foreground">{currentUser?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/dashboard/bookings")}>
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>My Bookings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/dashboard/reviews")}>
                    <Star className="mr-2 h-4 w-4" />
                    <span>My Reviews</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="outline" onClick={() => navigate("/login")}>
                  Log In
                </Button>
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white" onClick={() => navigate("/signup")}>Sign Up</Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-orange-500 hover:text-primary"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 space-y-4 pb-4">
            <Link
              to="/"
              className="block py-2 text-white hover:text-primary font-medium"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              to="/bikes"
              className="block py-2 text-white hover:text-primary font-medium"
              onClick={toggleMenu}
            >
              Bikes
            </Link>
            <Link
              to="/shops"
              className="block py-2 text-white hover:text-primary font-medium"
              onClick={toggleMenu}
            >
              Shops
            </Link>
            <Link
              to="/about"
              className="block py-2 text-white hover:text-primary font-medium"
              onClick={toggleMenu}
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className="block py-2 text-white hover:text-primary font-medium"
              onClick={toggleMenu}
            >
              Contact
            </Link>
            
            {isLoggedIn ? (
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <div className="font-medium">{currentUser?.name}</div>
                <Link
                  to="/dashboard"
                  className="flex items-center py-2 text-gray-700 hover:text-primary"
                  onClick={toggleMenu}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>My Profile</span>
                </Link>
                <Link
                  to="/dashboard/bookings"
                  className="flex items-center py-2 text-gray-700 hover:text-primary"
                  onClick={toggleMenu}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>My Bookings</span>
                </Link>
                <Link
                  to="/dashboard/reviews"
                  className="flex items-center py-2 text-gray-700 hover:text-primary"
                  onClick={toggleMenu}
                >
                  <Star className="mr-2 h-4 w-4" />
                  <span>My Reviews</span>
                </Link>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center"
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </Button>
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={() => {
                    navigate("/login");
                    toggleMenu();
                  }}
                >
                  Log In
                </Button>
                <Button 
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={() => {
                    navigate("/signup");
                    toggleMenu();
                  }}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
