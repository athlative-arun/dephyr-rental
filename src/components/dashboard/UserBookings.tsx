
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBookings } from "@/contexts/BookingContext";
import { useAuth } from "@/contexts/AuthContext";
import { Booking } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Bike, Clock, AlertTriangle, BadgeCheck, Ban, Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

const UserBookings: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { userBookings, cancelBooking } = useBookings();
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  
  const userId = currentUser?.id || "";
  const allBookings = userBookings(userId);
  
  const upcomingBookings = allBookings.filter(
    booking => 
      (booking.status === "pending" || booking.status === "confirmed") && 
      new Date(booking.endDate) >= new Date()
  );
  
  const pastBookings = allBookings.filter(
    booking => 
      booking.status === "completed" || 
      new Date(booking.endDate) < new Date()
  );
  
  const cancelledBookings = allBookings.filter(
    booking => booking.status === "cancelled"
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeVariant = (status: Booking["status"]): "outline" | "default" | "secondary" | "destructive" => {
    switch (status) {
      case "pending":
        return "outline";
      case "confirmed":
        return "default";
      case "completed":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;
    
    const success = cancelBooking(selectedBooking.id);
    
    if (success) {
      setCancelConfirmOpen(false);
      toast({
        title: "Booking cancelled",
        description: "Your booking has been cancelled successfully."
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to cancel booking. Please try again.",
        variant: "destructive"
      });
    }
  };

  const renderBookingCard = (booking: Booking) => (
    <Card key={booking.id} className="overflow-hidden">
      <div className="bg-muted/40 p-4 flex justify-between items-center border-b">
        <div>
          <h3 className="font-medium">{booking.bikeName}</h3>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin size={14} className="mr-1" />
            {booking.shopName}
          </div>
        </div>
        <Badge variant={getStatusBadgeVariant(booking.status)}>
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </Badge>
      </div>
      
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="h-16 w-16 rounded-md bg-gray-100 flex items-center justify-center">
              {booking.bikeImage ? (
                <img 
                  src={booking.bikeImage} 
                  alt={booking.bikeName} 
                  className="h-full w-full object-cover rounded-md"
                />
              ) : (
                <Bike className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <div>
              <div className="flex items-center text-sm">
                <Calendar size={14} className="mr-1 text-gray-400" />
                <span>
                  {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <Clock size={14} className="mr-1 text-gray-400" />
                <span>
                  {booking.duration} {booking.duration === 1 ? 'day' : 'days'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="font-medium">₹{booking.totalAmount.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">
              {booking.paymentStatus === "completed" ? "Paid" : "Pending"}
            </div>
          </div>
        </div>
        
        {booking.status === "pending" && (
          <div className="bg-yellow-50 text-yellow-800 p-3 rounded-md flex items-start">
            <AlertTriangle size={16} className="mr-2 mt-0.5" />
            <div className="text-sm">
              Your booking is waiting for confirmation from the shop.
            </div>
          </div>
        )}
        
        {booking.status === "confirmed" && (
          <div className="bg-green-50 text-green-800 p-3 rounded-md flex items-start">
            <BadgeCheck size={16} className="mr-2 mt-0.5" />
            <div className="text-sm">
              Your booking is confirmed! Present your booking ID {booking.id} at the shop.
            </div>
          </div>
        )}
        
        <div className="flex justify-end space-x-3">
          {(booking.status === "pending" || booking.status === "confirmed") && (
            <Button 
              variant="outline" 
              className="text-red-500"
              onClick={() => {
                setSelectedBooking(booking);
                setCancelConfirmOpen(true);
              }}
            >
              <Ban size={16} className="mr-2" />
              Cancel
            </Button>
          )}
          
          {booking.status === "confirmed" && booking.paymentStatus !== "completed" && (
            <Button onClick={() => navigate(`/payment/${booking.id}`)}>
              Make Payment
            </Button>
          )}
          
          {booking.status === "completed" && (
            <Button variant="outline">
              Write Review
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Bookings</CardTitle>
          <CardDescription>
            View and manage all your bike bookings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upcoming" className="space-y-4">
            <TabsList>
              <TabsTrigger value="upcoming" className="flex items-center">
                <Clock size={16} className="mr-2" />
                Upcoming
                {upcomingBookings.length > 0 && (
                  <span className="ml-2 rounded-full bg-primary w-6 h-6 text-xs flex items-center justify-center text-white">
                    {upcomingBookings.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="past">
                <Check size={16} className="mr-2" />
                Past
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                <Ban size={16} className="mr-2" />
                Cancelled
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="space-y-4">
              {upcomingBookings.length > 0 ? (
                upcomingBookings.map(booking => renderBookingCard(booking))
              ) : (
                <div className="text-center py-8">
                  <h3 className="font-medium text-lg mb-2">No upcoming bookings</h3>
                  <p className="text-muted-foreground mb-4">You don't have any upcoming bike bookings.</p>
                  <Button className="bg-orange-500" onClick={() => navigate("/bikes")}>
                    Browse Bikes
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="past" className="space-y-4">
              {pastBookings.length > 0 ? (
                pastBookings.map(booking => renderBookingCard(booking))
              ) : (
                <div className="text-center py-8">
                  <h3 className="font-medium text-lg mb-2">No past bookings</h3>
                  <p className="text-muted-foreground">You don't have any completed bike bookings yet.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="cancelled" className="space-y-4">
              {cancelledBookings.length > 0 ? (
                cancelledBookings.map(booking => renderBookingCard(booking))
              ) : (
                <div className="text-center py-8">
                  <h3 className="font-medium text-lg mb-2">No cancelled bookings</h3>
                  <p className="text-muted-foreground">You don't have any cancelled bike bookings.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Dialog open={cancelConfirmOpen} onOpenChange={setCancelConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="py-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Bike:</span>
                  <span>{selectedBooking.bikeName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Dates:</span>
                  <span>
                    {formatDate(selectedBooking.startDate)} - {formatDate(selectedBooking.endDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Shop:</span>
                  <span>{selectedBooking.shopName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Amount:</span>
                  <span>₹{selectedBooking.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelConfirmOpen(false)}>
              Keep Booking
            </Button>
            <Button variant="destructive" onClick={handleCancelBooking}>
              Cancel Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserBookings;
