
import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, MapPin } from "lucide-react";
import { useBookings } from "@/contexts/BookingContext";
import { format } from "date-fns";

const PaymentSuccessPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { getBookingById } = useBookings();
  
  const booking = bookingId ? getBookingById(bookingId) : undefined;
  
  useEffect(() => {
    if (!booking) {
      navigate("/dashboard/bookings");
    }
  }, [booking, navigate]);
  
  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Loading booking details...</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <div className="mb-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-xl text-gray-600 mb-8">Your booking has been confirmed.</p>
        
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h2 className="text-lg font-semibold mb-4">Booking Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div>
              <p className="text-sm text-gray-600">Booking ID</p>
              <p className="font-medium">{booking.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Bike</p>
              <p className="font-medium">{booking.bikeName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Pickup Date</p>
              <p className="font-medium">{format(new Date(booking.startDate), "dd MMM yyyy, HH:mm")}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Return Date</p>
              <p className="font-medium">{format(new Date(booking.endDate), "dd MMM yyyy, HH:mm")}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Shop</p>
              <p className="font-medium">{booking.shopName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Amount Paid</p>
              <p className="font-medium">₹{booking.totalAmount + booking.deposit}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Calendar className="h-5 w-5 text-blue-500" />
            </div>
            <div className="ml-3 text-left">
              <h3 className="text-blue-800 font-medium">Pickup Instructions</h3>
              <p className="text-blue-700 text-sm">Please arrive at the shop on time and bring your ID proof and the booking confirmation.</p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <MapPin className="h-5 w-5 text-blue-500" />
            </div>
            <div className="ml-3 text-left">
              <h3 className="text-blue-800 font-medium">Shop Location</h3>
              <p className="text-blue-700 text-sm">The shop is located at the provided address. You can use the map on the shop page for directions.</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <Button className="flex-1" variant="outline" onClick={() => navigate("/dashboard/bookings")}>
            View My Bookings
          </Button>
          <Button className="flex-1" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
