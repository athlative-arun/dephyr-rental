
import React from "react";
import { AuthProvider } from "./AuthContext";
import { BikeProvider } from "./BikeContext";
import { ShopProvider } from "./ShopContext";
import { BookingProvider } from "./BookingContext";
import { ReviewProvider } from "./ReviewContext";

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <ShopProvider>
        <BikeProvider>
          <BookingProvider>
            <ReviewProvider>
              {children}
            </ReviewProvider>
          </BookingProvider>
        </BikeProvider>
      </ShopProvider>
    </AuthProvider>
  );
};
