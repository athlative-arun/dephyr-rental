
import React from "react";
import { Routes, Route, Navigate, NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { User, Bike, CalendarDays, Star, LogOut } from "lucide-react";

// Import dashboard components
import UserProfile from "@/components/dashboard/UserProfile";
import UserBookings from "@/components/dashboard/UserBookings";
import UserReviews from "@/components/dashboard/UserReviews";

const UserDashboardPage: React.FC = () => {
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4">
                {currentUser.profileImage ? (
                  <img 
                    src={currentUser.profileImage} 
                    alt={currentUser.name} 
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-bold">{currentUser.name.charAt(0)}</span>
                )}
              </div>
              <div>
                <h2 className="font-semibold">{currentUser.name}</h2>
                <p className="text-sm text-gray-600">{currentUser.email}</p>
              </div>
            </div>
            
            <Separator className="mb-6" />
            
            <nav className="space-y-2">
              <NavLink to="/dashboard" end>
                {({ isActive }) => (
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className="w-full justify-start"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                )}
              </NavLink>
              
              <NavLink to="/dashboard/bookings">
                {({ isActive }) => (
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className="w-full justify-start"
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    My Bookings
                  </Button>
                )}
              </NavLink>
              
              <NavLink to="/dashboard/reviews">
                {({ isActive }) => (
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className="w-full justify-start"
                  >
                    <Star className="mr-2 h-4 w-4" />
                    My Reviews
                  </Button>
                )}
              </NavLink>
              
              <Separator className="my-4" />
              
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => logout()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </Button>
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="col-span-1 md:col-span-3">
          <Routes>
            <Route path="/" element={<UserProfile />} />
            <Route path="/bookings" element={<UserBookings />} />
            <Route path="/reviews" element={<UserReviews />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;
